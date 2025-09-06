import "./pages/index.css";
import { createCard, deleteCard, likeCard } from "./components/card.js";
import { openPopup, closePopup, closePopupEvent } from "./components/popup.js";
import {
  getCards,
  postCard,
  deleteCardApi,
  getUser,
  patchUser,
  addLikeCard,
  deleteLikeCard,
} from "./components/api.js";
import avatarUrl from "./images/avatar.jpg";
import {
  validation,
  clearValidation,
  validationConfig,
} from "./components/validation.js";

const cardsContainer = document.querySelector(".places__list");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

const editForm = document.forms["edit-profile"];
const nameInput = editForm.elements.name;
const jobInput = editForm.elements.description;

const newCardForm = document.forms["new-place"];
const cardLinkInput = newCardForm.elements.link;
const cardNameInput = newCardForm.elements["place-name"];

const imagePopupImg = document.querySelector(".popup__image");
const imagePopupDescription = document.querySelector(".popup__caption");

const editPopup = document.querySelector(".popup_type_edit");
const newCardPopup = document.querySelector(".popup_type_new-card");
const imagePopup = document.querySelector(".popup_type_image");

const editProfileButton = document.querySelector(".profile__edit-button");
const addCardButton = document.querySelector(".profile__add-button");
const closePopupButtons = document.querySelectorAll(".popup__close");

let currentUserId = null;

function addCards(array) {
  array.forEach(function (cardContent) {
    const newCard = createCard(
      cardContent,
      deleteCard,
      likeCard,
      openImagePopup,
      currentUserId
    );
    cardsContainer.append(newCard);
  });
}

function loadCards() {
  getCards()
    .then((cards) => {
      addCards(cards);
    })
    .catch((error) => {
      console.error("Ошибка при загрузке карточек:", error);
    });
}

function loadUserData() {
  getUser()
    .then((userData) => {
      currentUserId = userData._id;
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;

      if (userData.avatar) {
        const profileImageElement = document.querySelector(".profile__image");
        profileImageElement.style.backgroundImage = `url(${userData.avatar})`;
      }
    })
    .catch((error) => {
      console.error("Ошибка при загрузке данных пользователя:", error);
    });
}

loadUserData();
loadCards();

function openImagePopup(event) {
  openPopup(imagePopup);
  const card = event.target.closest(".card");

  imagePopupImg.src = card.querySelector(".card__image").src;
  imagePopupImg.alt = card.querySelector(".card__title").textContent;
  imagePopupDescription.textContent =
    card.querySelector(".card__title").textContent;
}

closePopupButtons.forEach((button) => {
  button.addEventListener("click", closePopupEvent);
});

editProfileButton.addEventListener("click", () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openPopup(editPopup);
});

addCardButton.addEventListener("click", () => {
  openPopup(newCardPopup);
});

function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  const currentName = nameInput.value;
  const currentJob = jobInput.value;

  const submitButton = evt.target.querySelector(".popup__button");
  const originalText = submitButton.textContent;
  submitButton.textContent = "Сохранение...";
  submitButton.disabled = true;

  patchUser(currentName, currentJob)
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closePopup(editPopup);
    })
    .catch((error) => {
      console.error("Ошибка при обновлении профиля:", error);
    })
    .finally(() => {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    });
}

editForm.addEventListener("submit", handleProfileFormSubmit);

function handleCardFormSubmit(evt) {
  evt.preventDefault();

  const cardContent = {
    link: cardLinkInput.value,
    name: cardNameInput.value,
  };

  const submitButton = evt.target.querySelector(".popup__button");
  const originalText = submitButton.textContent;
  submitButton.textContent = "Создание...";
  submitButton.disabled = true;

  postCard(cardContent.name, cardContent.link)
    .then((newCardData) => {
      const newCard = createCard(
        newCardData,
        deleteCard,
        likeCard,
        openImagePopup,
        currentUserId
      );
      cardsContainer.prepend(newCard);
      closePopup(newCardPopup);
      evt.target.reset();
    })
    .catch((error) => {
      console.error("Ошибка при создании карточки:", error);
    })
    .finally(() => {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    });
}

newCardForm.addEventListener("submit", handleCardFormSubmit);

validation(validationConfig);

const profileImageElement = document.querySelector(".profile__image");
if (profileImageElement && avatarUrl) {
  profileImageElement.style.backgroundImage = `url(${avatarUrl})`;
}
