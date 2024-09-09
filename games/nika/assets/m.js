window.m = (function m() {
    var
        vault;
    vault = {};
    return {
        get: get,
        set: set
    };
    //
    // function
    //
    function get(name) {
        return vault[name];
    }
    function set(name, module) {
        vault[name] = module;
    }
}());
