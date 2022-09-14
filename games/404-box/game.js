//--- Constant -----
const levels = [
    {
        total0: 1,
        total4: 0,
        totalCorrect: 1,
        map : [
            [1,1,1,1,1],
            [1,1,1,1,1],
            [1,4,2,4,1],
            [1,1,1,1,1],
            [1,1,1,1,1]
        ]
    },
    {
        total0: 1,
        total4: 0,
        totalCorrect: 1,
        map : [
            [1,1,1,1,1],
            [1,1,4,1,1],
            [1,1,2,1,1],
            [1,1,4,1,1],
            [1,1,1,1,1]
        ]
    },
    {
        total0: 1,
        total4: 0,
        totalCorrect: 1,
        map : [
            [1,1,1,1,1],
            [1,1,1,4,1],
            [1,1,2,1,1],
            [1,4,1,1,1],
            [1,1,1,1,1]
        ]
    },    
    {
        total0: 2,
        total4: 0,
        totalCorrect: 2,
        map : [
            [2,4,2,2,2],
            [2,2,2,2,2],
            [2,4,2,4,2],
            [2,2,2,2,2],
            [2,2,2,2,2]
        ]
    },
    {
        total0: 0,
        total4: 2,
        totalCorrect: 2,
        map : [
            [2,2,2,2,2],
            [2,2,2,2,2],
            [2,4,0,2,2],
            [2,2,4,2,2],
            [2,2,2,2,2]
        ]
    },
    {
        total0: 0,
        total4: 2,
        totalCorrect: 2,
        map : [
            [2,2,2,2,2],
            [2,2,2,2,2],
            [2,0,4,2,2],
            [2,0,4,2,2],
            [2,2,2,2,2]
        ]
    },
    {
        total0: 1,
        total4: 1,
        totalCorrect: 2,
        map : [
            [2,2,2,2,2],
            [2,0,4,2,2],
            [2,4,2,2,2],
            [2,2,4,2,2],
            [2,2,2,2,2]
        ]
    },
    {
        total0: 1,
        total4: 1,
        totalCorrect: 3,
        map : [
            [2,2,2,2,2],
            [2,4,4,2,2],
            [2,2,2,2,2],
            [2,4,4,4,2],
            [2,2,2,2,2]
        ]
    },
    {
        total0: 1,
        total4: 1,
        totalCorrect: 3,
        map : [
            [2,2,2,2,2],
            [2,4,2,4,2],
            [2,0,0,4,2],
            [2,2,4,2,2],
            [2,2,2,2,2]
        ]
    },
    {
        total0: 1,
        total4: 2,
        totalCorrect: 3,
        map : [
            [2,2,2,2,2],
            [2,4,4,2,2],
            [2,2,0,0,2],
            [2,2,2,2,2],
            [2,2,2,2,2]
        ]
    },
    {
        total0: 2,
        total4: 2,
        totalCorrect: 4,
        map : [
            [2,4,0,2,2],
            [2,2,4,2,1],
            [2,2,0,2,2],
            [4,1,2,4,2],
            [2,2,2,2,2]
        ]
    },
    {
        total0: 1,
        total4: 2,
        totalCorrect: 3,
        map : [
            [2,2,2,2,2],
            [2,4,4,2,2],
            [2,4,0,2,2],
            [4,2,0,2,2],
            [2,2,2,0,2]
        ]
    },
    {
        total0: 1,
        total4: 3,
        totalCorrect: 4,
        map : [
            [2,2,2,2,2],
            [2,4,2,0,2],
            [2,0,4,0,2],
            [2,2,2,2,4],
            [2,2,2,2,2]
        ]
    },
    {
        total0: 2,
        total4: 3,
        totalCorrect: 6,
        map : [
            [2,2,2,2,2],
            [2,0,2,0,4],
            [4,0,2,2,2],
            [2,1,4,2,2],
            [2,2,2,2,2]
        ]
    },
    {
        total0: 2,
        total4: 4,
        totalCorrect: 6,
        map : [
            [2,4,2,2,2],
            [2,2,4,0,2],
            [2,4,2,0,2],
            [2,4,2,1,2],
            [2,2,2,2,2]
        ]
    }
]

