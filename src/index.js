import './pages/index.css';
import { createCard, deleteCard, likeCard } from "./components/card.js";
import { openPopup, closePopup, closePopupEvent } from "./components/popup.js";
import {initialCards} from "./components/cards.js";

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

const editProfileButton  = document.querySelector(".profile__edit-button");
const addCardButton = document.querySelector(".profile__add-button");
const closePopupButtons = document.querySelectorAll(".popup__close");

function addCards (array){
    array.forEach(function (cardContent){
        const newCard = createCard(cardContent, deleteCard, likeCard, openImagePopup);
        cardsContainer.append(newCard);
    });
}

addCards(initialCards);

function openImagePopup(event) {
    openPopup(imagePopup);
    const card = event.target.closest(".card");

    imagePopupImg.src = card.querySelector(".card__image").src;
    imagePopupImg.alt = card.querySelector(".card__title").textContent;
    imagePopupDescription.textContent = card.querySelector(".card__title").textContent;
}

closePopupButtons.forEach((button) => {
    button.addEventListener("click", closePopupEvent);
});

editProfileButton.addEventListener("click",() => {
    nameInput.value = profileTitle.textContent;
    jobInput.value = profileDescription.textContent;
    openPopup(editPopup);
});

addCardButton.addEventListener("click",() => {
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

editForm.addEventListener('submit', handleProfileFormSubmit);

function handleCardFormSubmit(evt) {
    evt.preventDefault();

    const cardContent = {
        link: cardLinkInput.value,
        name: cardNameInput.value,
    }

    const newCard = createCard(cardContent, deleteCard, likeCard, openImagePopup);
    cardsContainer.prepend(newCard);

    closePopup(newCardPopup);
    evt.target.reset();
}

newCardForm.addEventListener('submit', handleCardFormSubmit);








