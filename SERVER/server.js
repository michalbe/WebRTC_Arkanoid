var app = require('http').createServer(main),
    io = require('socket.io').listen(app),
    fs = require('fs'),
    MZ = {},
    main;

app.listen(8080);

main = function (req, res) {
    fs.readFile(__dirname + '/index.html',
    function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
    });
}

MZ.PLAYERS = {};
MZ.PLAYER_POS = {};

io.sockets.on('connection', function (socket) {
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
});