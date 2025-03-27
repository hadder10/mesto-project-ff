function openPopup(popup) {
    popup.classList.add('popup_is-opened');
    document.addEventListener("keydown", closeEscPopup);
    popup.addEventListener('click', closeOverlayPopup);
}

function closePopup(popup) {
    popup.classList.remove('popup_is-opened');
    document.removeEventListener("keydown", closeEscPopup);
    popup.removeEventListener('click', closeOverlayPopup);
}

function closePopupEvent(evt) {
    const openedPopup = evt.target.closest(".popup");
    closePopup(openedPopup);
}

function closeEscPopup(evt) {
    if (evt.key === "Escape") {
        const openedPopup = document.querySelector(".popup_is-opened");
        closePopup(openedPopup);
    }
}

function closeOverlayPopup(evt) {
    if (evt.target === evt.currentTarget) {
        closePopup(evt.currentTarget);
    }
}

export {openPopup, closePopup, closePopupEvent};