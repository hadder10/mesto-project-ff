import { deleteCardApi, addLikeCard, deleteLikeCard } from "./api.js";

const cardTemplate = document.querySelector("#card-template").content;

function createCard(
  cardContent,
  deleteCard,
  likeCard,
  openImagePopup,
  currentUserId
) {
  const card = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = card.querySelector(".card__image");
  const cardTitle = card.querySelector(".card__title");
  const deleteButton = card.querySelector(".card__delete-button");
  const likeButton = card.querySelector(".card__like-button");
  const likeCount = card.querySelector(".card__like-count");

  cardImage.src = cardContent.link;
  cardImage.alt = cardContent.name;
  cardTitle.textContent = cardContent.name;

  if (cardContent.owner && cardContent.owner._id !== currentUserId) {
    deleteButton.style.display = "none";
  }

  if (
    cardContent.likes &&
    cardContent.likes.some((like) => like._id === currentUserId)
  ) {
    likeButton.classList.add("card__like-button_is-active");
  }

  if (likeCount) {
    likeCount.textContent = cardContent.likes ? cardContent.likes.length : 0;
  }

  deleteButton.addEventListener("click", () =>
    deleteCard(cardContent._id, card)
  );
  likeButton.addEventListener("click", () =>
    likeCard(cardContent._id, likeButton, likeCount)
  );
  cardImage.addEventListener("click", openImagePopup);

  return card;
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

export { createCard, deleteCard, likeCard };
