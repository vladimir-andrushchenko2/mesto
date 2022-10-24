import './index.css';
import {
  galleryAddForm,
  profileEditForm,
  validationConfig,
  titleSelector,
  subtitleSelector,
  galleryConfig,
  profilePictureSelector,
  inputTitle,
  inputSubtitle,
  editPictureForm
} from '../utils/constants.js';
import Card from '../components/Card.js'
import Section from '../components/Section.js';
import UserInfo from '../components/UserInfo.js';
import PopupWithForm from '../components/PopupWithForm.js';
import PopupWithImage from '../components/PopupWithImage';
import FormValidator from '../components/FormValidator.js';
import Api from '../components/Api.js';

const api = new Api({
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-52',
  headers: {
    authorization: '701d7c23-a5ed-4bcd-aa15-7b4714e01efc',
    'Content-Type': 'application/json'
  }
});

const renderLoading = (button, isLoading) => {
  if (isLoading) {
    button.value = 'Сохранение...';
  } else {
    button.value = 'Сохранить';
  }
}

// *** Логика установки лайка
const onLike = (cardId) => api.putCardLike(cardId);

const onRemoveLike = (cardId) => api.deleteCardLike(cardId);

// *** Логика удаления карточки
let onDeleteCallbackForOnConfirmDelete = () => console.log('This function is a placeholder and should be redefined in onDelete argument for Card constructor');

const deleteConfirmationPopUp = new PopupWithForm('.pop-up_type_delete-card', () => {
  onDeleteCallbackForOnConfirmDelete();
});

deleteConfirmationPopUp.setEventListeners();

const onDelete = (cardId, removeElement) => {
  onDeleteCallbackForOnConfirmDelete = () => {
    api.deleteCard(cardId)
      .then(() => {
        removeElement();
        deleteConfirmationPopUp.close();
      })
      .catch(err => console.error(err));
  }

  deleteConfirmationPopUp.open();
}

// *** Логика открытия увеличенной карточки
// show image pop up
const { popUpSelector, popUpImageSelector, popUpImageCaptionSelector } = galleryConfig;

const showImagePopUp = new PopupWithImage(popUpSelector, popUpImageSelector, popUpImageCaptionSelector);

showImagePopUp.setEventListeners();

// gallery pop-up
const handleOpenPictureInPopUp = (link, name) => {
  showImagePopUp.open(link, name);
}

// *** Логика создания карточки
const makeCardGenerator = (clientId) => (cardData) =>
  new Card({ ...cardData, clientId }, galleryConfig, handleOpenPictureInPopUp, onDelete, onLike, onRemoveLike).generateCard();

// сюда я сохраню функцию для генерации карт после пoлучения _id клиента от сервера
let generateCard;

const gallery = new Section(item => gallery.addItem(generateCard(item)), '.gallery__items');

const addPostFormValidator = new FormValidator(galleryAddForm, validationConfig);
addPostFormValidator.enableValidation()

// *** попап добавления карты
const galleryAddPopUp = new PopupWithForm('.pop-up_type_gallery-add',
  ({ name, source: link }) => {
    const button = galleryAddForm.querySelector('.pop-up__save-button');
    renderLoading(button, true);

    api.postCard(name, link)
      .then((data) => {
        gallery.addItem(generateCard(data));
        galleryAddPopUp.close();
      })
      .catch(err => console.error(err))
      .finally(() => {
        renderLoading(button, false);
      });
  }
);

galleryAddPopUp.setEventListeners();

document.querySelector('.profile__add-button').addEventListener('click', () => {
  addPostFormValidator.resetError();
  addPostFormValidator.toggleButtonState();
  galleryAddPopUp.open()
});

const userInfo = new UserInfo(titleSelector, subtitleSelector, profilePictureSelector);

Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([{ name, about, avatar, _id }, initialCards]) => {
    userInfo.setUserInfo({ name, description: about, avatarLink: avatar });
    // определяю функцию генерации карт здесь поскльку для рендеринга карт нужнен айди пользователя
    generateCard = makeCardGenerator(_id);
    gallery.renderItems(initialCards);
  })
  .catch(err => { console.error(err); localStorage.setItem('err', err) });

// *** Изменение данных о клиенте
const profilePopUp = new PopupWithForm('.pop-up_type_profile',
  ({ title, subtitle }) => {
    const button = profileEditForm.querySelector('.pop-up__save-button');
    renderLoading(button, true)

    api.patchUserInfo(title, subtitle)
      .then(({ name, about }) => {
        userInfo.setUserInfo({ name, description: about });
        profilePopUp.close();
      })
      .catch(err => console.error(err))
      .finally(() => {
        renderLoading(button, false)
      });
  }
);

profilePopUp.setEventListeners();

const profileFormValidator = new FormValidator(profileEditForm, validationConfig);
profileFormValidator.enableValidation();

document.querySelector('.profile__modify-button').addEventListener('click', () => {
  profileFormValidator.resetError();

  const { name, description } = userInfo.getUserInfo();

  inputTitle.value = name;
  inputSubtitle.value = description;

  profileFormValidator.toggleButtonState();

  profilePopUp.open();
});

// изменение аватарки
const editProfilePicturePopUp = new PopupWithForm('.pop-up_type_edit-profile-picture',
  ({ source }) => {
    const button = editPictureForm.querySelector('.pop-up__save-button');
    renderLoading(button, true);

    api.patchUserAvatar(source)
      .then(data => {
        userInfo.setUserInfo({ avatarLink: data.avatar });
        editProfilePicturePopUp.close();
      })
      .catch(err => console.error(err))
      .finally(() => {
        renderLoading(button, false);
      });
  })

editProfilePicturePopUp.setEventListeners();

const profileEditPictureFormValidator = new FormValidator(editPictureForm, validationConfig);
profileEditPictureFormValidator.enableValidation();

document.querySelector('.profile__picture-overlay').addEventListener('click', () => {
  profileEditPictureFormValidator.resetError();
  profileEditPictureFormValidator.toggleButtonState();
  editProfilePicturePopUp.open();
})
