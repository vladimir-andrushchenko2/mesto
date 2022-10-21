import '../pages/index.css';
import Card from './components/Card.js'
import PopupWithForm from './components/PopupWithForm.js';
import { galleryAddForm, profileEditForm, validationConfig, titleSelector, subtitleSelector, galleryConfig, profilePictureSelector } from './constants.js';
import Section from './components/Section.js';
import UserInfo from './components/UserInfo.js';
import PopupWithImage from './components/PopupWithImage';
import FormValidator from './components/FormValidator.js';
import { api } from './components/Api.js';


// *** Логика установки лайка
const onLike = (cardId) => api.putCardLike(cardId).catch(err => console.error(err));

// *** Логика удаления карточки
// сюда я буду записывать попап удаления чтоб он не исчез после выполения функции onDelete
let deleteConfirmationPopUp;

const onDelete = (cardId, removeElement) => {
  deleteConfirmationPopUp = new PopupWithForm('.pop-up_type_delete-card', () => {
    api.deleteCard(cardId).then(res => {
      removeElement();
      deleteConfirmationPopUp.removeEventListeners();
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
const makeCardGeneratorCard = (clientId) => (cardData) =>
  new Card({ ...cardData, clientId }, galleryConfig, handleOpenPictureInPopUp, onDelete, onLike).generateCard();

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
    generateCard = makeCardGeneratorCard(_id);

    return api.getInitialCards();
  })
  .then(initialCards => {
    // теперь когда generateCard готов можно заполнять секцию, это нужно для того чтобы у карточек созданных не клиентом не отображалась кнопка удаления
    new Section({
      data: initialCards,
      renderer: item => {
        console.log(item)
        gallery.addItem(generateCard(item));
      }
    }, '.gallery__items').renderItems();

    galleryAddPopUp = new PopupWithForm('.pop-up_type_gallery-add',
      ({ name, source: link }) => {
        api.postCard(name, link).then((data) => gallery.addItem(generateCard(data))).catch(err => console.error(err));
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
    api.patchUserInfo(title, subtitle)
      .then(({ name, about }) => userInfo.setUserInfo({ name, description: about }))
      .catch(err => console.error(err));
  }
);

profilePopUp.setEventListeners();

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



