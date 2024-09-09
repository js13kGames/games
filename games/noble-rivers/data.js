const products = {
    gold: {
        name: 'gold',
        requires: {
            food: 2,
        }
    },
    globalGold: {
        name: 'global-gold',
        requires: {
            gold: 1,
        }
    },
    wood: {
        name: 'wood',
        requires: {
            food: 3,
        }
    },
    food: {
        name: 'food',
        requires: {
        }
    },
    metal: {
        name: 'metal',
        requires: {
            food: 2,
        }
    },
    soldier: {
        name: 'soldier',
        requires: {
            metal: 1,
            food: 1,
        }
    },
};


const buildings = {
    farm: {
        produces: {kind: 'item', item: products.food, near: 'water'},
    },
    woodcutter: {
        produces: {kind: 'item', item: products.wood, near: 'forest'},
    },
    mine: {
        produces: {kind: 'item', item: products.metal, near: 'mountain'},
    },
    barracks: {
        produces: {kind: 'unit', item: products.soldier},
    },
    market: {
        produces: {kind: 'item', item: products.gold},
    },
    treasury: {
        produces: {kind: 'item', item: products.globalGold},
    },
}