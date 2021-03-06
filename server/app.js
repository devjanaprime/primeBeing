var express = require( 'express' );
var app = express();
var path = require( 'path' );
var bodyParser = require( 'body-parser' );
var port = process.env.PORT || 5678;

// uses
app.use( express.static( 'public' ) );
app.use( bodyParser.urlencoded( { extended: true } ) );

// server up
app.listen( port, function(){
  console.log( 'server up on:', port );
}); //end server up

// home base
app.get( '/', function( req, res ){
  console.log( 'ooooohhh it is time to do some gaming...');
  res.sendFile( path.resolve( 'public/views/index.html' ) );
}); //end home base

// send back grid
app.get( '/getGrid', function( req, res ){
  console.log( 'getGrid route hit' );
  var grid = [
    [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
    [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
    [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1 ],
    [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1 ],
    [ 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1 ],
    [ 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
    [ 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
    [ 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
    [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
    [ 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1 ],
    [ 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1 ],
    [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
    [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
    [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ]
  ];
  res.send( grid );
}); //end getGrid
