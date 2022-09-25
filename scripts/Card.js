import { setOpeningAndClosingOfPopUp } from './utilities.js';

export default class Card {
  constructor(data, config) {
    this._name = data.name;
    this._link = data.link;
    this._config = config;
  }

  _getTemplate() {
    return document
      .querySelector(this._config.cardTemplateSelector)
      .content.querySelector(this._config.cardNodeSelector)
      .cloneNode(true);
  }

  _handleLike(event) {
    event.target.classList.toggle(this._config.cardLikeButtonActiveClass);
  }

  _handleDelete(event) {
    event.target.closest(this._config.cardNodeSelector).remove();
  }

  _setEventListeners() {
    this._element.querySelector(this._config.cardLikeButtonSelector).addEventListener('click', (event) => this._handleLike(event));
    this._element.querySelector(this._config.cardDeleteButtonSelector).addEventListener('click', (event) => this._handleDelete(event));
  }

  generateCard() {
    this._element = this._getTemplate();

    this._setEventListeners();

    const picture = this._element.querySelector(this._config.cardPictureSelector);
    picture.src = this._link;
    picture.alt = this._name;

    const caption = this._element.querySelector(this._config.cardCaptionSelector);
    caption.textContent = this._name;

    const popUp = document.querySelector(this._config.popUpSelector);
    const popUpImage = popUp.querySelector(this._config.popUpImageSelector);
    const popUpCaption = popUp.querySelector(this._config.popUpImageCaptionSelector);

    function onOpen() {
      popUpImage.src = picture.src;
      popUpImage.alt = picture.alt;
      popUpCaption.textContent = caption.textContent;
    }

    setOpeningAndClosingOfPopUp(popUp, picture, onOpen);

    return this._element;
  }
}
