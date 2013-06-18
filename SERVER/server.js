var app = require('http').createServer(main),
    io = require('socket.io').listen(app),
    crypto = require('crypto'),
    fs = require('fs'),

    //game object
    MZ = {};

app.listen(8080);

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

    var me = this;

    var setPos = function(x, y, z){
        me.x = x;
        me.y = y;
        me.z = z;
    };

    var getId = function(){
        return me.id;
    };

    return {
        setPos : setPos,
        getId : getId
    };
};

//all game players
MZ.PLAYERS = {};
//object with all games running (pvp) - games also act as rooms for broadcasting messages
MZ.GAMES = {};
//object with connected players not in game
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
        MZ.GAMES[hash] = [player];
        delete MZ.NEW_PLAYERS[player.getId()];

        //join to new room
        //https://github.com/LearnBoost/socket.io/wiki/Rooms
        socket.join(hash);

        //debug
        var rooms = io.sockets.manager.roomClients[socket.id];

        socket.emit('back-newgame', {hash: hash, rooms: rooms});
    });

    //TODO events for second player joining game needed

    socket.on('front-playermoved', function(data){
        socket.emit('back-playermoved');
    });

    socket.on('disconnect', function () {
        delete MZ.SOCKETS[socket.id];
        delete MZ.PLAYERS[socket.id];

        //TODO if no player left in room, delete game
    });
});