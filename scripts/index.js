import { initialCards } from './cards.js'
import { setOpeningAndClosingOfPopUp } from './utilities.js'
import Card from './Card.js'
import PopupWithForm from './PopupWithForm.js';
import { titleSelector, subtitleSelector, galleryConfig } from './constants.js';
import Section from './Section.js';
import UserInfo from './UserInfo.js';

const userInfo = new UserInfo(titleSelector, subtitleSelector);

// profile pop-up
const profilePopUp = new PopupWithForm('.pop-up_type_profile', ({ title, subtitle }) => {
  userInfo.setUserInfo({ name: title, description: subtitle });
});

profilePopUp.setEventListeners();

profilePopUp.setOnOpen((form) => {
  const inputTitle = form.querySelector('.pop-up__input_type_title');
  const inputSubtitle = form.querySelector('.pop-up__input_type_subtitle');

  const { name, description } = userInfo.getUserInfo();

  inputTitle.value = name;
  inputSubtitle.value = description;
});

document.querySelector('.profile__modify-button').addEventListener('click', () => profilePopUp.open());

// gallery pop-up
const handleOpenPictureInPopUp = (link, name, picture, config) => {
  const popUp = document.querySelector(config.popUpSelector);
  const popUpImage = popUp.querySelector(config.popUpImageSelector);
  const popUpCaption = popUp.querySelector(config.popUpImageCaptionSelector);

  function onOpen() {
    popUpImage.src = link;
    popUpImage.alt = name;
    popUpCaption.textContent = name;
  }

  picture.addEventListener('error', () => {
    const placeholder = document.createElement('div');
    placeholder.classList.add('profile__picture-placeholder');
    picture.after(placeholder);
    picture.remove();
  })

  setOpeningAndClosingOfPopUp(popUp, picture, onOpen);
}

const gallery = new Section({
  data: initialCards, renderer: (item) => {
    const card = new Card(item, galleryConfig, handleOpenPictureInPopUp).generateCard();
    gallery.addItem(card);
  }
},
  '.gallery__items');

gallery.renderItems();

const galleryAddPopUp = new PopupWithForm('.pop-up_type_gallery-add', ({ name, source: link }) => {
  gallery.addItem(new Card({ name, link }, galleryConfig, handleOpenPictureInPopUp).generateCard())
});

galleryAddPopUp.setEventListeners();

document.querySelector('.profile__add-button').addEventListener('click', () => galleryAddPopUp.open());
