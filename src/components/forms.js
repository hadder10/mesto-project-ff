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
} from "./const.js";

import { patchAvatar, deleteCardApi, postCard, patchUser } from "./api.js";

import { openPopup, closePopup } from "./modal.js";

import { createCard } from "../card.js";
import { handleSubmit } from "./utilsForms.js";

let selectedCard;
let id;
export const openPopupDelete = (cardElement, cardId) => {
  selectedCard = cardElement;
  id = cardId;
  openPopup(deletePopup);
};
const closePopupDelete = () => {
  closePopup(deletePopup);
};

export function handleAvatarFormSubmit(event) {
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

export function deleteCard(selectedCard, id) {
  deleteCardApi(id)
    .then(() => {
      selectedCard.remove();
      closePopupDelete();
    })
    .catch((err) => {
      console.error("Произошла ошибка при удалении карточки:", err);
    });
}

export function handleCardDelete(evt) {
  evt.preventDefault();
  deleteCard(selectedCard, id);
}

export function setInitialEditProfileFormValues() {
  nameInput.value = userNameElement.textContent;
  jobInput.value = userJobElement.textContent;
}

export function handleFormSubmit(evt) {
  function makeRequest() {
    const name = nameInput.value;
    const about = jobInput.value;
    return patchUser(name, about).then((dataUser) => {
      userNameElement.textContent = dataUser.name;
      userJobElement.textContent = dataUser.about;
      console.dir(name, about);
      setInitialEditProfileFormValues();
      closePopup(evt.target.closest(".popup_is-opened"));
    });
  }
  handleSubmit(makeRequest, evt);
}

export function handleNewCardFormSubmit(event, callbacksObject, userId) {
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

export function handleSubmit(request, evt, loadingText = "Сохранение...") {
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
