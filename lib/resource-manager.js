const ResourceManager = (function () {
    const registry = [];

    function set(key, resouce) {
        registry[key] = resouce;
    }

    function get(key) {
        if (registry[key]) {
            return registry[key];
        }

        return null;
    }

    function run(key, callback) {
        const resouce = registry[key];
        if (!resouce) {
            return null;
        }
        if ('function' === typeof callback) {
            try {
                callback.call(resouce, resouce);
            } catch (err) {
                console.log('Resource callback error', err);
            }
        }
    }

    return {
        set: set,
        register: set,
        get: get,
        run: run,
    }
})();