// ============================= Utilities
function makeFrontInserter(container) {
  return function (node) {
    container.prepend(node);
  }
}

function hidePopUp(popUp) {
  popUp.classList.remove('pop-up_opened');
}

function showPopUp(popUp) {
  popUp.classList.add('pop-up_opened');
}

function getSubmitButton(popUp) {
  return popUp.querySelector('.pop-up__save-button');
}

function getCloseButton(popUp) {
  return popUp.querySelector('.pop-up__close-btn');
}

function getForm(popUp) {
  return popUp.querySelector('.pop-up__form');
}

// ============================= pop-up open and close helper wrapper
function submitMiddleware(action, popUp) {
  return function (event) {
    event.preventDefault();

    action();

    hidePopUp(popUp);
  }
}

function setOpeningAndClosingOfPopUp(popUp, openButton, onOpen, onClose = () => { }) {
  function openPopUp() {
    onOpen();
    document.addEventListener('keydown', closeOnEsc);
    showPopUp(popUp);
  }

  function closePopUp() {
    onClose();
    document.removeEventListener('keydown', closeOnEsc);
    hidePopUp(popUp);
  }

  function closeOnEsc(event) {
    if (event.key === 'Escape') {
      closePopUp();
    }
  }

  getCloseButton(popUp).addEventListener('click', closePopUp);

  openButton.addEventListener('click', openPopUp);

  // close by clicking on off-white area
  popUp.addEventListener('mousedown', (event) => {
    if (event.target.classList.contains('pop-up')) {
      closePopUp();
    }
  })
}

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
class Card {
  constructor(data, config) {
    this._name = data.name;
    this._link = data.link;
    this._config = config;
  }

  _getTemplate() {
    return document
      .querySelector(this._config.cardTemplateSelector)
      .content.querySelector(this._config.cardNodeSelector)
      .cloneNode(true);
  }

  _handleLike(event) {
    event.target.classList.toggle(this._config.cardLikeButtonActiveClass);
  }

  _handleDelete(event) {
    event.target.closest(this._config.cardNodeSelector).remove();
  }

  _setEventListeners() {
    this._element.querySelector(this._config.cardLikeButtonSelector).addEventListener('click', (event) => this._handleLike(event));
    this._element.querySelector(this._config.cardDeleteButtonSelector).addEventListener('click', (event) => this._handleDelete(event));
  }

  generateCard() {
    this._element = this._getTemplate();

    this._setEventListeners();

    const picture = this._element.querySelector(this._config.cardPictureSelector);
    picture.src = this._link;
    picture.alt = this._name;

    const caption = this._element.querySelector(this._config.cardCaptionSelector);
    caption.textContent = this._name;

    const popUp = document.querySelector(this._config.popUpSelector);
    const popUpImage = popUp.querySelector(this._config.popUpImageSelector);
    const popUpCaption = popUp.querySelector(this._config.popUpImageCaptionSelector);

    function onOpen() {
      popUpImage.src = picture.src;
      popUpImage.alt = picture.alt;
      popUpCaption.textContent = caption.textContent;
    }

    setOpeningAndClosingOfPopUp(popUp, picture, onOpen);

    return this._element;
  }
}

const insertIntoGallery = makeFrontInserter(document.querySelector('.gallery__items'));

function loadCardsToGallery() {
  initialCards.map(card => new Card(card, galleryConfig).generateCard()).forEach(insertIntoGallery);
};

// ============================= Edit profile pop-up
function initProfilePopUp() {
  const popUp = document.querySelector('.pop-up_type_profile');
  const openPopUpButton = document.querySelector('.profile__modify-button');
  const saveButton = getSubmitButton(popUp);

  const title = document.querySelector('.profile__title-text');
  const subtitle = document.querySelector('.profile__subtitle');

  const inputTitle = popUp.querySelector('.pop-up__input_type_title');
  const inputSubtitle = popUp.querySelector('.pop-up__input_type_subtitle');

  function onOpen() {
    inputTitle.value = title.textContent;
    inputSubtitle.value = subtitle.textContent;
    resetError(popUp, validationConfig);
    toggleButtonState([inputTitle, inputSubtitle], saveButton, 'pop-up__save-button_inactive');
  }

  function onSubmit() {
    title.textContent = inputTitle.value;
    subtitle.textContent = inputSubtitle.value;

    getForm(popUp).reset();
  }

  getForm(popUp).addEventListener('submit', submitMiddleware(onSubmit, popUp));

  setOpeningAndClosingOfPopUp(popUp, openPopUpButton, onOpen);
}

// ============================= Gallery add picture pop-up
function initGalleryAddPopUp() {
  const popUp = document.querySelector('.pop-up_type_gallery-add');
  const openPopUpButton = document.querySelector('.profile__add-button');
  const saveButton = getSubmitButton(popUp);

  const inputPictureName = popUp.querySelector('.pop-up__input_type_name');
  const inputPictureSource = popUp.querySelector('.pop-up__input_type_picture-source');

  function onClose() {
    getForm(popUp).reset();
  }

  function onOpen() {
    resetError(popUp, validationConfig);
    toggleButtonState([inputPictureName, inputPictureSource], saveButton, 'pop-up__save-button_inactive');
  }

  function onSubmit() {
    insertIntoGallery(makeCardNode({ name: inputPictureName.value, link: inputPictureSource.value }, galleryConfig));
    getForm(popUp).reset();
  }

  getForm(popUp).addEventListener('submit', submitMiddleware(onSubmit, popUp));

  setOpeningAndClosingOfPopUp(popUp, openPopUpButton, onOpen, onClose);
}

initProfilePopUp();
initGalleryAddPopUp();
loadCardsToGallery();
