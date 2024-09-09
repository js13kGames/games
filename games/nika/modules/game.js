m.set(
    'game',
    (
        function module(
            common,
            engine,
            Player
        ) {
            'use strict';
            var
                game;
            game = {
                blue: null,
                green: null,
                load: load,
                on: false,
                players: [],
                race: 1,
                races: {
                    1: {
                        distribution: [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 6, 6],
                        lap: 0,
                        laps: 12,
                        raceTime: 10000,
                        reversed: false
                    },
                    2: {
                        distribution: [1, 2, 2, 3, 3, 4, 4],
                        lap: 0,
                        laps: 12,
                        raceTime: 6000,
                        reversed: false
                    },
                    3: {
                        distribution: [1, 2, 2, 3, 3, 3, 6],
                        lap: 0,
                        laps: 7,
                        raceTime: 5000,
                        reversed: false
                    },
                    4: {
                        distribution: [1, 7, 7, 7, 8, 8, 9, 10],
                        lap: 0,
                        laps: 7,
                        raceTime: 4000,
                        reversed: false
                    },
                    5: {
                        distribution: [1, 2, 2, 3],
                        lap: 0,
                        laps: 7,
                        raceTime: 5000,
                        reversed: false
                    },
                    6: {
                        distribution: [1, 2, 2, 3, 3],
                        lap: 0,
                        laps: 5,
                        raceTime: 3500,
                        reversed: false
                    },
                    7: {
                        distribution: [1, 1, 1, 2, 2, 2, 4, 4, 4, 6],
                        lap: 0,
                        laps: 5,
                        raceTime: 2500,
                        reversed: false
                    },
                    total: 7
                },
                score: {
                    '1p': 0,
                    '2p': 0,
                    text: ''
                }
            };
            return game;
            //
            // functions
            //
            function finish() {
                if (
                    game.blue.distance < 0
                ) {
                    game.blue.win();
                    game.score['1p'] += 1;
                } else {
                    game.blue.lose();
                }
                if (
                    game.green.distance < 0
                ) {
                    game.green.win();
                    game.score['2p'] += 1;
                } else {
                    game.green.lose();
                }
                game.score.text = game.score['1p'] + '-' + game.score['2p'];
                setTimeout(
                    function onTimeout() {
                        game.blue.off(game.score.text, wasLast());
                        game.green.off(game.score.text, wasLast());
                        game.on = false;
                        game.race += 1;
                    },
                    6000
                );
            }
            function finishByCrash() {
                if (
                    !game.blue.crashed
                    &&
                    game.green.crashed
                ) {
                    game.blue.win();
                    game.score['1p'] += 1;
                    game.green.lose();
                }
                if (
                    game.blue.crashed
                    &&
                    !game.green.crashed
                ) {
                    game.green.win();
                    game.score['2p'] += 1;
                    game.blue.lose();
                }
                if (
                    game.blue.crashed
                    &&
                    game.green.crashed
                ) {
                    game.blue.lose();
                    game.green.lose();
                    game.score.text = game.score['1p'] + '-' + game.score['2p'];
                    setTimeout(
                        function onTimeout() {
                            game.blue.off(game.score.text, wasLast());
                            game.green.off(game.score.text, wasLast());
                            game.on = false;
                        },
                        6000
                    );
                    return;
                }
                game.score.text = game.score['1p'] + '-' + game.score['2p'];
                setTimeout(
                    function onTimeout() {
                        game.blue.off(game.score.text, wasLast());
                        game.green.off(game.score.text, wasLast());
                        game.on = false;
                        game.race += 1;
                    },
                    6000
                );
            }
            function forEachPlayerNode(playerNode) {
                playerNode.addEventListener('touchstart', join);
                //
                // functions
                //
                function join() {
                    var
                        id;
                    if (
                        game.race > game.races.total
                    ) {
                        return;
                    }
                    id = playerNode.getAttribute('id');
                    if (
                        game[id] === null
                    ) {
                        game[id] = Player(
                            document.querySelector('#' + id),
                            document.querySelector('#' + id + ' .distance'),
                            document.querySelector('#' + id + ' .face'),
                            document.querySelector('#' + id + ' .laps'),
                            document.querySelector('#' + id + ' .laurel'),
                            document.querySelector('#' + id + ' .rb'),
                            document.querySelector('#' + id + ' .score'),
                            document.querySelector('#' + id + ' .time'),
                            id,
                            playerNode.dataset.nickname
                        );
                        game.players.push(game[id]);
                    }
                    if (
                        game.on === false
                    ) {
                        game[id].on(game.races[game.race].laps, game.races[game.race].raceTime);
                        start();
                    }
                }
            }
            function load(playerNodes) {
                common.toArray(playerNodes).forEach(forEachPlayerNode);
            }
            function run() {
                var
                    responses,
                    timeouts;
                responses = 0;
                timeouts = engine.run(game.races[game.race].distribution);
                // game.players.forEach(function forEachPlayer(player, index) {
                //     setTimeout(
                //         function onTimeout() {
                //             player.challenge(done);
                //         },
                //         timeouts[index]
                //     );
                // });
                setTimeout(
                    function onTimeout() {
                        game.blue.challenge(done);
                    },
                    timeouts[0]
                );
                setTimeout(
                    function onTimeout() {
                        game.green.challenge(done);
                    },
                    timeouts[1]
                );
                if (
                    game.blue.distance > 200
                ) {
                    setTimeout(
                        function onTimeout() {
                            game.blue.rubberband();
                        },
                        timeouts[0] - 300
                    );
                }
                if (
                    game.green.distance > 200
                ) {
                    setTimeout(
                        function onTimeout() {
                            game.green.rubberband();
                        },
                        timeouts[1] - 300
                    );
                }
                //
                // functions
                //
                function done() {
                    responses += 1;
                    if (
                        responses === 2
                    ) {
                        turn();
                    }
                }
            }
            function reverse() {
                if (
                    Math.abs(game.blue.distance) < 20
                    &&
                    game.race > 4
                    &&
                    game.race < game.races.total
                    &&
                    game.races[game.race].reversed === false
                ) {
                    game.blue.node.classList.add('reverseAlert');
                    game.green.node.classList.add('reverseAlert');
                    setTimeout(
                        function onTimeout() {
                            game.blue.node.classList.remove('reverseAlert');
                            game.green.node.classList.remove('reverseAlert');
                            document.body.classList.add('upside-down');
                            run();
                            setTimeout(
                                function onTimeout() {
                                    document.body.classList.remove('upside-down');
                                },
                                5000
                            );
                        },
                        1000
                    );
                    return true;
                }
            }
            function start() {
                if (
                    (
                        game.blue
                        &&
                        game.blue.ready
                    )
                    &&
                    (
                        game.green
                        &&
                        game.green.ready
                    )
                ) {
                    game.on = true;
                    run();
                }
            }
            function turn() {
                game.races[game.race].lap += 1;
                game.blue.distance = game.blue.time - game.green.time;
                game.green.distance = game.green.time - game.blue.time;
                game.players.forEach(function forEachPlayer(player) {
                    player.update();
                });
                if (
                    game.blue.crashed
                    ||
                    game.green.crashed
                ) {
                    finishByCrash();
                    return;
                }
                if (
                    game.races[game.race].lap === game.races[game.race].laps
                ) {
                    finish();
                    return;
                }
                if (
                    reverse()
                ) {
                    return;
                }
                run();
            }
            function wasLast() {
                return game.race + 1 > game.races.total;
            }
        }(
            m.get('common'),
            m.get('engine'),
            m.get('player')
        )
    )
);
