import {imagePopup} from "../index";

function openPopup(popup) {
    popup.classList.add('popup_is-opened');
    document.addEventListener("keydown", escClosePopup);
    popup.addEventListener('click', overlayClosePopup);
}

function closePopup(popup) {
    popup.classList.remove('popup_is-opened');
    document.removeEventListener("keydown", escClosePopup);
}

function closePopupEvent(evt) {
    const openedPopup = evt.target.closest(".popup");
    closePopup(openedPopup);
}

function escClosePopup(evt) {
    if (evt.key === "Escape") {
        const openedPopup = document.querySelector(".popup_is-opened");
        closePopup(openedPopup);
    }
}

function overlayClosePopup(evt) {
    if (evt.target === evt.currentTarget) {
        closePopup(evt.currentTarget);
    }
}

function openImagePopup(event) {
    openPopup(imagePopup);
    const card = event.target.closest(".card");
    const imagePopupImg = document.querySelector(".popup__image");
    const imagePopupDescription = document.querySelector(".popup__caption");

    imagePopupImg.src = card.querySelector(".card__image").src;
    imagePopupImg.alt = card.querySelector(".card__title").textContent;
    imagePopupDescription.textContent = card.querySelector(".card__title").textContent;
}

export {openPopup, closePopup, closePopupEvent, openImagePopup};