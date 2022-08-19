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

function closePopUp(popUp) {
  return function () {
    Array.from(popUp.querySelectorAll('.pop-up__input')).forEach(input => input.value = '');

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

function initProfilePopUp() {
  const popUp = document.querySelector('.pop-up_profile');
  const title = document.querySelector('.profile__title-text');
  const subtitle = document.querySelector('.profile__subtitle');

  function openProfilePopUp() {
    popUp.querySelector('.pop-up__input_type_title').value = title.textContent;
    popUp.querySelector('.pop-up__input_type_subtitle').value = subtitle.textContent;

    popUp.classList.add('pop-up_opened');
  }

  function editProfile(event) {
    event.preventDefault();

    // refactor this bs
    let inputTitle = popUp.querySelector('.pop-up__input_type_title');
    if (inputTitle.value != '') {
      title.textContent = inputTitle.value;
    } else {
      inputTitle.classList.add('pop-up__input_error');
      return;
    }

    let inputSubtitle = popUp.querySelector('.pop-up__input_type_subtitle');
    if (inputSubtitle.value != '') {
      subtitle.textContent = inputSubtitle.value;
    } else {
      inputSubtitle.classList.add('pop-up__input_error');
      return;
    }

    closePopUp(document.querySelector('.pop-up_profile'))();
  }

  document.querySelector('.profile__modify-button').addEventListener('click', openProfilePopUp);

  getCloseButton(popUp).addEventListener('click', closePopUp(popUp));

  getForm(popUp).addEventListener('submit', editProfile);
}

initProfilePopUp();
loadCardsToGallery();