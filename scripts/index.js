import FormValidator from './FormValidator.js'
import { initialCards } from './cards.js'
import { makeFrontInserter, getForm, submitMiddleware, setOpeningAndClosingOfPopUp } from './utilities.js'
import Card from './Card.js'

// ============================= Cards in gallery
const galleryConfig = {
  cardTemplateSelector: '#card',
  cardNodeSelector: '.gallery__item',
  cardPictureSelector: '.card__picture',
  cardCaptionSelector: '.card__caption',
  cardLikeButtonActiveClass: 'card__like-button_active',
  popUpSelector: '.pop-up_type_show-card',
  popUpImageSelector: '.pop-up__image',
  popUpImageCaptionSelector: '.pop-up__image-caption',
  cardLikeButtonSelector: '.card__like-button',
  cardDeleteButtonSelector: '.card__delete-button'
};

const validationConfig = {
  formSelector: '.pop-up__form',
  inputSelector: '.pop-up__input',
  submitButtonSelector: '.pop-up__save-button',
  inactiveButtonClass: 'pop-up__save-button_inactive',
  inputErrorClass: 'pop-up__input_type_error',
  errorClass: 'pop-up__input-error_active'
};

const handleOpenPictureInPopUp = (picture, caption, config) => {
  const popUp = document.querySelector(config.popUpSelector);
  const popUpImage = popUp.querySelector(config.popUpImageSelector);
  const popUpCaption = popUp.querySelector(config.popUpImageCaptionSelector);

  function onOpen() {
    popUpImage.src = picture.src;
    popUpImage.alt = picture.alt;
    popUpCaption.textContent = caption.textContent;
  }

  setOpeningAndClosingOfPopUp(popUp, picture, onOpen);
}

const insertIntoGallery = makeFrontInserter(document.querySelector('.gallery__items'));

function loadCardsToGallery() {
  initialCards.map(card => new Card(card, galleryConfig, handleOpenPictureInPopUp).generateCard()).forEach(insertIntoGallery);
};

// ============================= Edit profile pop-up
function initProfilePopUp() {
  const popUp = document.querySelector('.pop-up_type_profile');
  const openPopUpButton = document.querySelector('.profile__modify-button');

  const title = document.querySelector('.profile__title-text');
  const subtitle = document.querySelector('.profile__subtitle');

  const inputTitle = popUp.querySelector('.pop-up__input_type_title');
  const inputSubtitle = popUp.querySelector('.pop-up__input_type_subtitle');

  const form = getForm(popUp);

  const validator = new FormValidator(form, validationConfig);
  validator.enableValidation();

  function onOpen() {
    inputTitle.value = title.textContent;
    inputSubtitle.value = subtitle.textContent;

    validator.resetError();
    validator.toggleButtonState();
  }

  function onSubmit() {
    title.textContent = inputTitle.value;
    subtitle.textContent = inputSubtitle.value;

    form.reset();
  }

  form.addEventListener('submit', submitMiddleware(onSubmit, popUp));

  setOpeningAndClosingOfPopUp(popUp, openPopUpButton, onOpen);
}

// ============================= Gallery add picture pop-up
function initGalleryAddPopUp() {
  const popUp = document.querySelector('.pop-up_type_gallery-add');
  const openPopUpButton = document.querySelector('.profile__add-button');

  const inputPictureName = popUp.querySelector('.pop-up__input_type_name');
  const inputPictureSource = popUp.querySelector('.pop-up__input_type_picture-source');

  const form = getForm(popUp);

  const validator = new FormValidator(form, validationConfig);
  validator.enableValidation();

  function onClose() {
    form.reset();
  }

  function onOpen() {
    validator.resetError();
    validator.toggleButtonState();
  }

  function onSubmit() {
    insertIntoGallery(new Card({ name: inputPictureName.value, link: inputPictureSource.value }, galleryConfig, handleOpenPictureInPopUp).generateCard());
    form.reset();
  }

  form.addEventListener('submit', submitMiddleware(onSubmit, popUp));

  setOpeningAndClosingOfPopUp(popUp, openPopUpButton, onOpen, onClose);
}

initProfilePopUp();
initGalleryAddPopUp();
loadCardsToGallery();
