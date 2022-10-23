import '../pages/index.css';
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
} from './constants.js';
import Card from './components/Card.js'
import Section from './components/Section.js';
import UserInfo from './components/UserInfo.js';
import PopupWithForm from './components/PopupWithForm.js';
import PopupWithImage from './components/PopupWithImage';
import FormValidator from './components/FormValidator.js';
import Api from './components/Api.js';

const api = new Api({
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-52',
  headers: {
    authorization: '701d7c23-a5ed-4bcd-aa15-7b4714e01efc',
    'Content-Type': 'application/json'
  }
});

// *** Логика установки лайка
const onLike = (cardId) => api.putCardLike(cardId);

const onRemoveLike = (cardId) => api.deleteCardLike(cardId);

// *** Логика удаления карточки
// сюда я буду записывать попап удаления чтоб он не исчез после выполения функции onDelete
let deleteConfirmationPopUp;

const onDelete = (cardId, removeElement) => {
  deleteConfirmationPopUp = new PopupWithForm('.pop-up_type_delete-card', () => {
    api.deleteCard(cardId).then(res => {
      removeElement();
      deleteConfirmationPopUp.removeEventListeners();

      deleteConfirmationPopUp.close();
    }).catch(err => console.error(err));
  });

  deleteConfirmationPopUp.setEventListeners();

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

// при определении понадобится функция generateCard поэтому определяю после оплучения _id клиента который нужен для makeCardGenerator
let galleryAddPopUp;

const gallery = new Section({ data: [], renderer: () => { } }, '.gallery__items');

const addPostFormValidator = new FormValidator(galleryAddForm, validationConfig);
addPostFormValidator.enableValidation()

// profile pop-up
const userInfo = new UserInfo(titleSelector, subtitleSelector, profilePictureSelector);

// сначала получаю данные о клиенте а потом создаю карточки для определения какие карты можно удалять а какие нет
api.getUserInfo()
  .then(({ name, about, avatar, _id }) => {
    userInfo.setUserInfo({ name, description: about, avatarLink: avatar });
    // определяю функцию генерации карт здесь поскльку для рендеринга карт нужнен айди пользователя
    generateCard = makeCardGenerator(_id);

    return api.getInitialCards();
  })
  .then(initialCards => {
    // теперь когда generateCard готов можно заполнять секцию, это нужно для того чтобы у карточек созданных не клиентом не отображалась кнопка удаления
    new Section({
      data: initialCards,
      renderer: item => {
        gallery.addItem(generateCard(item));
      }
    }, '.gallery__items').renderItems();

    galleryAddPopUp = new PopupWithForm('.pop-up_type_gallery-add',
      ({ name, source: link }) => {
        const button = galleryAddForm.querySelector('.pop-up__save-button');
        button.value = 'Сохранинение...';

        api.postCard(name, link)
          .then((data) => gallery.addItem(generateCard(data)))
          .catch(err => console.error(err))
          .finally(() => {
            button.value = 'Сохранить';
            galleryAddPopUp.close();
          });
      }
    );

    galleryAddPopUp.setEventListeners();

    document.querySelector('.profile__add-button').addEventListener('click', () => {
      addPostFormValidator.resetError();
      addPostFormValidator.toggleButtonState();
      galleryAddPopUp.open()
    });
  })
  .catch(err => { console.error(err); localStorage.setItem('err', err) });

// *** Изменение данных о клиенте
const profilePopUp = new PopupWithForm('.pop-up_type_profile',
  ({ title, subtitle }) => {
    const button = profileEditForm.querySelector('.pop-up__save-button');
    button.value = 'Сохранинение...';

    api.patchUserInfo(title, subtitle)
      .then(({ name, about }) => userInfo.setUserInfo({ name, description: about }))
      .catch(err => console.error(err))
      .finally(() => {
        button.value = 'Сохранить';
        profilePopUp.close();
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
    button.value = 'Сохранинение...';

    api.patchUserAvatar(source).then(data => {
      userInfo.setUserInfo({ avatarLink: data.avatar })
    })
      .catch(err => console.error(err))
      .finally(() => {
        button.value = 'Сохранить';
        editProfilePicturePopUp.close();
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
