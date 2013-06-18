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

// var Player = function(data){

//     var setPos = function(x, y, z){

//     }

//     return {

//     }
// };

var generateSocketToken = function(){
    return crypto.randomBytes(20).toString('hex');
};

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


MZ.PLAYERS = {};
MZ.GAMES = {};
MZ.NEW_PLAYERS = [];
//object with all sockets currently connected
MZ.SOCKETS = {};

io.sockets.on('connection', function (socket) {
    
    socket.token = generateSocketToken();
    MZ.SOCKETS[socket.token] = socket;

    //events with front/back prefix for easier development
    socket.emit('back-connected', { socketToken: socket.token });

    socket.on('front-newgame', function() {
        var hash = generateGameHash();

        //przypisac hash do playera
        //usunac playera z new_players
        //dodac gre do games
        MZ.GAMES[hash] = [];

        socket.emit('back-newgame', {hash: hash});
    });

    socket.on('front-playermoved', function(data){
        socket.emit('back-playermoved');
    });

    socket.on('disconnect', function () {
        delete MZ.SOCKETS[socket.token];

        //socket.broadcast.emit('back-playerleft');
    });
});