var myApp = angular.module( 'myApp', [] );

myApp.controller( 'primeManController', [ '$scope', '$http', function( $scope, $http ){
    var canvas = {
      size: 560 // px
    }; //end canvas

    // the grid
    $scope.grid = [];

  // player
  var player = {
    left: 240, // start posX
    top: 240, // startPosY
    speed: 4, // pixels/frame
    direction: 1, // 0 = up, 1 = right, 2 = down, 3 = left
    nextDirection: 1,
    size: 40, // size in px, same as grid tile
    animFrame: 0, // starting frame
    animThreshold: 9, // frames until different display state
    mouthAgape: false,
    position: {
      x: 0,
      y: 0
    }
  }; //end plyer

  // verbose?
  var verbose = false;

  $scope.coreLoop = function(){
    $scope.drawBoard();
    $scope.updatePlayerPosition();
    $scope.drawPlayer();
    // animate player
    player.animFrame++;
    if( player.animFrame > player.animThreshold ){
      player.mouthAgape = !player.mouthAgape;
      player.animFrame = 0;
    }
    // schedule coreLoop
    if( !$scope.menuMode ) setTimeout( $scope.coreLoop, 50 );
  }; //end coreLoop

  $scope.drawBoard = function(){
    var c = document.getElementById( "myCanvas" );
    var ctx = c.getContext( "2d" );
    // clear canvas
    ctx.clearRect(0, 0, c.width, c.height);
    var left = 0;
    for (var i = 0; i < $scope.grid.length; i++) {
      for (var j = 0; j < $scope.grid[i].length; j++) {
        var tile = new Image();
        if( $scope.grid[i][j] == 0 ){
          // set player image
          tile.src = "images/map/empty0.png";
        } // end empty
        else if( $scope.grid[i][j] == 1 ){
          // set player image
          tile.src = "images/map/full0.png";
        } // end empty
        ctx.drawImage( tile, i * player.size, j * player.size, player.size, player.size );
      } // end for
      j = 0;
    } // end for
  }; //end drawBoard

  $scope.drawPlayer = function(){
    var c = document.getElementById( "myCanvas" );
    var ctx = c.getContext( "2d" );
    // draw player
    var plr = new Image();
    plr.onload = function () {
        ctx.drawImage( plr, player.left, player.top, player.size, player.size );
    } // end draw player
    // set player image
    if( player.mouthAgape ){
      plr.src = "images/player/player2.png";
    } // mouth open
    else{
      plr.src = "images/player/player1.png";
    } // mouth closed
    player.position.x = parseInt( player.left / player.size );
    player.position.y = parseInt( player.top / player.size );
    if( verbose ) console.log( player.position );
  } // end drawImage

  $scope.getGrid = function(){
    $http({
      method: 'GET',
      url: '/getGrid'
    }).then( function( response ){
      console.log( 'back with:', response );
      $scope.grid= response.data;
      $scope.startGame();
    }); //end http
  }; // end getGrid

  $scope.key = function($event){
    if ($event.keyCode == 38){
        // up
        player.nextDirection = 0;
    }
    else if ($event.keyCode == 39){
      // right
      player.nextDirection = 1;
    }
    else if ($event.keyCode == 40){
      // down
      player.nextDirection = 2;
    }
    else if ($event.keyCode == 37){
      // left
      player.nextDirection = 3;
    }
  } // end get key stroke

  $scope.init = function(){
    $scope.menuMode = true;
  }; //end init function

  $scope.quitGame = function(){
    if( verbose ) console.log( 'in quitGame');
    $scope.menuMode = true;
  };

  $scope.resetPlayer = function(){
    player.left = 240;
    player.top = 240;
    player.direction = 1;
    player.nextDirection = 1;
    player.animFrame = 0;
    player.mouthAgape = false;
  }; // end funk

  $scope.startGame = function(){
    if( verbose ) console.log( 'in startGame');
    $scope.resetPlayer();
    $scope.menuMode = false;
    $scope.coreLoop();
  }; // end funk

  $scope.updatePlayerPosition = function(){
    if( player.left % player.size == 0 && player.top % player.size == 0 && player.nextDirection != player.direction ){
      player.direction = player.nextDirection;
    } // end reverse vertical
    if( ( player.direction == 0 && player.nextDirection == 2 ) || ( player.direction == 2 && player.nextDirection == 0 ) || ( player.direction == 1 && player.nextDirection == 3 ) || ( player.direction == 3 && player.nextDirection == 1 ) ){
      player.direction = player.nextDirection;
    } // end reverse horizontal
    else if( ( player.direction == 0 || player.direction == 2 ) && ( player.nextDirection == 1 || player.nextDirection == 3 ) && ( player.top % player.size == 0 ) ){
      player.direction = player.nextDirection;
    } // move horz from vert
    else if( ( player.direction == 1 || player.direction == 3 ) && ( player.nextDirection == 0 || player.nextDirection == 2 ) && ( player.left % player.size == 0 ) ){
      player.direction = player.nextDirection;
    } // move vert from horz
    // move player
    if( player.direction == 0 && player.top > 0){
      if( $scope.grid[ player.position.x ][ player.position.y ] == 0 ){
        player.top -= player.speed;
      }
    } //end up
    else if( player.direction == 1 && player.left < canvas.size - player.size ){
      if( $scope.grid[ player.position.x+1 ][ player.position.y ] == 0 ){
        player.left += player.speed;
      }
    } //end right
    else if( player.direction == 2 && player.top < canvas.size - player.size ){
      if( $scope.grid[ player.position.x ][ player.position.y+1 ] == 0 ){
        player.top += player.speed;
      }
    } //end down
    else if( player.left > 0 ){
      if( $scope.grid[ player.position.x ][ player.position.y ] == 0 ){
        player.left -= player.speed;
      }
    } //end left
  }; //end updatePlayerPosition

  $scope.init();

}]); // end primeManController
