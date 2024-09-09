var io = require('sandbox-io');

io.on('connection', function(socket) {
  socket.on('init', function (data) {
    socket.broadcast.emit('join', data);
  });

  ['exploded', 'reset', 'heartbeat', 'leave'].forEach(function (e) {
    socket.on(e, function (data) {
      socket.broadcast.emit(e, data);
    });
  });
});