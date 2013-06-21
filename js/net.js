var PRTC = PRTC || {};

PRTC.net = {   
  
  gameId: null,
  socket: null,
  connected: false,
  
  init: function net_init() {
    this.socket = io.connect('http://localhost:8060');
    
    var $ = function(id) { return document.getElementById(id); }
    this.newGameBtn = $('newGame');
    this.inviteBtn = $('invite');
    
    this.inviteBtn.hidden = true;
    
    this.socket.on('back-newgame', function (data) {
        this.gameId = data.hash;
        window.location.hash = this.gameId;
        this.newGameBtn.hidden = true;
        this.inviteBtn.dataset.gameId = window.location;
        this.inviteBtn.hidden = false;
        if (data.secondPlayer) {
          PRTC.opponentsPaddle.hidden = false;
          PRTC.scene.add(PRTC.opponentsPaddle.cube);
          PRTC.ball.addCollidingObjects([PRTC.opponentsPaddle.cube]);
          PRTC.game.start();
        }
    }.bind(this));
    
    this.socket.on('back-playermove', function(data) {
      if (data.x) {
        PRTC.opponentsPaddle.cube.position.x = data.x;
      }
      if (data.ball) {
        var vel = data.ball.vel;
        var pos = data.ball.position;
        PRTC.ball.velocityX = vel.x;
        PRTC.ball.velocityY = vel.y;
        PRTC.ball.sphere.position = pos;
        PRTC.ball.sphere.position.x += vel.x;
        PRTC.ball.sphere.position.y += vel.y;
      }
    });
    
    if (window.location.hash !== '') {
      
      this.socket.emit('front-newgame', {data: window.location.hash.substr(1)});
      
    } else {
      this.newGameBtn.addEventListener('click', function() {
        PRTC.scene.remove(PRTC.opponentsPaddle.cube);
        PRTC.ball.removeFromCollidingObjects(PRTC.opponentsPaddle.cube);
        this.socket.emit('front-newgame', '');
      }.bind(this));
    }
  },
  
  send: function(position, ball) {
      this.socket.emit('front-playermove', {x: position, ball: ball});
  }
  
}