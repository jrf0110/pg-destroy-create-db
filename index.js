var pg = require('pg');

module.exports = destroyCreateFactory;

var defaults = module.exports.defaults = {
  // The db we connect to create/destroy
  transientDb: 'postgres'
};

var errorCodes = module.exports.errorCodes = {
  // When an error happens, we'll ignore db [does not] exist errors
  // depending on the context
  dbExists: '42P04'
, dbDoesNotExist: '3D000'
};

var tmpls = module.exports.tmpls = {
  destroy: function( data ){
    return 'drop database "' + data.name + '"';
  }

, create: function( data ){
    return 'create database "' + data.name + '"';
  }
};

module.exports.destroyCreateProto = {
  /**
   * Destroy the database then re-create it ignoring any
   * `database exists` `database does not exist` errors
   * @param  {Function} callback the callback(error)
   */
  destroyCreate: function( callback ){
    this.destroy( function( error ){
      if ( error ) return callback( error );

      this.create( callback );
    }.bind( this ));
  }

  /**
   * Destroy the database, ignoring any `database does not exist` errors
   * @param  {Function} callback the callback(error)
   */
, destroy: function( callback ){
    this.query( tmpls.destroy({ name: this.dbName }), function( error ){
      if ( error && error.code !== errorCodes.dbDoesNotExist ){
        return callback( error );
      }

      callback();
    });
  }

  /**
   * Create the database, ignoring any `database exists` errors
   * @param  {Function} callback the callback(error)
   */
, create: function( callback ){
    this.query( tmpls.create({ name: this.dbName }), function( error ){
      if ( error && error.code !== errorCodes.dbExists ){
        return callback( error );
      }

      callback();
    });
  }

  /**
   * Query the transient db
   * @param  {String}   query    the query
   * @param  {Function} callback the callback(error)
   */
, query: function( query, callback ){
    pg.connect( this.transientDb, function( error, client, release ){
      if ( error ) return callback( error );

      client.query( query, function( error, result, rows ){
        release();
        callback( error, result, rows );
      });
    }.bind( this ));
  }
};

function destroyCreateFactory( connStr, options ){
  if ( typeof connStr !== 'string' ){
    throw new Error('Must provide connection string');
  }

  options = options || {};

  for ( var key in defaults ){
    if ( !(key in options) ) options[ key ] = defaults[ key ];
  }

  var dbName =  connStr.indexOf('/') === -1 ? connStr : connStr.substring(
                  connStr.lastIndexOf('/') + 1
                );

  return Object.create( extend({
    connStr:      connStr

  , dbName:       dbName

  , options:      options

  , transientDb:  connStr.substring(
                    0, connStr.lastIndexOf('/') + 1
                  ) + options.transientDb

  }, module.exports.destroyCreateProto ));
}

function extend( a, b ){
  for ( var key in b ) a[ key ] = b[ key ];
  return a;
}