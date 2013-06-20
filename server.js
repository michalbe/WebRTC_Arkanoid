var st = require('node-static'),
    crypto = require('crypto'),
    fs = require('fs'),
    http = require('http'),
    file = new(st.Server)();

var app = http.createServer(function (req, res) {
  file.serve(req, res);
}).listen(8060);

    var io = require('socket.io').listen(app),
    //game object
    MZ = {};

var generateGameHash = function(){
    var seed = crypto.randomBytes(20),
        //we leave the first 6 chars of the hash 
        hash = crypto.createHash('sha1').update(seed).digest('hex').substr(0, 6);
     
    //still check for uniqueness
    if (MZ.GAMES[hash]){
        return generateGameHash();
    }

    return hash;
};

var Player = function(id){
    this.id = id;
    this.x = null;
    this.game = null;

    var me = this;

    var setX = function(x){
        me.x = x;
    };

    var getX = function(){
        return {
            x: me.x,
            y: me.y
        };
    };

    var getId = function(){
        return me.id;
    };

    var getGame = function(){
        return this.game;
    };

    var setGame = function(hash){
        this.game = hash;
    }

    return {
        setX : setX,
        getX : getX,
        getId : getId,
        getGame : getGame,
        setGame : setGame
    };
};

var removeGamePlayer = function(gameId, player){
    var game = MZ.GAMES[gameId],
        idx = null;

    if (game){
        for (var i=0, l=game.length; i<l; i+=1){
            if (game[i] === player){
                idx = i;
                break;
            }
        }

        if (idx != null){
            game.splice(idx, 1);
        }
    }
};

//all game players
MZ.PLAYERS = {};

/*object with all games running (pvp) - games also act as rooms for broadcasting messages
 so that we can easily select players playing together. The structure is :
 {
    'gameHash' : [ player1, player2 ]
 }
*/
MZ.GAMES = {};

io.sockets.on('connection', function (socket) {
    var token  = socket.id,
        player = new Player(token);

    MZ.PLAYERS[token] = player;

    //events with front/back prefix for easier development
    socket.emit('back-connected', { socketToken: token });

    socket.on('front-newgame', function(data) {
        var hash = data.data,
            player = MZ.PLAYERS[socket.id],

            //is it the second player in game ?
            secondPlayer = false,
            game;

        if (!player.getGame()){
            if (!hash){
                hash = generateGameHash(); 
            }

            game = MZ.GAMES[hash];

            if (game != null && game.length !== 2){
                MZ.GAMES[hash].push(player);

                secondPlayer = true;
            } else {
                if (game != null && game.length === 2){
                    //2 players already
                    hash = generateGameHash();
                }
                MZ.GAMES[hash] = [player];
            }

            player.setGame(hash);

            //join to room
            socket.join(hash);
        } else {
            hash = player.getGame();
            secondPlayer = true;
        }

        io.sockets.in(hash).emit('back-newgame', {hash: hash, secondPlayer: secondPlayer});    
    });

    socket.on('front-playermove', function(data){
        var player = MZ.PLAYERS[socket.id],
            gameHash = player.getGame(),
            posX = data.x;

        player.setX(posX);

        socket.broadcast.to(gameHash).emit('back-playermove', {x: posX});
    });

    socket.on('disconnect', function () {
        var player = MZ.PLAYERS[socket.id],
            gameHash = player.getGame(),
            game   = MZ.GAMES[gameHash];

        removeGamePlayer(game, player);

        //second player still in the game
        if (game && game.length > 0){
            socket.broadcast.to(gameHash).emit('back-playerleft', {gameHash: gameHash});
        } else {
            delete MZ.GAMES[player.getGame()];
        }
        delete MZ.PLAYERS[socket.id];
    });
});