var app = require('http').createServer(main),
    io = require('socket.io').listen(app),
    fs = require('fs'),
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

//game object
MZ.PLAYERS = {};
MZ.PLAYER_POS = {};

io.sockets.on('connection', function (socket) {

    //events with front/back prefix for easier development
    socket.emit('back-playerjoined', { hello: 'world' });

    socket.on('front-playermoved', function(data){
        socket.emit('back-playermoved');
    });

    socket.on('front-playerleft', function(data){
        socket.emit('back-playerleft');
    });

    socket.on('front-playerwin', function(data){
        socket.emit('back-playerwin');
    });

    socket.on('front-playerloose', function(data){
        socket.emit('back-playerloose');
    });

    socket.on('disconnect', function () {
    });
});