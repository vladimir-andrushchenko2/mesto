export const titleSelector = '.profile__title-text';
export const subtitleSelector = '.profile__subtitle';
export const profilePictureSelector = '.profile__picture';
export const profileEditForm = document.querySelector('.pop-up_type_profile').querySelector('.pop-up__form');
export const galleryAddForm = document.querySelector('.pop-up_type_gallery-add').querySelector('.pop-up__form');
export const editPictureForm = document.querySelector('.pop-up_type_edit-profile-picture').querySelector('.pop-up__form');
export const inputTitle = profileEditForm.querySelector('.pop-up__input_type_title');
export const inputSubtitle = profileEditForm.querySelector('.pop-up__input_type_subtitle');

export const galleryConfig = {
  cardTemplateSelector: '#card',
  cardNodeSelector: '.gallery__item',
  cardPictureSelector: '.card__picture',
  cardCaptionSelector: '.card__caption',
  cardLikeButtonActiveClass: 'card__like-button_active',
  popUpSelector: '.pop-up_type_show-card',
  popUpImageSelector: '.pop-up__image',
  popUpImageCaptionSelector: '.pop-up__image-caption',
  cardLikeButtonSelector: '.card__like-button',
  cardDeleteButtonSelector: '.card__delete-button',
  likeCountSelector: '.card__likes'
};

export const validationConfig = {
  formSelector: '.pop-up__form',
  inputSelector: '.pop-up__input',
  submitButtonSelector: '.pop-up__save-button',
  inactiveButtonClass: 'pop-up__save-button_inactive',
  inputErrorClass: 'pop-up__input_type_error',
  errorClass: 'pop-up__input-error_active'
};
