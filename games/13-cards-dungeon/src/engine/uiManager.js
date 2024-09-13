class UIManager {
  constructor(body, cardsManager, countCards) {
    this.body = body;
    this.countCards = countCards;
    this.cardManager = cardsManager;
    this.limitCardsInHand = 9;
    this.limitPlayerCards = 13;
  }

  createStartUI() {
    const startContainer = document.createElement("div");
    const title = document.createElement("h1");
    title.textContent = "13 Cards Dungeon";
    startContainer.classList.add("start-container");
    startContainer.appendChild(title);
    return startContainer;
  }

  createTutorialUI() {
    const tutorialContainer = document.createElement("div");
    const title = document.createElement("h1");
    const ul = document.createElement("ul");
    title.textContent = "If you want to escape alive, then follow the rules:";
    const rules = [
      "Use/move only 13 cards",
      "Use arrow keys to move the character",
      "Get the key to release the exit",
      "Avoid enemies",
      "Ladder cards allow you to go up and/or down to other cards",
    ];
    for (let i = 0; i < rules.length; i++) {
      const li = document.createElement("li");
      li.textContent = rules[i];
      ul.appendChild(li);
    }
    tutorialContainer.classList.add("tutorial-container");
    tutorialContainer.appendChild(title);
    tutorialContainer.appendChild(ul);
    return tutorialContainer;
  }

  createCompleteUI() {
    this.body.innerHTML = "";
    const completeContainer = document.createElement("div");
    const title = document.createElement("h1");
    const button = document.createElement("button");
    title.textContent = "WINNER!";
    button.textContent = "RESTART";
    completeContainer.classList.add("gameover-container");
    button.addEventListener("click", () => {
      location.reload();
    });
    completeContainer.appendChild(title);
    completeContainer.appendChild(button);
    this.body.appendChild(completeContainer);
  }

  createGameOverUI() {
    this.body.innerHTML = "";
    const gameoverContainer = document.createElement("div");
    const title = document.createElement("h1");
    const button = document.createElement("button");
    title.textContent = "GAME OVER";
    button.textContent = "RESTART";
    gameoverContainer.classList.add("gameover-container");
    button.addEventListener("click", () => {
      location.reload();
    });
    gameoverContainer.appendChild(title);
    gameoverContainer.appendChild(button);
    this.body.appendChild(gameoverContainer);
  }

  getRandomCardType() {
    const randomIndex = Math.floor(
      Math.random() * this.cardManager.playerCardTypes.length
    );
    return this.cardManager.playerCardTypes[randomIndex];
  }

  buildPlayerUI(playerLife) {
    const playerUI = document.createElement("div");
    const lifeText = document.createElement("h4");
    const movesText = document.createElement("p");
    playerUI.setAttribute("id", "player-ui");
    lifeText.setAttribute("id", "life-text");
    lifeText.textContent = playerLife;
    movesText.textContent = "moves";
    playerUI.appendChild(lifeText);
    playerUI.appendChild(movesText);
    return playerUI;
  }

  updatePlayerUI(playerLife) {
    const playerUI = document.querySelector("#life-text");
    if (playerUI?.textContent) playerUI.textContent = playerLife;
  }

  buildContainer() {
    const container = document.createElement("div");
    const cardsContainer = document.createElement("div");
    container.classList.add("container");
    cardsContainer.classList.add("container-cards");

    for (let i = 0; i < this.limitPlayerCards; i++) {
      if (i < this.limitCardsInHand) {
        const randomType = this.getRandomCardType();
        const card = this.cardManager.createCard(randomType, true);
        cardsContainer.appendChild(card);
      }
    }

    container.appendChild(cardsContainer);

    return container;
  }

  buildUI(playerLife) {
    const container = this.buildContainer();
    const playerUI = this.buildPlayerUI(playerLife);
    container.appendChild(playerUI);
    this.body.appendChild(container);
  }
}

export default UIManager;
