let addCoin = indexOfRoadSegmentCoveredByCar => {
    let { road, roadIndex } = _getTargetSegment();    
    if (_canAddCoin(road, roadIndex, indexOfRoadSegmentCoveredByCar)) {
        let { x, y } = _getCoinPosition(road);
        _addCoin(x, y, road);
    }
}

let removeCoin = coin => {
    coin.road.hasCoin = false;
    gameContext.coins = gameContext.coins.filter(c => c != coin);
}

let _canAddCoin = (targetSegment, targetIndex, indexOfRoadSegmentCoveredByCar) => {
    if (gameContext.coins.length >= _maxCoins()) {
        return false;
    } 
    if (targetSegment.hasCoin) {
        return false;
    }
    if (Math.abs(indexOfRoadSegmentCoveredByCar - targetIndex) < 5) {
        return false;
    }
    return true;
}

let _getTargetSegment = () => {
    var index = Math.floor(Math.random() * gameContext.roads.length);
    return { road: gameContext.roads[index], roadIndex: index }
}

let _getCoinPosition = segment => {
    var { x, y, w, h } = getRoadRectangle(segment); 
    return { x: Math.round(x + Math.random() * w), y: Math.round(y + Math.random() * h) };
}

let _getCoinValue = () => {    
    let value1 = gameContext.valueNeeded();
    let value2 = value1 / 4;
    let length = Math.abs(value1 + value2);
    let min = value1 > 0 ? -value2 : value1;
    let value = Math.floor(min + Math.random() * length);
    return value == 0 ? 1 : value;
}

let _getCoinTicksToLive = () => MINCOINTICKS + (MAXCOINTICKS-MINCOINTICKS) * Math.random();

let _addCoin = (x, y, road) => {
    var coin = createCoin(x, y, _getCoinValue(), _getCoinTicksToLive());
    gameContext.coins.push(coin);
    coin.road = road;
    road.hasCoin = true;    
}

let _maxCoins = () => {
    let score = Math.abs(gameContext.valueNeeded());
    if (score < 10) return 40;
    if (score < 50) return 30;
    if (score < 100) return 20;
    return 10;
}

const MAXCOINTICKS = 500;
const MINCOINTICKS = 100;
