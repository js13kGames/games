m.set(
    'common',
    (
        function module() {
            'use strict';
            var
                common;
                common = {
                    toArray: toArray
                };
                return common;
                //
                // functions
                //
                function toArray(arrayToBe) {
                    var
                    array;
                array = Array.prototype.slice.call(arrayToBe)
                return array;
            }
        }()
    )
);
