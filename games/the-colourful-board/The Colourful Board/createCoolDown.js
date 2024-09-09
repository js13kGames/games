const createCoolDown = (delay) => {
    let lastUpdateTime = 0;

    return () => {
        console.log('delay: ', delay);
        console.log('Date.now() - lastUpdateTime: ', Date.now() - lastUpdateTime);
        if (Date.now() - lastUpdateTime > delay) {
            lastUpdateTime = Date.now();
            return true;
        }
        else false;
    }
}

module.exports = createCoolDown;