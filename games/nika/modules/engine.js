m.set(
    'engine',
    (
        function module() {
            'use strict';
            var
                engine;
            engine = {
                position: position,
                run: run
            };
            return engine;
            //
            // functions
            //
            function generateTimeout(distribution) {
                var
                    interval,
                    position,
                    seconds;
                position = getRandomIntInclusive(0, distribution.length - 1);
                seconds = distribution[position];
                interval = seconds * 1000;
                interval += getRandomIntInclusive(-299, 299);
                return interval;
            }
            function getRandomIntInclusive(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            function position(height, width) {
                return {
                    height: getRandomIntInclusive(50, height - 64),
                    width: getRandomIntInclusive(50, width - 64)
                };
            }
            function run(distribution) {
                return [
                    generateTimeout(distribution),
                    generateTimeout(distribution)
                ];
            }
        }()
    )
);
