var app = require('http').createServer(main),
    io = require('socket.io').listen(app),
    crypto = require('crypto'),
    fs = require('fs'),

    //game object
    MZ = {};

app.listen(8060);

function main (req, res) {
    fs.readFile(__dirname + '/index.html',
    function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }

        res.writeHead(200);
        res.end(data);
    });
}

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
    this.y = null;
    this.z = null;
    this.game = null;

    var me = this;

    var setPos = function(x, y, z){
        me.x = x;
        me.y = y;
        me.z = z;
    };

    var getId = function(){
        return me.id;
    };

    var joinGame = function(gameHash){
        this.game = gameHash;
    };

    var getGame = function(){
        return this.game;
    };

    return {
        setPos : setPos,
        getId : getId,
        joinGame : joinGame,
        getGame : getGame
    };
};

var removeGamePlayer = function(gameId, player){
    var game = MZ.GAMES[gameId],
        idx = null;

    for (var i=0, l=game.length; i<l; i+=1){
        if (game[i] === player){
            idx = i;
            break;
        }
    }

    if (idx != null){
        game.splice(idx, 1);
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
//object with connected players not currently in game
MZ.NEW_PLAYERS = {};
//object with all sockets currently connected
MZ.SOCKETS = {};

io.sockets.on('connection', function (socket) {
    var token  = socket.id,
        player = new Player(token);

    MZ.SOCKETS[token] = socket;
    MZ.NEW_PLAYERS[token] = player;

    //events with front/back prefix for easier development
    socket.emit('back-connected', { socketToken: token });

    socket.on('front-newgame', function() {
        var hash = generateGameHash(),
            player = MZ.NEW_PLAYERS[socket.id];

        MZ.PLAYERS[player.getId()] = player;
        MZ.GAMES[hash] = [socket];
        delete MZ.NEW_PLAYERS[player.getId()];

        //join to new room
        //https://github.com/LearnBoost/socket.io/wiki/Rooms
        socket.join(hash);

        //debug
        var rooms = io.sockets.manager.roomClients[socket.id];

        socket.emit('back-newgame', {hash: hash, rooms: rooms});
    });

    //TODO events for second player joining game needed

    //TODO save position change
    socket.on('front-playermoved', function(data){
        var player = MZ.PLAYERS[socket.id],
            gameHash = player.getGame();

        socket.broadcast.to(gameHash).emit('back-playermoved');
    });

    socket.on('disconnect', function () {
        var player = MZ.PLAYERS[socket.id],
            gameHash = player.getGame(),
            game   = MZ.GAMES[gameHash];

        removeGamePlayer(game, player);

        //second player still in the game
        if (game.length > 0){
            socket.broadcast.to(gameHash).emit('back-playerleft');
        } else {
            delete MZ.GAMES[player.getGame()];
        }

        delete MZ.SOCKETS[socket.id];
        delete MZ.PLAYERS[socket.id];
    });
});