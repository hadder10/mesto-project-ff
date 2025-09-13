import { deleteCardPopup } from "./const.js";
import { deleteCardApi, addLikeCard, deleteLikeCard } from "./api.js";
import { openPopup, closePopup } from "./popup.js";

let selectedCard;
let deleteId;

export const openPopupDelete = (cardElement, cardId) => {
  selectedCard = cardElement;
  deleteId = cardId;
  openPopup(deleteCardPopup);
};

const closePopupDelete = () => {
  closePopup(deleteCardPopup);
};

export function handleCardDelete(evt) {
  evt.preventDefault();
  deleteCard();
}

const cardTemplate = document.querySelector("#card-template").content;

export function createCard(
  cardData,
  deleteCallback,
  likeCallback,
  openImageCallback,
  userId
) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  cardElement.dataset.cardId = cardData._id;

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCount = cardElement.querySelector(".card__like-count");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  if (cardData.owner && cardData.owner._id !== userId) {
    deleteButton.style.display = "none";
  }

  if (cardData.likes && cardData.likes.some((like) => like._id === userId)) {
    likeButton.classList.add("card__like-button_is-active");
  }

  if (likeCount) {
    likeCount.textContent = cardData.likes ? cardData.likes.length : 0;
  }

  deleteButton.addEventListener("click", () => {
    openPopup(deleteCardPopup);
    deleteCardPopup.dataset.cardId = cardData._id;
    deleteCardPopup.dataset.cardElementId = cardElement.dataset.cardId;
  });
  likeButton.addEventListener("click", () =>
    likeCallback(cardData._id, likeButton, likeCount)
  );
  cardImage.addEventListener("click", openImageCallback);

  return cardElement;
}

function deleteCard(cardId, cardElement) {
  if (confirm("Вы уверены, что хотите удалить эту карточку?")) {
    deleteCardApi(cardId)
      .then(() => {
        cardElement.remove();
      })
      .catch((error) => {
        console.error("Ошибка при удалении карточки:", error);
      });
  }
}

function likeCard(cardId, likeButton, likeCountElement) {
  const isLiked = likeButton.classList.contains("card__like-button_is-active");

  const likePromise = isLiked ? deleteLikeCard(cardId) : addLikeCard(cardId);

  likePromise
    .then((updatedCard) => {
      likeButton.classList.toggle("card__like-button_is-active");
      if (likeCountElement) {
        likeCountElement.textContent = updatedCard.likes.length;
      }
    })
    .catch((error) => {
      console.error("Ошибка при изменении лайка:", error);
    });
}

export { deleteCard, likeCard };
