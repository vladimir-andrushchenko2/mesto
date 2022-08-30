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

function getInputs(popUp) {
  return Array.from(popUp.querySelectorAll('.pop-up__input'));
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

function isInputValueEmpty(input) {
  return input.value === '' ? true : false;
}

// function markEmptyAsError(inputs) {
//   inputs
//     .filter(isInputValueEmpty)
//     .forEach(input => input.classList.add('pop-up__input_error'));
// }

// function removeMarkEmptyAsError(event) {
//   event.target.classList.remove('pop-up__input_error');
// }

function submitMiddleware(action, popUp) {
  return function (event) {
    event.preventDefault();

    // if (getInputs(popUp).some(isInputValueEmpty)) {
    //   markEmptyAsError(getInputs(popUp));
    //   return;
    // }

    action();

    hidePopUp(popUp);
  }
}

function setOpeningAndClosingOfPopUp(popUp, openButton, onOpen, onClose = () => { }) {
  function openPopUp() {
    onOpen();
    showPopUp(popUp);
  }

  function closePopUp() {
    onClose();
    hidePopUp(popUp);
  }

  getCloseButton(popUp).addEventListener('click', closePopUp);

  openButton.addEventListener('click', openPopUp);

  // other logic
  // getInputs(popUp).forEach(input => input.addEventListener('input', removeMarkEmptyAsError));
}

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

  initGalleryCardPictureViewPopUp(picture, name, link);

  return newNode;
}

const insertIntoGallery = makeFrontInserter(document.querySelector('.gallery__items'));

function loadCardsToGallery() {
  initialCards.map(makeCardNode).forEach(insertIntoGallery);
};

// Edit profile pop-up
function initProfilePopUp() {
  const popUp = document.querySelector('.pop-up_type_profile');
  const openButton = document.querySelector('.profile__modify-button');

  const title = document.querySelector('.profile__title-text');
  const subtitle = document.querySelector('.profile__subtitle');

  const inputTitle = popUp.querySelector('.pop-up__input_type_title');
  const inputSubtitle = popUp.querySelector('.pop-up__input_type_subtitle');

  function onOpen() {
    inputTitle.value = title.textContent;
    inputSubtitle.value = subtitle.textContent;
  }

  function onSubmit() {
    title.textContent = inputTitle.value;
    subtitle.textContent = inputSubtitle.value;

    getForm(popUp).reset();
  }

  getForm(popUp).addEventListener('submit', submitMiddleware(onSubmit, popUp));

  setOpeningAndClosingOfPopUp(popUp, openButton, onOpen);
}

// Single card view pop-up
function initGalleryCardPictureViewPopUp(openButton, name, link) {
  const popUp = document.querySelector('.pop-up_type_show-card');

  function onOpen() {
    popUp.querySelector('.pop-up__image').src = link;
    popUp.querySelector('.pop-up__image-caption').textContent = name;
  }

  setOpeningAndClosingOfPopUp(popUp, openButton, onOpen);
}

// Gallery add picture pop-up
function initGalleryAddPopUp() {
  const popUp = document.querySelector('.pop-up_type_gallery-add');
  const openButton = document.querySelector('.profile__add-button');

  const inputPictureName = popUp.querySelector('.pop-up__input_type_name');
  const inputPictureSource = popUp.querySelector('.pop-up__input_type_picture-source');

  function onClose() {
    getForm(popUp).reset();
  }

  function onSubmit() {
    insertIntoGallery(makeCardNode({ name: inputPictureName.value, link: inputPictureSource.value }));
    getForm(popUp).reset();
  }

  getForm(popUp).addEventListener('submit', submitMiddleware(onSubmit, popUp));

  setOpeningAndClosingOfPopUp(popUp, openButton, () => { }, onClose);
}

initProfilePopUp();
initGalleryAddPopUp();
loadCardsToGallery();