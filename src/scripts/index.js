import '../pages/index.css';
import Card from './components/Card.js'
import PopupWithForm from './components/PopupWithForm.js';
import { validationConfig, titleSelector, subtitleSelector, galleryConfig, profilePictureSelector } from './constants.js';
import Section from './components/Section.js';
import UserInfo from './components/UserInfo.js';
import PopupWithImage from './components/PopupWithImage';
import FormValidator from './components/FormValidator.js';
import { api } from './components/Api.js';

// profile pop-up
const userInfo = new UserInfo(titleSelector, subtitleSelector, profilePictureSelector);

api.getUserInfo()
  .then(({ name, about, avatar }) => userInfo.setUserInfo({ name, description: about, avatarLink: avatar }))
  .catch(err => { throw new Error(err) });

const profilePopUp = new PopupWithForm('.pop-up_type_profile',
  ({ title, subtitle }) => {
    api.patchUserInfo(title, subtitle)
      .then(({ name, about }) => userInfo.setUserInfo({ name, description: about }))
      .catch(err => { throw new Error(err) });
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

const generateCard = (data) => new Card(data, galleryConfig, handleOpenPictureInPopUp).generateCard();

api.getInitialCards()
  .then(initialCards => new Section({ data: initialCards, renderer: item => gallery.addItem(generateCard(item)) }, '.gallery__items').renderItems())
  .catch(err => { throw new Error(err); });

const gallery = new Section({ data: [], renderer: () => { } }, '.gallery__items');

const galleryAddPopUp = new PopupWithForm('.pop-up_type_gallery-add',
  ({ name, source: link }) => {
    api.postCard(name, link).then((data) => gallery.addItem(generateCard(data))).catch(err => { throw new Error(err) });
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
