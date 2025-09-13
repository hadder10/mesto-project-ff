import "./pages/index.css";

import {
  getCards,
  postCard,
  patchAvatar,
  deleteCardApi,
  getUser,
  patchUser,
  addLikeCard,
  deleteLikeCard,
} from "./components/api.js";

import { createCard, deleteCard, likeCard } from "./components/card.js";

import {
  avatarFormElement,
  avatarForm,
  nameInput,
  jobInput,
  userJobElement,
  userNameElement,
  newCardForm,
  newPlaceNameInput,
  newLinkInput,
  placesList,
  deleteCardPopup,
  deleteCardForm,
} from "./components/const.js";

import { openPopup, closePopup, closePopupEvent } from "./components/popup.js";

import {
  validation,
  clearValidation,
  validationConfig,
} from "./components/validation.js";

import avatarUrl from "./images/avatar.jpg";

const cardsContainer = document.querySelector(".places__list");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

const editForm = document.forms["edit-profile"];
const nameInput_index = editForm.elements.name;
const jobInput_index = editForm.elements.description;
const newCardForm_index = document.forms["new-place"];
const cardLinkInput = newCardForm_index.elements.link;
const cardNameInput = newCardForm_index.elements["place-name"];

const imagePopupImg = document.querySelector(".popup__image");
const imagePopupDescription = document.querySelector(".popup__caption");

const editPopup = document.querySelector(".popup_type_edit");
const newCardPopup = document.querySelector(".popup_type_new-card");
const imagePopup = document.querySelector(".popup_type_image");

const editProfileButton = document.querySelector(".profile__edit-button");
const addCardButton = document.querySelector(".profile__add-button");
const closePopupButtons = document.querySelectorAll(".popup__close");

//
const formElementNewAvatar = document.forms["new-avatar"];
const popupTypeNewAvatar = document.querySelector(".popup_type_new-avatar");
const avatarImage = document.querySelector(".profile__image");

avatarImage.addEventListener("click", () => {
  openPopup(popupTypeNewAvatar);
  clearValidation(formElementNewAvatar, validationConfig);
});

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
  nameInput_index.value = profileTitle.textContent;
  jobInput_index.value = profileDescription.textContent;
  openPopup(editPopup);
});

addCardButton.addEventListener("click", () => {
  openPopup(newCardPopup);
});

function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  const currentName = nameInput_index.value;
  const currentJob = jobInput_index.value;

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

newCardForm_index.addEventListener("submit", handleCardFormSubmit);

validation(validationConfig);

const profileImageElement = document.querySelector(".profile__image");
if (profileImageElement && avatarUrl) {
  profileImageElement.style.backgroundImage = `url(${avatarUrl})`;
}

function renderLoading(
  isLoading,
  button,
  initialText = "Сохранить",
  loadingText = "Сохранение"
) {
  if (isLoading) {
    button.textContent = loadingText;
  } else {
    button.textContent = initialText;
  }
}

function handleSubmit(request, evt, loadingText = "Сохранение...") {
  evt.preventDefault();

  const submitButton = evt.submitter;
  const initialText = submitButton.textContent;
  renderLoading(true, submitButton, initialText, loadingText);

  request()
    .then(() => {
      evt.target.reset();
    })
    .catch((err) => {
      console.error(`Ошибка: ${err}`);
    })
    .finally(() => {
      renderLoading(false, submitButton, initialText, loadingText);
    });
}

function handleAvatarFormSubmit(event) {
  function makeRequest() {
    const avatar = formElementNewAvatar.elements["avatar-input"].value;
    return patchAvatar(avatar).then((res) => {
      avatarImage.style.backgroundImage = `url('${res.avatar}')`;
      closePopup(popupTypeNewAvatar);
    });
  }
  handleSubmit(makeRequest, event);
}

formElementNewAvatar.addEventListener("submit", handleAvatarFormSubmit);

function setInitialEditProfileFormValues() {
  nameInput.value = userNameElement.textContent;
  jobInput.value = userJobElement.textContent;
}

function handleFormSubmit(evt) {
  function makeRequest() {
    const name = nameInput.value;
    const about = jobInput.value;
    return patchUser(name, about).then((dataUser) => {
      userNameElement.textContent = dataUser.name;
      userJobElement.textContent = dataUser.about;
      setInitialEditProfileFormValues();
      closePopup(evt.target.closest(".popup_is-opened"));
    });
  }
  handleSubmit(makeRequest, evt);
}

function handleNewCardFormSubmit(event, callbacksObject, userId) {
  function makeRequest() {
    return postCard(newPlaceNameInput.value, newLinkInput.value).then(
      (card) => {
        const newCardElement = createCard(card, callbacksObject, userId);
        placesList.prepend(newCardElement);
        closePopup(newCardForm);
      }
    );
  }

  handleSubmit(makeRequest, event);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const initialText = submitButton.textContent;
  submitButton.textContent = 'Удаление...';
  
  const cardId = deleteCardPopup.dataset.cardId;
  const cardElementId = deleteCardPopup.dataset.cardElementId;
  const cardElement = document.querySelector(`.card[data-card-id="${cardElementId}"]`);

  if (!cardElement) {
    console.error('Card element not found');
    return;
  }

  deleteCardApi(cardId)
    .then(() => {
      cardElement.remove(); 
      closePopup(deleteCardPopup);
    })
    .catch((err) => {
      console.error('Ошибка при удалении карточки:', err);
    })
    .finally(() => {
      submitButton.textContent = initialText;
      // Очищаем data-атрибуты
      delete deleteCardPopup.dataset.cardId;
      delete deleteCardPopup.dataset.cardElementId;
    });
}

deleteCardForm.addEventListener('submit', handleDeleteSubmit);

export {
  handleSubmit,
  handleAvatarFormSubmit,
  setInitialEditProfileFormValues,
  handleFormSubmit,
  handleNewCardFormSubmit,
};