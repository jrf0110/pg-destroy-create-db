var assert          = require('assert');
var pg              = require('pg');
var dbCreateDestroy = require('../');

var CONNSTRING = 'postgres://localhost/pg_destroy_create_test';

// beforeEach( function( done ){
//   this.timeout(3000);
//   setTimeout( done, 2000 );
// });

describe('PG Destroy Create', function(){
  it('.destroyCreate()', function( done ){
    dbCreateDestroy( CONNSTRING )
      .destroyCreate( function( error ){
        assert( !error, error ? error.message : '' );
        pg.connect( CONNSTRING, function( error, client, release ){
          assert( !error, error ? error.message : '' );
          release();
          client.end();
          done();
        });
      });
  });

  it('.create()', function( done ){
    dbCreateDestroy( CONNSTRING )
      .create( function( error ){
        assert( !error, error ? error.message : '' );
        pg.connect( CONNSTRING, function( error, client, release ){
          assert( !error, error ? error.message : '' );
          release();
          client.end();
          done();
        });
      });
  });

  it('.destroy()', function( done ){
    this.timeout(10000);
    dbCreateDestroy( CONNSTRING )
      .destroy( function( error ){
        assert( !error, error ? error.message : '' );
        pg.connect( CONNSTRING, function( error, client, release ){
          assert( error, error ? error.message : '' );
          release();
          done();
        });
      });
  });
});