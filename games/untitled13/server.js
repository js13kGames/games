var S = {};
S.games = [];

io.on("connection", function(socket) {
  socket.emit2_partner = function(s, data) {
    if (socket.partner_id != null) {
      var partner_socket = io.sockets.sockets.get(socket.partner_id);

      // when a socket gets disconnected, io.sockets.socket() returns a default socket (with no added methods)
      partner_socket.emit && partner_socket.emit(s, data);
    }
  }

  socket.on("disconnect", function() {
    let partner = io.sockets.sockets.get(socket.partner_id)
    if (partner) {
      partner.partner_id = null;
      socket.emit2_partner("game_disconnected");
    }
  })

  socket.on("game_create", function() {
    var game = {
      player1_uid: socket.id,
      player2_uid: null,
      players_swapped: 0,
      map: null
    };

    S.games.push(game);

    socket.emit("game_created", game);
  })

  socket.on("game_join", function(data) {
    var i, partner_socket;

    for (i in S.games) {
      if (S.games[i].player1_uid == data) {
        if (S.games[i].player2_uid == null) {
          S.games[i].player2_uid = socket.id;

          partner_socket = io.sockets.sockets.get(S.games[i].player1_uid);

          // bind them together
          socket.partner_id = S.games[i].player1_uid;
          socket.options = [ 1, 0, 0 ];
          partner_socket.partner_id = S.games[i].player2_uid;
          partner_socket.options = [ 1, 0, 0 ];

          socket.emit("menu");
          socket.emit2_partner("menu");

          return;
        }
      }
    }

    socket.emit("game_disconnected");
  })

  socket.on("message", function(data) {
    socket.emit2_partner("message", data);
  })

  socket.on("options_update", function(data) {
    var i, partner_socket;

    // do some checks before using the options
    if (data.length != 3 || socket.partner_id == null) {
      return
    }

    data = [ data[0] | 0, data[1] | 0, data[2] | 0 ];

    partner_socket = io.sockets.sockets.get(socket.partner_id);

    if (!partner_socket) {
      return
    }

    socket.emit2_partner("options_update", data);
    socket.options = data;

    // check if options match for players and they are ready to play
    if (socket.options[0] == partner_socket.options[0] && // new game
      socket.options[1] == partner_socket.options[1] && // switch sides
      socket.options[2] == partner_socket.options[2] && // ready to play
      socket.options[2] == 1
    )

    for (i in S.games) {
      if (S.games[i].player1_uid == socket.id || S.games[i].player2_uid == socket.id) {
        if (data[1]) {
          // S.games[i].player_swapped should be an integer
          S.games[i].players_swapped = (!S.games[i].players_swapped) | 0;
        }

        // if "new level" is checked
        if (data[0]) {
          S.games[i].seed = (Math.random() * 1000000) | 0;
        }
        socket.emit("game_started", [ S.games[i].player1_uid, S.games[i].player2_uid, S.games[i].players_swapped, null, S.games[i].seed ]);
        socket.emit2_partner("game_started", [ S.games[i].player1_uid, S.games[i].player2_uid, S.games[i].players_swapped, null, S.games[i].seed ]);

        return;
      }
    }
  });

  socket.emit("welcome", [ socket.id, 1 ]);
})