const objectName = {
    cursorText: 'cursorText',
    mainContainer: 'mainContainer',
    grid: 'grid',
    inventory0: "inventory0",
    inventory4: "inventory4",
    nextBtn: "nextBtn",
    prevBtn: "prevBtn",
    totalFoundtext: "totalFoundtext",
    levelText: "levelText",
    nextLevelText: "nextLevelText"
}

const gridState = {
    EMPTY: 'empty',
    FILLED: 'filled',
    BLOCKED: 'blocked',
    FIXED: 'fixed'
}

const gridColor = {
    EMPTY: "#44916a",
    BLOCKED: "#12b18e",
    FIXED: "#12b18e",
    CORRECT: "#ffaa00",
    FILLED: "#0f5042",
}

const saveData = {
    currentMaxLevel : "currentMaxLevel"
}
//-----------------

let currentLevel = 0;
let currentMaxLevel = localStorage.getItem(saveData.currentMaxLevel) || 0;
let maxLevel = levels.length-1;

let totalCorrect = 0;
let totalPlacement = 0;

let indexGrid = 'A';
let gridManager = [];

const prevBtn = document.getElementById(objectName.prevBtn);
const nextBtn = document.getElementById(objectName.nextBtn);

const cursorText = document.getElementById(objectName.cursorText);
cursorText.style.visibility = "hidden";

const levelText = document.getElementById(objectName.levelText);
const nextLevelText = document.getElementById(objectName.nextLevelText);
const totalFoundtext = document.getElementById(objectName.totalFoundtext);

const mainContainer = document.getElementById(objectName.mainContainer);

for (let i=0; i<5; i++) {
    let gridSub = [];
    for (let j=0; j<5; j++) {
        const id = `${objectName.grid}${indexGrid}${j+1}`;
        const gridEl = document.getElementById(id);
        let gridTextEl = document.createTextNode("4");
        gridEl.appendChild(gridTextEl);

        const grid = {
            box: gridEl,
            id: id,
            y: i,
            x: j,
            state: gridState.EMPTY,
            totalCorrect: 0,
            initColor: "",
            init: function() {
                this.box.innerHTML = " ";
                this.box.style.opacity = "1";
                this.totalCorrect = 0;
                this.box.style.backgroundColor = gridColor.FIXED;
                this.box.style.color = "white";
            },
            setToInitIfFilled: function() {
                this.box.innerHTML = " ";
                this.state = gridState.EMPTY;
                this.box.style.backgroundColor = this.initColor;
            },
            setToCorrect: function() {
                this.box.style.backgroundColor = gridColor.CORRECT;
                this.totalCorrect++;
            },
            setToUnCorrect: function() {                
                if (this.totalCorrect === 0) return;
                this.totalCorrect--;                
                
                if (this.totalCorrect === 0) {
                    this.box.style.backgroundColor = this.initColor;
                }
            }
        }

        gridSub.push(grid);
    }

    gridManager.push(gridSub);
    indexGrid = String.fromCharCode(indexGrid.charCodeAt(0) + 1);
}

const getGrid = (id) => {
    for (let i=0; i<5; i++) {
        for (let j=0; j<5; j++) {
            if (gridManager[i][j].id === id) {
                return gridManager[i][j];
            }
        }
    }

    return null;
}

const increaseTotalCorrect = (amount = 0) => {
    totalCorrect += amount;
    totalFoundtext.innerHTML = `404 Found : ${totalCorrect}/${levels[currentLevel].totalCorrect}`
}

const setThreeGridCorrectOrNot = (isCorrect = false, isToUnCorrect = false, grid, grid1, grid2) => {

    if (grid == null || grid1 == null || grid2 == null) return;

    if (!isToUnCorrect) {
        if (isCorrect) {
            increaseTotalCorrect(1);
            grid.setToCorrect();
            grid1.setToCorrect();
            grid2.setToCorrect();
        } 
    } else {
        if (isCorrect) {
            increaseTotalCorrect(-1);
            grid.setToUnCorrect();
            grid1.setToUnCorrect();
            grid2.setToUnCorrect();
        }
    }  
}

