import "./pages/index.css";
import { createCard, deleteCard, likeCard } from "./components/card.js";
import { openPopup, closePopup, closePopupEvent } from "./components/popup.js";
import { initialCards } from "./components/cards.js";

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

function addCards(array) {
  array.forEach(function (cardContent) {
    const newCard = createCard(
      cardContent,
      deleteCard,
      likeCard,
      openImagePopup
    );
    cardsContainer.append(newCard);
  });
}

addCards(initialCards);

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

  profileTitle.textContent = currentName;
  profileDescription.textContent = currentJob;

  closePopup(editPopup);
}

editForm.addEventListener("submit", handleProfileFormSubmit);

function handleCardFormSubmit(evt) {
  evt.preventDefault();

  const cardContent = {
    link: cardLinkInput.value,
    name: cardNameInput.value,
  };

  const newCard = createCard(cardContent, deleteCard, likeCard, openImagePopup);
  cardsContainer.prepend(newCard);

  closePopup(newCardPopup);
  evt.target.reset();
}

newCardForm.addEventListener("submit", handleCardFormSubmit);

export const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".button",
  inactiveButtonClass: "button_inactive",
  inputErrorClass: "form__input_type_error",
  errorClass: "form__input-error_active",
};

const showInputError = (formElement, inputElement, validationConfig) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(validationConfig.inputErrorClass);
  errorElement.textContent = inputElement.validationMessage;
  errorElement.classList.add(validationConfig.errorClass);
};

const hideInputError = (formElement, inputElement, validationConfig) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  if (errorElement) {
    inputElement.classList.remove(validationConfig.inputErrorClass);
    errorElement.classList.remove(validationConfig.errorClass);
    errorElement.textContent = "";
  }
};

const checkInputValidity = (formElement, inputElement, validationConfig) => {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.error);
  } else {
    inputElement.setCustomValidity("");
  }
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, validationConfig);
  } else {
    hideInputError(formElement, inputElement, validationConfig);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

const toggleButtonState = (inputList, validationConfig, buttonElement) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.setAttribute("disabled", true);
    buttonElement.classList.add(validationConfig.inactiveButtonClass);
  } else {
    buttonElement.removeAttribute("disabled");
    buttonElement.classList.remove(validationConfig.inactiveButtonClass);
  }
};

const setEventListeners = (formElement, validationConfig) => {
  const inputList = Array.from(
    formElement.querySelectorAll(validationConfig.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    validationConfig.submitButtonSelector
  );

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formElement, inputElement, validationConfig);
      toggleButtonState(inputList, validationConfig, buttonElement);
    });
  });
};

const enableValidation = (validationConfig) => {
  const formElementList = Array.from(
    document.querySelectorAll(validationConfig.formSelector)
  );

  formElementList.forEach((formElement) => {
    setEventListeners(formElement, validationConfig);
  });
};

function clearValidation(formElement, validationConfig) {
  const inputList = Array.from(
    formElement.querySelectorAll(validationConfig.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    validationConfig.submitButtonSelector
  );

  inputList.forEach((inputElement) =>
    hideInputError(formElement, inputElement, validationConfig)
  );
  toggleButtonState(inputList, validationConfig, buttonElement);
}

enableValidation(validationConfig);

// Экспорт старых имён, чтобы существующие импорты из components/validation.js продолжили работать
export { enableValidation, clearValidation };
export { createCard, deleteCard, likeCard };
export { openPopup, closePopup, closePopupEvent };
export { initialCards };
