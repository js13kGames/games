import Card from "../models/cards/Card";
import blockSvg from "../assets/block.svg";

class CardManager {
  constructor() {
    this.cardsList = [];
    this.playerCardTypes = ["ladder", "corridor"];
  }

  insertCard(card) {
    this.cardsList.push(card);
  }

  removeCard(id) {
    return this.cardsList.filter((e) => e.id !== id);
  }

  clearCardsList() {
    this.cardsList = [];
  }

  createCard(type, isDraggable, position = null) {
    const card = new Card(type, isDraggable, position);
    this.insertCard(card);

    const cardElement = document.createElement("div");
    const cardImg = document.createElement("img");
    cardElement.setAttribute("class", `card ${type}`);
    cardElement.setAttribute("id", card.id);
    cardImg.classList.add("card-img");
    cardImg.setAttribute("src", card.getCard().figure);

    cardElement.appendChild(cardImg);

    for (let i = 0; i < 3; i++) {
      const cardBg = document.createElement("img");
      cardBg.setAttribute("src", blockSvg);
      cardBg.classList.add("card-bg");
      cardElement.appendChild(cardBg);
    }

    if (isDraggable) {
      cardElement.setAttribute("draggable", "true");
      cardElement.classList.add("draggable");
      cardElement.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("cardId", card.id);
      });
    }
    return cardElement;
  }

  getCardList() {
    return this.cardsList;
  }

  getCard(id) {
    return this.cardsList.find((e) => e.id === id);
  }

  getCardByPosition(position) {
    return this.cardsList.find((e) => e.position === position);
  }

  setCardPosition(id, position) {
    const card = this.cardsList.find((e) => e.id === id);
    card.setPosition(position);
  }
}

export default CardManager;
