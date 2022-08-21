const initialCards = [
  {
    name: 'Архыз',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg'
  },
  {
    name: 'Челябинская область',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg'
  },
  {
    name: 'Иваново',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg'
  },
  {
    name: 'Камчатка',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg'
  },
  {
    name: 'Холмогорский район',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg'
  },
  {
    name: 'Байкал',
    link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg'
  }
];

function getInputs(popUp) {
  return Array.from(popUp.querySelectorAll('.pop-up__input'));
}

function hide(popUp) {
  popUp.classList.remove('pop-up_opened');
}

function clearInputs(popUp) {
  getInputs(popUp).forEach(input => input.value = '');
}

// function getClearInputsAndCloseCallback(popUp) {
//   return function () {
//     clearInputs(popUp);
//     hide(popUp);
//   }
// }

function frontInserter(container) {
  return function (node) {
    container.prepend(node);
  }
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

function show(popUp) {
  popUp.classList.add('pop-up_opened');
}

function isInputValueEmpty(input) {
  return input.value === '' ? true : false;
}

function markEmptyAsError(inputs) {
  inputs
    .filter(isInputValueEmpty)
    .forEach(input => input.classList.add('pop-up__input_error'));
}

function removeMarkEmptyAsError(event) {
  event.target.classList.remove('pop-up__input_error');
}

function submitMiddleware(action, popUp) {
  return function (event) {
    event.preventDefault();

    if (getInputs(popUp).some(isInputValueEmpty)) {
      markEmptyAsError(getInputs(popUp));
      return;
    }

    action();

    hide(popUp);
  }
}

function doNothing() {
  return;
}

function setOpeningAndClosingOfPopUp(popUp, openButton, onOpen, onClose) {
  function openPopUp() {
    onOpen();
    show(popUp);
  }

  function closePopUp() {
    onClose();
    hide(popUp);
  }

  getCloseButton(popUp).addEventListener('click', closePopUp);

  openButton.addEventListener('click', openPopUp);

  // other logic
  getInputs(popUp).forEach(input => input.addEventListener('input', removeMarkEmptyAsError));
}

function initProfilePopUp() {
  const popUp = document.querySelector('.pop-up_profile');
  const openButton = document.querySelector('.profile__modify-button');

  const title = document.querySelector('.profile__title-text');
  const subtitle = document.querySelector('.profile__subtitle');

  const inputTitle = popUp.querySelector('.pop-up__input_type_title');
  const inputSubtitle = popUp.querySelector('.pop-up__input_type_subtitle');

  function onOpen() {
    inputTitle.value = title.textContent;
    inputSubtitle.value = subtitle.textContent;
  }

  function onClose() {
    doNothing();
  }

  function onSubmit() {
    title.textContent = inputTitle.value;
    subtitle.textContent = inputSubtitle.value;

    clearInputs(popUp);
  }

  getForm(popUp).addEventListener('submit', submitMiddleware(onSubmit, popUp));

  setOpeningAndClosingOfPopUp(popUp, openButton, onOpen, onClose);
}

function initGalleryCardPictureViewPopUp(openButton, name, link) {
  const popUp = document.querySelector('.pop-up_show-card');

  function onOpen() {
    popUp.querySelector('.pop-up__image').src = link;
    popUp.querySelector('.pop-up__image-caption').textContent = name;
  }

  function onClose() {
    doNothing();
  }

  setOpeningAndClosingOfPopUp(popUp, openButton, onOpen, onClose);
}

function initGalleryAddPopUp() {
  const popUp = document.querySelector('.pop-up_gallery-add');
  const openButton = document.querySelector('.profile__add-button');

  const inputPictureName = popUp.querySelector('.pop-up__input_type_name');
  const inputPictureSource = popUp.querySelector('.pop-up__input_type_picture-source');

  function likeHandler(event) {
    event.stopPropagation();
    event.target.classList.toggle('card__like-button_active');
  }

  function makeCardNode({ name, link }) {
    const newNode = document.querySelector('#card').content.querySelector('.gallery__item').cloneNode(true);
    const picture = newNode.querySelector('.card__picture');
    picture.src = link;
    picture.alt = name;
    newNode.querySelector('.card__caption').textContent = name;
    newNode.querySelector('.card__like-button').addEventListener('click', likeHandler);
    initGalleryCardPictureViewPopUp(picture, name, link);
    return newNode;
  }

  const insertIntoGallery = frontInserter(document.querySelector('.gallery__items'));

  function loadCardsToGallery() {
    initialCards.map(makeCardNode).forEach(insertIntoGallery);
  };

  function onClose() {
    clearInputs(popUp);
  }

  function onSubmit() {
    insertIntoGallery(makeCardNode({ name: inputPictureName.value, link: inputPictureSource.value }));
    clearInputs(popUp);
  }

  function onOpen() {
    doNothing();
  }

  getForm(popUp).addEventListener('submit', submitMiddleware(onSubmit, popUp));

  setOpeningAndClosingOfPopUp(popUp, openButton, onOpen, onClose);

  loadCardsToGallery();
}

initProfilePopUp();
initGalleryAddPopUp();