const checkGridCorrect = (grid, isToUnCorrect = false) => {
    const y = grid.y;
    const x = grid.x;
    if (grid.state !== gridState.BLOCKED && grid.state !== gridState.EMPTY) {
        let grid1 = null;
        let grid2 = null;
        let isCorrect = false;

        if (grid.box.innerHTML === "0") {
            // check vertical
            if (y - 1 >= 0 && y + 1 <= 4) {
                grid1 = gridManager[y - 1][x];
                grid2 = gridManager[y + 1][x];
                isCorrect = grid1.box.innerHTML === grid2.box.innerHTML &&
                grid1.box.innerHTML === "4"; 
                setThreeGridCorrectOrNot(isCorrect, isToUnCorrect, grid, grid1, grid2);              
            }

            // check horizontal
            if (x - 1 >= 0 && x + 1 <= 4) {
                grid1 = gridManager[y][x - 1];
                grid2 = gridManager[y][x + 1];
                isCorrect = grid1.box.innerHTML === grid2.box.innerHTML &&
                grid1.box.innerHTML === "4";
                setThreeGridCorrectOrNot(isCorrect, isToUnCorrect, grid, grid1, grid2);
            }
            
            // check diagonal from bottom left to top right
            if (x + 1 <= 4 && y - 1 >= 0 && x - 1 >= 0 && y + 1 <= 4) {
                grid1 = gridManager[y - 1][x + 1];
                grid2 = gridManager[y + 1][x - 1];
                isCorrect = grid1.box.innerHTML === grid2.box.innerHTML &&
                grid1.box.innerHTML === "4";
                setThreeGridCorrectOrNot(isCorrect, isToUnCorrect, grid, grid1, grid2);
            }
    
            // check diagonal from bottom right to top left
            if (x + 1 <= 4 && y + 1 <= 4 && x - 1 >= 0 && y - 1 >= 0) {
                grid1 = gridManager[y + 1][x + 1];
                grid2 = gridManager[y - 1][x - 1];
                isCorrect = grid1.box.innerHTML === grid2.box.innerHTML &&
                grid1.box.innerHTML === "4";
                setThreeGridCorrectOrNot(isCorrect, isToUnCorrect, grid, grid1, grid2);
            }
            
            
        } else if (grid.box.innerHTML === "4") {

            // check top
            if (y - 2 >= 0) {
                grid1 = gridManager[y - 1][x];
                grid2 = gridManager[y - 2][x];
                isCorrect = grid1.box.innerHTML === "0" && grid2.box.innerHTML === "4";
                setThreeGridCorrectOrNot(isCorrect, isToUnCorrect, grid, grid1, grid2);
            }

            // check bottom
            if (y + 2 <= 4) {
                grid1 = gridManager[y + 1][x];
                grid2 = gridManager[y + 2][x];
                isCorrect = grid1.box.innerHTML === "0" && grid2.box.innerHTML === "4";
                setThreeGridCorrectOrNot(isCorrect, isToUnCorrect, grid, grid1, grid2);
            }

            // check left
            if (x - 2 >= 0) {
                grid1 = gridManager[y][x - 1];
                grid2 = gridManager[y][x - 2];
                isCorrect = grid1.box.innerHTML === "0" && grid2.box.innerHTML === "4";
                setThreeGridCorrectOrNot(isCorrect, isToUnCorrect, grid, grid1, grid2);
            }

            // check right
            if (x + 2 <= 4) {
                grid1 = gridManager[y][x + 1];
                grid2 = gridManager[y][x + 2];
                isCorrect = grid1.box.innerHTML === "0" && grid2.box.innerHTML === "4";
                setThreeGridCorrectOrNot(isCorrect, isToUnCorrect, grid, grid1, grid2);
            }

            // check top right diagonal
            if (x + 2 <= 4 && y - 2 >= 0) {
                grid1 = gridManager[y - 1][x + 1];
                grid2 = gridManager[y - 2][x + 2];
                isCorrect = grid1.box.innerHTML === "0" && grid2.box.innerHTML === "4";
                setThreeGridCorrectOrNot(isCorrect, isToUnCorrect, grid, grid1, grid2);
            }

            // check top left diagonal
            if (x - 2 >= 0 && y - 2 >= 0) {
                grid1 = gridManager[y - 1][x - 1];
                grid2 = gridManager[y - 2][x - 2];
                isCorrect = grid1.box.innerHTML === "0" && grid2.box.innerHTML === "4";
                setThreeGridCorrectOrNot(isCorrect, isToUnCorrect, grid, grid1, grid2);
            }

            // check bottom left diagonal
            if (x - 2 >= 0 && y + 2 <= 4) {
                grid1 = gridManager[y + 1][x - 1];
                grid2 = gridManager[y + 2][x - 2];
                isCorrect = grid1.box.innerHTML === "0" && grid2.box.innerHTML === "4";
                setThreeGridCorrectOrNot(isCorrect, isToUnCorrect, grid, grid1, grid2);
            }
            

            // check bottom right diagonal
            if (x + 2 <= 4 && y + 2 <= 4) {
                grid1 = gridManager[y + 1][x + 1];
                grid2 = gridManager[y + 2][x + 2];
                isCorrect = grid1.box.innerHTML === "0" && grid2.box.innerHTML === "4";
                setThreeGridCorrectOrNot(isCorrect, isToUnCorrect, grid, grid1, grid2);
            }
        }        
    }    
};

