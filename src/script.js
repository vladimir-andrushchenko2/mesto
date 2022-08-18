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

const editButton = document.querySelector('.profile__modify-button');

const popUp = document.querySelector('.pop-up');
const popUpCloseBtn = document.querySelector('.pop-up__close-btn');

const formProfile = document.querySelector('.pop-up__form_profile');

const inputTitle = document.querySelector('.edit-profile-form__input_type_title');
const inputSubtitle = document.querySelector('.edit-profile-form__input_type_subtitle');

const title = document.querySelector('.profile__title-text');
const subtitle = document.querySelector('.profile__subtitle');

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

function closeForm() {
  inputTitle.value = '';
  inputSubtitle.value = '';

  popUp.classList.remove('pop-up_opened');
}

function openPopUp() {
  inputTitle.value = title.textContent;
  inputSubtitle.value = subtitle.textContent;

  popUp.classList.add('pop-up_opened');
}

function formSubmitHandler(event) {
  event.preventDefault();


  if (newTitle.value != '') {
    title.textContent = inputTitle.value;
  }

  if (newSubtitle.value != '') {
    subtitle.textContent = inputSubtitle.value;
  }

  closeForm();
}

editButton.addEventListener('click', openPopUp);

popUpCloseBtn.addEventListener('click', closeForm);

formProfile.addEventListener('submit', formSubmitHandler);

loadCardsToGallery();