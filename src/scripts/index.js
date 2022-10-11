import '../pages/index.css';
import { initialCards } from './cards.js'
import Card from './Card.js'
import PopupWithForm from './PopupWithForm.js';
import { validationConfig, titleSelector, subtitleSelector, galleryConfig } from './constants.js';
import Section from './Section.js';
import UserInfo from './UserInfo.js';
import PopupWithImage from './PopupWithImage.js';
import FormValidator from './FormValidator.js';

// profile pop-up
const userInfo = new UserInfo(titleSelector, subtitleSelector);

const profilePopUp = new PopupWithForm('.pop-up_type_profile',
  ({ title, subtitle }) => {
    userInfo.setUserInfo({ name: title, description: subtitle });
  }
);

profilePopUp.setEventListeners();

const profileEditForm = document.querySelector('.pop-up_type_profile').querySelector('.pop-up__form');

const profileFormValidator = new FormValidator(profileEditForm, validationConfig);
profileFormValidator.enableValidation();

const inputTitle = profileEditForm.querySelector('.pop-up__input_type_title');
const inputSubtitle = profileEditForm.querySelector('.pop-up__input_type_subtitle');

document.querySelector('.profile__modify-button').addEventListener('click', () => {
  profileFormValidator.resetError();

  const { name, description } = userInfo.getUserInfo();

  inputTitle.value = name;
  inputSubtitle.value = description;

  profileFormValidator.toggleButtonState();

  profilePopUp.open();
});

// show image pop up
const { popUpSelector, popUpImageSelector, popUpImageCaptionSelector } = galleryConfig;

const showImagePopUp = new PopupWithImage(popUpSelector, popUpImageSelector, popUpImageCaptionSelector);

showImagePopUp.setEventListeners();

// gallery pop-up
const handleOpenPictureInPopUp = (link, name) => {
  showImagePopUp.open(link, name);
}

const generateCard = ({ name, link }) => new Card({ name, link }, galleryConfig, handleOpenPictureInPopUp).generateCard();

const gallery = new Section({
  data: initialCards, renderer: (item) => {
    gallery.addItem(generateCard(item));
  }
},
  '.gallery__items');

gallery.renderItems();

const galleryAddPopUp = new PopupWithForm('.pop-up_type_gallery-add',
  ({ name, source: link }) => {
    gallery.addItem(generateCard({ name, link }));
  }
);

const galleryAddForm = document.querySelector('.pop-up_type_gallery-add').querySelector('.pop-up__form');

const addPostFormValidator = new FormValidator(galleryAddForm, validationConfig);
addPostFormValidator.enableValidation()

galleryAddPopUp.setEventListeners();

document.querySelector('.profile__add-button').addEventListener('click', () => {
  addPostFormValidator.resetError();
  addPostFormValidator.toggleButtonState();
  galleryAddPopUp.open()
});