// --- Inventory ----

const inventory = {
    box: null,
    amountBox: null,
    amount: 0
}

let activeInventory = null;
const getInventory = (id, type) => {
    return {
        type,
        box: document.getElementById(id),
        amountBox: document.getElementById(id).childNodes[3],
        amount: 2,        
        increaseAmount: function() {
            this.amount++;
            this.amountBox.innerHTML = this.amount;
        },
        decreaseAmount: function() {
            this.amount--;
            this.amountBox.innerHTML = this.amount;
        },
        init: function() {
            this.box.addEventListener("mousedown", 
            () => {
                if (this.amount === 0) return;
            
                activeInventory = this;
                cursorText.style.visibility = "visible";
                cursorText.innerHTML = this.type;
                this.decreaseAmount();
            });
        }
    }
}

const inventory0 = getInventory(objectName.inventory0, 0);
const inventory4 = getInventory(objectName.inventory4, 4);
inventory0.init();
inventory4.init();
// ---------------------

const setLevelIsCompleted = () => {
    mainContainer.style.pointerEvents = "none";
    nextBtn.style.pointerEvents = "initial";
    nextBtn.style.opacity = "1";
    nextLevelText.style.opacity = "1";

    if(currentLevel === currentMaxLevel) {
        currentMaxLevel++;
        localStorage.setItem(saveData.currentMaxLevel, currentMaxLevel);
        if (currentLevel === maxLevel) {
            nextLevelText.innerHTML = "You have completed all Level! Congratulations!"
            currentMaxLevel = maxLevel;
            nextBtn.style.pointerEvents = "none";
            nextBtn.style.opacity = "0.3";
        }
    }  
}

window.onmousemove = e => {
    e.preventDefault();   

    cursorText.style.left = document.body.scrollLeft + e.clientX - 12;
    cursorText.style.top = document.body.scrollTop + e.clientY - 12;
};

