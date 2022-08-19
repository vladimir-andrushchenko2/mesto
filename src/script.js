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

const popUpGalleryAdd = document.querySelector('.pop-up_gallery-add');

function makeCardNode({ name, link }) {
  const newNode = document.querySelector('#card').content.querySelector('.gallery__item').cloneNode(true);
  newNode.querySelector('.card__picture').src = link;
  newNode.querySelector('.card__caption').textContent = name;
  return newNode;
}

function makeGalleryInserter(galleryContainer) {
  return function (node) {
    galleryContainer.prepend(node);
  }
}

function loadCardsToGallery() {
  const insertIntoGallery = makeGalleryInserter(document.querySelector('.gallery__items'));
  initialCards.map(makeCardNode).forEach(insertIntoGallery);
};

function getInputs(popUp) {
  return Array.from(popUp.querySelectorAll('.pop-up__input'));
}

function getCloseCallback(popUp) {
  return function () {
    getInputs(popUp).forEach(input => input.value = '');

    popUp.classList.remove('pop-up_opened');
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

function submitHandler(action, popUp) {
  return function (event) {
    event.preventDefault();

    if (getInputs(popUp).some(isInputValueEmpty)) {
      markEmptyAsError(getInputs(popUp));
      return;
    }

    action();
  }
}

function initProfilePopUp() {
  const title = document.querySelector('.profile__title-text');
  const subtitle = document.querySelector('.profile__subtitle');

  const popUp = document.querySelector('.pop-up_profile');

  const inputTitle = popUp.querySelector('.pop-up__input_type_title');
  const inputSubtitle = popUp.querySelector('.pop-up__input_type_subtitle');

  function openProfilePopUp() {
    inputTitle.value = title.textContent;
    inputSubtitle.value = subtitle.textContent;

    show(popUp);
  }

  const closeProfilePopUp = getCloseCallback(popUp);

  function setInputsAndClose() {
    title.textContent = inputTitle.value;
    subtitle.textContent = inputSubtitle.value;

    closeProfilePopUp();
  }

  document.querySelector('.profile__modify-button').addEventListener('click', openProfilePopUp);

  getCloseButton(popUp).addEventListener('click', closeProfilePopUp);

  getForm(popUp).addEventListener('submit', submitHandler(setInputsAndClose, popUp));

  getInputs(popUp).forEach(input => input.addEventListener('input', removeMarkEmptyAsError));
}

initProfilePopUp();
loadCardsToGallery();