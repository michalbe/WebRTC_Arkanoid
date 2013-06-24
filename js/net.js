var PRTC = PRTC || {};

PRTC.net = {

  gameId: null,
  socket: null,
  connected: false,

  init: function net_init() {
    this.socket = io.connect(window.location.origin);

    var $ = function(id) { return document.getElementById(id); }
    this.inviteBtn = $('invite');

    this.socket.on('back-newgame', function (data) {
        this.gameId = data.hash;
        this.inviteBtn.href = window.location + '#' + this.gameId;
        if (data.secondPlayer) {
          PRTC.opponentsPaddle.hidden = false;
          PRTC.scene.add(PRTC.opponentsPaddle.cube);
          PRTC.ball.addCollidingObjects([PRTC.opponentsPaddle.cube]);
          PRTC.game.start();
          this.inviteBtn.style.display = "none";
          document.querySelector("canvas").style.display = "block";
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
      this.inviteBtn.style.display = "none";
    } else {
        document.querySelector("canvas").style.display = "none";
        PRTC.scene.remove(PRTC.opponentsPaddle.cube);
        PRTC.ball.removeFromCollidingObjects(PRTC.opponentsPaddle.cube);
        this.socket.emit('front-newgame', '');
    }
  },

  send: function(position, ball) {
      this.socket.emit('front-playermove', {x: position, ball: ball});
  }

}
