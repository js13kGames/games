import hero from "../assets/hero.svg";
class PlayerManager {
  constructor(cardsManager, levelManager, uiManager) {
    this.cardsManager = cardsManager;
    this.life = 13;
    this.position = 0;
    this.levelManager = levelManager;
    this.uiManager = uiManager;
    this.hasKey = false;
  }

  createPlayer(position) {
    const player = document.createElement("div");
    const playerSprite = document.createElement("img");
    player.setAttribute("id", "player");
    playerSprite.setAttribute("src", hero);
    player.appendChild(playerSprite);
    this.position = position;
    return player;
  }

  getHit(damage) {
    if (this.life > 0) this.life -= damage;
    else this.uiManager.createGameOverUI();
  }

  getKey() {
    this.hasKey = true;
  }

  removeKey() {
    this.hasKey = false;
  }

  canMoveTo(direction) {
    const verifyCardAndPosition = (cardInPosition, types) => {
      return (
        !!cardInPosition &&
        types.includes(this.cardsManager.getCardByPosition(this.position).type)
      );
    };

    if (["left", "right"].includes(direction)) {
      const cardInPosition =
        direction === "left"
          ? this.cardsManager.getCardByPosition(this.position - 1)
          : this.cardsManager.getCardByPosition(this.position + 1);
      return {
        canMove: verifyCardAndPosition(cardInPosition, [
          "ladder",
          "corridor",
          "start",
          "door",
          "key",
          "enemy",
        ]),
        cardId: cardInPosition?.id || "",
        cardType: cardInPosition?.type,
        newPosition:
          direction === "left" ? this.position - 1 : this.position + 1,
      };
    } else {
      const cardInPosition =
        direction === "up"
          ? this.cardsManager.getCardByPosition(this.position - 7)
          : this.cardsManager.getCardByPosition(this.position + 7);
      return {
        canMove: verifyCardAndPosition(cardInPosition, ["ladder"]),
        cardId: cardInPosition?.id || "",
        cardType: cardInPosition?.type,
        newPosition: direction === "up" ? this.position - 7 : this.position + 7,
      };
    }
  }

  move(direction) {
    const { canMove, cardId, cardType, newPosition } =
      this.canMoveTo(direction);
    if (canMove) {
      const cardElem = document.querySelector(`#${cardId}`);
      document.querySelector("#player").remove();
      cardElem.appendChild(this.createPlayer());
      this.position = newPosition;
      if (cardType === "door" && this.hasKey) {
        if (this.levelManager.currentLevel === this.levelManager.lastLevel)
          this.uiManager.createCompleteUI();
        else this.levelManager.finishLevel();
      } else if (cardType === "key") {
        this.getKey();
        cardElem.querySelector(".card-img")?.remove();
      } else if (cardType === "enemy") {
        this.getHit(1);
        this.uiManager.updatePlayerUI(this.life);
        cardElem.querySelector(".card-img")?.remove();
      }
    }
  }

  resetPlayer() {
    this.life = 13;
  }
}

export default PlayerManager;