window.onmouseup = e => {
    const id = e.target.id.substring(0, 4);
    if (cursorText.style.visibility === "hidden") {
        if (id === objectName.grid) {
            const grid = getGrid(e.target.id);
            if (grid.state === gridState.FILLED) {                
                checkGridCorrect(grid, true);
                if (grid.box.innerHTML === "0") {
                    totalPlacement--;
                    inventory0.increaseAmount();
                } else if (grid.box.innerHTML === "4") {
                    totalPlacement--;
                    inventory4.increaseAmount();
                }
                grid.setToInitIfFilled();
            }
        }
        return;
    }

    let isInBox = false;    
    if (id === objectName.grid) {
        const grid = getGrid(e.target.id);
        if (grid.state === gridState.EMPTY) {
            isInBox = true;
            grid.box.innerHTML = cursorText.innerHTML;            
            grid.state = gridState.FILLED;     
            
            totalPlacement++;
            checkGridCorrect(grid);
        } else if (grid.state === gridState.FILLED) {
            if (grid.box.innerHTML === "0") {
                totalPlacement--;
                inventory0.increaseAmount();
            } else if (grid.box.innerHTML === "4") {
                totalPlacement--;
                inventory4.increaseAmount();
            }

            checkGridCorrect(grid, true);

            isInBox = true;
            grid.box.innerHTML = cursorText.innerHTML;
            
            totalPlacement++;
            checkGridCorrect(grid);
        }

        const dataLevel = levels[currentLevel];
        if (totalCorrect === dataLevel.totalCorrect &&
            totalPlacement === dataLevel.total0 + dataLevel.total4) {

            setLevelIsCompleted();
        } 
    }

    if (!isInBox) {
        activeInventory.increaseAmount();
    }

    cursorText.style.visibility = "hidden";
}

const setLevel = (indexLevel = 0) => {

    totalCorrect = 0;
    totalPlacement = 0;
    const dataLevel = levels[indexLevel];

    increaseTotalCorrect(0);

    levelText.innerHTML = `Level ${indexLevel + 1}`;
    console.log(indexLevel);
    console.log(currentMaxLevel);
    if (indexLevel === 0) {
        prevBtn.style.pointerEvents = "none";
        prevBtn.style.opacity = "0.3";
    } else {
        prevBtn.style.pointerEvents = "initial";
        prevBtn.style.opacity = "1";
    }
    
    if (indexLevel >= currentMaxLevel) {        
        nextBtn.style.pointerEvents = "none";
        nextBtn.style.opacity = "0.3";
    } else {
        nextBtn.style.pointerEvents = "initial";
        nextBtn.style.opacity = "1";
    }

    mainContainer.style.pointerEvents = "initial";
    nextLevelText.style.opacity = "0";

    for (let i=0; i<5; i++) {
        const subLevel = dataLevel.map;
        for (let j=0; j<5; j++) {
            const data = subLevel[i][j];
            const grid = gridManager[i][j];
            grid.init();

            if (data === 1) {
                grid.box.innerHTML = " ";
                grid.box.style.opacity = "0.3";
                grid.state = gridState.BLOCKED;
            } else if (data === 2) {
                grid.box.innerHTML = " ";
                grid.state = gridState.EMPTY;
                grid.box.style.backgroundColor = gridColor.EMPTY;
                grid.box.style.color = gridColor.FILLED;
                grid.initColor = gridColor.EMPTY;
            } else {
                grid.box.innerHTML = data;
                grid.state = gridState.FIXED;
                grid.initColor = gridColor.FIXED;
            }   
        }
    }

    inventory0.amount = dataLevel.total0;
    inventory4.amount = dataLevel.total4;

    // inventory0.amount = 3;
    // inventory4.amount = 3;

    inventory0.amountBox.innerHTML = inventory0.amount;
    inventory4.amountBox.innerHTML = inventory4.amount;
}

const nextLevel = () => {
    if (currentLevel < levels.length-1) {
        currentLevel++;
        if (currentMaxLevel < currentLevel) {
            currentMaxLevel = currentLevel;
        }
        setLevel(currentLevel);
    }
}

prevBtn.addEventListener("mousedown", () => {
    currentLevel--;
    setLevel(currentLevel);
});

nextBtn.addEventListener("mousedown", () => {
    currentLevel++;
    setLevel(currentLevel);
});

setLevel(currentLevel);