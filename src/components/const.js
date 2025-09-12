const editFormElement = document.forms["edit-profile"];
const newPlaceFormElement = document.forms["new-place"];
const avatarFormElement = document.forms["edit-avatar"];
const deleteCardForm = document.forms["delete-card"];

const buttonTypeCard = document.querySelector(".popup_type_image");
const profileEditButton = document.querySelector(".profile__edit-button");
const profileAddButton = document.querySelector(".profile__add-button");

const popupsArray = Array.from(document.querySelectorAll(".popup"));
const editForm = document.querySelector(".popup_type_edit");
const newCardForm = document.querySelector(".popup_type_new-card");
const avatarForm = document.querySelector(".popup_type_avatar");
const deletePopup = document.querySelector(".popup_type_delete-card");

const placesList = document.querySelector(".places__list");

const avatarImage = document.querySelector(".profile__image");
const nameInput = document.querySelector(".popup__input_type_name");
const jobInput = document.querySelector(".popup__input_type_description");

const userNameElement = document.querySelector(".profile__title");
const userJobElement = document.querySelector(".profile__description");

const newPlaceNameInput = newPlaceFormElement.elements["place-name"];
const newLinkInput = newPlaceFormElement.elements.link;

const popupImageCaption = document.querySelector(".popup__caption");
const popupImage = document.querySelector(".popup__image");

export {
  editFormElement,
  newPlaceFormElement,
  avatarFormElement,
  deleteCardForm,
  buttonTypeCard,
  profileEditButton,
  profileAddButton,
  popupsArray,
  editForm,
  newCardForm,
  avatarForm,
  deletePopup,
  placesList,
  avatarImage,
  nameInput,
  jobInput,
  userNameElement,
  userJobElement,
  newPlaceNameInput,
  newLinkInput,
  popupImageCaption,
  popupImage,
};
