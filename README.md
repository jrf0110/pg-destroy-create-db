# PG Destroy Create DB

> Given a connection string, destroy/create a database in postgres.

Connects to a transient database gleaned from the passed in connection string (default: 'postgres'). Useful for testing modules that need database setup/teardown.

__install__

```
npm install -S pg-destroy-create-db
```

__usage__

```javascript
require('pg-destroy-create-db')('postgres://localhost/some_db')
  .destroyCreate( function( error ){
    /* ... */
  })
```

## API

This module exports a single factory function.

### function( connection_string, options ) -> [destroyCreatInterface](./destroyCreateInterface)

__Options__

```javascript
{
  // The database we connect to to perform create/drop ops
  transientDb: 'postgres'
}
```

#### `destroyCreateInterface`

##### `.destroyCreate( callback )`

Destroy the database then re-create it ignoring any `database exists`/`database does not exist` errors

##### `.destroy( callback )`

Destroy the database, ignoring any `database does not exist` errors

##### `.create( callback )`

Create the database, ignoring any `database exists` errors