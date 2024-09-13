class LevelManager {
  constructor(cardSlots, currentLevel, levels) {
    this.cardSlots = cardSlots;
    this.cardsInBoard = [];
    this.currentLevel = currentLevel;
    this.lastLevel = 12;
    this.levelData = levels;
    this.transitionTime = 1500;
    this.currentLevelIsFinished = false;
  }

  getLevel(levelIndex) {
    return this.levelData[levelIndex];
  }

  getLevels() {
    return this.levelData;
  }

  insertCardsInBoard(card) {
    this.cardsInBoard.push(card);
  }

  startLevel() {
    this.currentLevelIsFinished = false;
  }

  finishLevel() {
    this.currentLevelIsFinished = true;
  }

  async levelTransition() {
    return new Promise((resolve) => {
      const transition = document.createElement("div");
      transition.classList.add("level-transition");
      transition.textContent = `Level ${this.currentLevel + 2}`;
      document.body.appendChild(transition);

      setTimeout(() => {
        transition.remove();
        resolve();
      }, this.transitionTime);
    });
  }

  async nextLevel() {
    await this.levelTransition();
    if (this.currentLevel < this.lastLevel) this.currentLevel += 1;
  }
}

export default LevelManager;
