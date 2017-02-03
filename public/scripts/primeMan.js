
var myApp = angular.module( 'myApp', [] );

// "CONST"
var UP = 0;
var RIGHT = 1;
var DOWN = 2;
var LEFT = 3;

myApp.controller( 'primeBeingController', [ '$scope', '$http', function( $scope, $http ){
  var vm = this;

  var canvas = {
    size: 560 // px
  }; //end canvas

  // the grid
  vm.grid = [];
  // pellets
  vm.pellets = [];

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

  vm.coreLoop = function(){
    vm.drawBoard();
    vm.updatePlayerPosition();
    vm.drawPlayer();
    // animate player
    player.animFrame++;
    if( player.animFrame > player.animThreshold ){
      player.mouthAgape = !player.mouthAgape;
      player.animFrame = 0;
    }
    // schedule coreLoop
    if( !vm.menuMode ) setTimeout( vm.coreLoop, 50 );
  }; //end coreLoop

  vm.drawBoard = function(){
    var c = document.getElementById( "myCanvas" );
    var ctx = c.getContext( "2d" );
    // clear canvas
    ctx.clearRect(0, 0, c.width, c.height);
    var left = 0;
    for (var i = 0; i < vm.grid.length; i++) {
      for (var j = 0; j < vm.grid[i].length; j++) {
        var tile = new Image();
        if( vm.grid[i][j] == 0 ){
          // set tile image
          tile.src = "images/map/empty0.png";
        } // end empty
        else if( vm.grid[i][j] == 1 ){
          // set tile image
          tile.src = "images/map/full0.png";
        } // end empty
        ctx.drawImage( tile, i * player.size, j * player.size, player.size, player.size );
      } // end for
      j = 0;
    } // end for
    /// - draw pellets - ///
    for (var k = 0; k < vm.pellets.length; k++) {
      for (var l = 0; l < vm.pellets[k].length; l++) {
        var pellet = new Image();
        if( vm.pellets[k][l] == 0 ){
          // set pellet image
          pellet.src = "images/pellet.png";
          ctx.drawImage( pellet, k * player.size+10, l * player.size+10, player.size/2, player.size/2 );
        } // empty cell with pellet
      } // end for
      l = 0;
    } // end for
  }; //end drawBoard

  vm.drawPlayer = function(){
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
    if( vm.pellets[ player.position.x ][ player.position.y ] == 0 ){
      vm.pellets[ player.position.x ][ player.position.y ] = 1;
    }
  } // end drawImage

  vm.getGrid = function(){
    $http({
      method: 'GET',
      url: '/getGrid'
    }).then( function( response ){
      console.log( 'back with:', response );
      vm.grid = response.data;
      angular.copy( vm.grid, vm.pellets );
      vm.startGame();
    }); //end http
  }; // end getGrid

  $scope.key = function($event){
    if( $event.keyCode == 38 ){
      player.nextDirection = UP;
    }
    else if( $event.keyCode == 39 ){
      player.nextDirection = RIGHT;
    }
    else if( $event.keyCode == 40 ){
      player.nextDirection = DOWN;
    }
    else if( $event.keyCode == 37 ){
      player.nextDirection = LEFT;
    }
  } // end get key stroke

  vm.init = function(){
    vm.menuMode = true;
  }; //end init function

  vm.quitGame = function(){
    if( verbose ) console.log( 'in quitGame');
    vm.menuMode = true;
  };

  vm.resetPlayer = function(){
    player.left = 240;
    player.top = 240;
    player.direction = 1;
    player.nextDirection = 1;
    player.animFrame = 0;
    player.mouthAgape = false;
  }; // end funk

  vm.startGame = function(){
    if( verbose ) console.log( 'in startGame');
    vm.resetPlayer();
    vm.menuMode = false;
    vm.coreLoop();
  }; // end funk

  vm.updatePlayerPosition = function(){
    if( player.left % player.size == 0 && player.top % player.size == 0 && player.nextDirection != player.direction ){
      player.direction = player.nextDirection;
    } // end reverse vertical
    if( ( player.direction == UP && player.nextDirection == DOWN ) || ( player.direction == DOWN && player.nextDirection == UP ) || ( player.direction == RIGHT && player.nextDirection == LEFT ) || ( player.direction == LEFT && player.nextDirection == RIGHT ) ){
      player.direction = player.nextDirection;
    } // end reverse horizontal
    else if( ( player.direction == UP || player.direction == DOWN ) && ( player.nextDirection == RIGHT || player.nextDirection == LEFT ) && ( player.top % player.size == 0 ) ){
      player.direction = player.nextDirection;
    } // move horz from vert
    else if( ( player.direction == RIGHT || player.direction == LEFT ) && ( player.nextDirection == UP || player.nextDirection == DOWN ) && ( player.left % player.size == 0 ) ){
      player.direction = player.nextDirection;
    } // move vert from horz
    // move player
    if( player.direction == UP && player.top > 0){
      if( vm.grid[ player.position.x ][ player.position.y ] == 0 ){
        player.top -= player.speed;
      }
    } //end up
    else if( player.direction == RIGHT && player.left < canvas.size - player.size ){
      if( vm.grid[ player.position.x+1 ][ player.position.y ] == 0 ){
        player.left += player.speed;
      }
    } //end right
    else if( player.direction == DOWN && player.top < canvas.size - player.size ){
      if( vm.grid[ player.position.x ][ player.position.y+1 ] == 0 ){
        player.top += player.speed;
      }
    } //end down
    else if( player.direction == LEFT && player.left > 0 ){
      if( vm.grid[ player.position.x ][ player.position.y ] == 0 ){
        player.left -= player.speed;
      }
    } //end left
  }; //end updatePlayerPosition

  vm.init();

}]); // end primeManController
