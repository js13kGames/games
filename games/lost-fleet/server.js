let random_color = () => 'hsl(' + ((Math.random() + 0.618033988749895) * 360) % 360 + ',50%,50%)'

let clients = {};
let commands = [];
let arena;
let waiting = {};

let start_game = (players) => {
  let mothership_stats = {
    attack: {
      range: 0.7,
      power: 0.7,
      efficiency: 0.7
    },
    mine: {
      range: 0.7,
      power: 0.7,
      efficiency: 0.7
    },
    construct: {
      range: 0.7,
      power: 0.7,
      efficiency: 0.7
    },
    misc: {
      acceleration: 0.7,
      capacity: 0.7,
      defence: 0.7,
      'transfer range': 0.7
    }
  }

  let arena = new Arena({
    users: players.map((client, i) => {
      let pos = [normal(Math.random(), Math.random()) * 5000, normal(Math.random(), Math.random()) * 5000];
      client.id = i;
      return {
        id: client.id,
        color: random_color(),
        username: client.username,
        units: [
          { pos: pos, vel: [0, 0], stats: mothership_stats, health: new Stats(mothership_stats).cost, activated: true }
        ]
      }
    }),
    id_counter: 0
  })

  let commands = []

  players.forEach((client) => {
    let command_unit = (unit_id, ...params) => {
      if (arena.users[client.id].units[unit_id] !== undefined) {
        commands.push(['command_unit', unit_id, ...params]);
      }
    };
    let make_baby = (pos, stats) => {
      Object.setPrototypeOf(stats, Object.prototype);
      commands.push(['make_baby', client.id, pos, stats]);
    }
    client.command_handler = (type, ...params) => {
      if (type === 'command_unit') command_unit(...params);
      if (type === 'make_baby') make_baby(...params);
    };
    client.socket.emit('create_arena', arena.serialize(), client.id);
  });

  setInterval(() => {
    let tick_commands = commands;
    commands = [];
    for (let command of tick_commands) {
      arena.receive(command);
    }
    arena.tick();
    for (let client of players) {
      client.socket.emit('tick', tick_commands);
    }
  }, 100);
}

module.exports = function(socket) {
  let client = { socket: socket, command_handler: () => {}, current_game: null };
  clients[client.socket.id] = client

  socket.on('create_game', (name, username) => {
    name = name.toLowerCase();
    if (!waiting[name]) {
      waiting[name] = {};
    }
    if (client.current_game && waiting[client.current_game]) {
      waiting[client.current_game].values()
        .forEach((client) => client.socket.emit('user_left', client.socket.id));
      delete waiting[client.current_game][client.socket.id];
    }
    client.username = username;
    client.current_game = name;
    waiting[name].values().forEach((cl) => {
      cl.socket.emit('new_users', [[client.socket.id, username]]);
    })
    waiting[name][client.socket.id] = client;
    socket.emit('new_users', waiting[name].values().map((cl) => [cl.socket.id, cl.username]))
  })

  socket.on('start_game', () => {
    start_game(waiting[client.current_game].values());
    delete waiting[client.current_game];
  })

  socket.on('command', args => {
    client.command_handler(...args)
  })
}
