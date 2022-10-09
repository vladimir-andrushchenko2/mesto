export const title = document.querySelector('.profile__title-text');
export const subtitle = document.querySelector('.profile__subtitle');

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
  cardDeleteButtonSelector: '.card__delete-button'
};

export const validationConfig = {
  formSelector: '.pop-up__form',
  inputSelector: '.pop-up__input',
  submitButtonSelector: '.pop-up__save-button',
  inactiveButtonClass: 'pop-up__save-button_inactive',
  inputErrorClass: 'pop-up__input_type_error',
  errorClass: 'pop-up__input-error_active'
};
