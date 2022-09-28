import { setOpeningAndClosingOfPopUp } from './utilities.js';

export default class Card {
  constructor(data, config, handleOpenPopUp) {
    this._name = data.name;
    this._link = data.link;
    this._config = config;
    this._handleOpenPopUp = handleOpenPopUp;
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

    this._handleOpenPopUp(picture, caption, this._config);

    return this._element;
  }
}
