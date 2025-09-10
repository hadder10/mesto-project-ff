import "./pages/index.css";
import { createCard, deleteCard, likeCard } from "./components/card.js";
import { openPopup, closePopup, closePopupEvent } from "./components/popup.js";
import {
  getCards,
  postCard,
  deleteCardApi,
  getUser,
  patchUser,
  patchAvatar,
} from "./components/api.js";
import avatarUrl from "./images/avatar.jpg";
import {
  validation,
  clearValidation,
  validationConfig,
} from "./components/validation.js";
import {
  avatarFormElement,
  avatarImage,
  avatarForm,
  deletePopup,
  nameInput,
  jobInput,
  userJobElement,
  userNameElement,
  newCardForm,
  newPlaceNameInput,
  newLinkInput,
  placesList,
} from "./components/const.js";

const cardsContainer = document.querySelector(".places__list");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

const editForm = document.forms["edit-profile"];

const cardLinkInput = newCardForm?.elements?.link;
const cardNameInput = newCardForm?.elements?.["place-name"];

const imagePopupImg = document.querySelector(".popup__image");
const imagePopupDescription = document.querySelector(".popup__caption");

const editPopup = document.querySelector(".popup_type_edit");
const newCardPopup = document.querySelector(".popup_type_new-card");
const imagePopup = document.querySelector(".popup_type_image");

const editProfileButton = document.querySelector(".profile__edit-button");
const addCardButton = document.querySelector(".profile__add-button");
const closePopupButtons = document.querySelectorAll(".popup__close");

let currentUserId = null;

let selectedCard;
let id;

const openPopupDelete = (cardElement, cardId) => {
  selectedCard = cardElement;
  id = cardId;
  openPopup(deletePopup);
};

function openImagePopup(event) {
  openPopup(imagePopup);
  const card = event.target.closest(".card");

  imagePopupImg.src = card.querySelector(".card__image").src;
  imagePopupImg.alt = card.querySelector(".card__title").textContent;
  imagePopupDescription.textContent =
    card.querySelector(".card__title").textContent;
}

const callbacksObject = {
  deleteCard: (cardId, cardElement) => openPopupDelete(cardElement, cardId),
  likeCard: likeCard,
  openImagePopup: openImagePopup,
};

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
    const avatar = avatarFormElement.elements["avatar-link"].value;
    return patchAvatar(avatar).then((res) => {
      avatarImage.setAttribute(
        "style",
        `background-image: url('${res.avatar}')`
      );
      closePopup(avatarForm);
    });
  }
  handleSubmit(makeRequest, event);
}

const closePopupDelete = () => {
  closePopup(deletePopup);
};

function deleteCardHandler(selectedCard, id) {
  deleteCardApi(id)
    .then(() => {
      selectedCard.remove();
      closePopupDelete();
    })
    .catch((err) => {
      console.error("Произошла ошибка при удалении карточки:", err);
    });
}

function handleCardDelete(evt) {
  evt.preventDefault();
  deleteCardHandler(selectedCard, id);
}

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

function addCards(array) {
  array.forEach(function (cardContent) {
    try {
      const newCard = createCard(cardContent, callbacksObject, currentUserId);
      cardsContainer.append(newCard);
    } catch (error) {
      console.error("Ошибка при создании карточки:", error, cardContent);
    }
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

closePopupButtons.forEach((button) => {
  button.addEventListener("click", closePopupEvent);
});

if (editProfileButton) {
  editProfileButton.addEventListener("click", () => {
    setInitialEditProfileFormValues();
    openPopup(editPopup);
  });
}

if (addCardButton) {
  addCardButton.addEventListener("click", () => {
    openPopup(newCardPopup);
  });
}

editForm.addEventListener("submit", handleFormSubmit);

if (newCardForm) {
  newCardForm.addEventListener("submit", (evt) => {
    handleNewCardFormSubmit(evt, callbacksObject, currentUserId);
  });
} else {
  console.error("Форма добавления карточки не найдена: newCardForm undefined");
}

const deleteCardForm = document.forms["delete-card"];
if (deleteCardForm) {
  deleteCardForm.addEventListener("submit", handleCardDelete);
}

if (avatarFormElement) {
  avatarFormElement.addEventListener("submit", handleAvatarFormSubmit);
}

validation(validationConfig);
