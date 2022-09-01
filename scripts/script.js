const selectors = {
  formSelector: '.pop-up__form',
  inputSelector: '.pop-up__input',
  submitButtonSelector: '.pop-up__save-button',
  inactiveButtonClass: 'pop-up__save-button_inactive',
  inputErrorClass: 'pop-up__input_type_error',
  errorClass: 'pop-up__input-error_active'
};

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

// ============================= Validation logic
function showInputError(formElement, inputElement, errorMessage, { inputErrorClass, errorClass }) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(errorClass);
}

function hideInputError(formElement, inputElement, { inputErrorClass, errorClass }) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(inputErrorClass);
  errorElement.textContent = '';
  errorElement.classList.remove(errorClass);
}

function checkInputValidity(formElement, inputElement, selectors) {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, selectors);
  } else {
    hideInputError(formElement, inputElement, selectors);
  }
};

function hasInvalidInput(inputList) {
  return inputList.some(input => !input.validity.valid);
}

function toggleButtonState(inputList, buttonElement, inactiveButtonClass = 'pop-up__save-button_inactive') {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(inactiveButtonClass);
  } else {
    buttonElement.classList.remove(inactiveButtonClass);
  }
}

function setEventListeners(formElement, selectors) {
  const inputList = Array.from(formElement.querySelectorAll(selectors.inputSelector));
  const buttonElement = formElement.querySelector(selectors.submitButtonSelector);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', function () {
      checkInputValidity(formElement, inputElement, selectors);
      toggleButtonState(inputList, buttonElement, selectors.inactiveButtonClass);
    });
  });
}

const enableValidation = (selectors) => {
  Array.from(document.querySelectorAll(selectors.formSelector)).forEach(form => setEventListeners(form, selectors));
};

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
  popUp.addEventListener('click', (event) => {
    if (event.target.classList.contains('pop-up')) {
      closePopUp();
    }
  })
}

// ============================= Cards in gallery
function makeCardNode({ name, link }) {
  const newNode = document.querySelector('#card').content.querySelector('.gallery__item').cloneNode(true);

  const picture = newNode.querySelector('.card__picture');
  picture.src = link;
  picture.alt = name;

  newNode.querySelector('.card__caption').textContent = name;

  function likeHandler(event) {
    event.target.classList.toggle('card__like-button_active');
  }

  function deleteHandler(event) {
    event.target.closest('.gallery__item').remove();
  }

  newNode.querySelector('.card__like-button').addEventListener('click', likeHandler);
  newNode.querySelector('.card__delete-button').addEventListener('click', deleteHandler);

  return newNode;
}

const insertIntoGallery = makeFrontInserter(document.querySelector('.gallery__items'));

function loadCardsToGallery() {
  initialCards.map(makeCardNode).forEach(insertIntoGallery);
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
    toggleButtonState([inputTitle, inputSubtitle], saveButton);
  }

  function onSubmit() {
    title.textContent = inputTitle.value;
    subtitle.textContent = inputSubtitle.value;

    getForm(popUp).reset();
  }

  getForm(popUp).addEventListener('submit', submitMiddleware(onSubmit, popUp));

  setOpeningAndClosingOfPopUp(popUp, openPopUpButton, onOpen);
}

// ============================= Single card view pop-up
function initGalleryCardPictureViewPopUp() {
  const popUp = document.querySelector('.pop-up_type_show-card');
  const galleryItems = document.querySelector('.gallery__items');

  function closePopUp(event) {
    hidePopUp(popUp);
    document.removeEventListener('keydown', closeOnEsc);
  }

  function closeOnEsc(event) {
    if (event.key === 'Escape') {
      closePopUp();
    }
  }

  galleryItems.addEventListener('click', event => {
    const target = event.target;

    if (target.classList.contains('card__picture')) {
      popUp.querySelector('.pop-up__image').src = target.src;
      popUp.querySelector('.pop-up__image-caption').textContent = target.alt;

      showPopUp(popUp);

      document.addEventListener('keydown', closeOnEsc);
    }
  })

  popUp.addEventListener('click', (event) => {
    if (event.target.classList.contains('pop-up')) {
      hidePopUp(popUp);
    }
  })

  getCloseButton(popUp).addEventListener('click', () => hidePopUp(popUp));
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
    toggleButtonState([inputPictureName, inputPictureSource], saveButton);
  }

  function onSubmit() {
    insertIntoGallery(makeCardNode({ name: inputPictureName.value, link: inputPictureSource.value }));
    getForm(popUp).reset();
  }

  getForm(popUp).addEventListener('submit', submitMiddleware(onSubmit, popUp));

  setOpeningAndClosingOfPopUp(popUp, openPopUpButton, onOpen, onClose);
}

initProfilePopUp();
initGalleryAddPopUp();
initGalleryCardPictureViewPopUp();
loadCardsToGallery();
enableValidation(selectors);
