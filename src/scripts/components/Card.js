export default class Card {
  constructor({ name, link }, config, handleCardClick) {
    this._name = name;
    this._link = link;
    this._config = config;
    this._handleCardClick = handleCardClick;
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
    this._element.remove();
    this._element = null;
  }

  _setEventListeners() {
    this._element.querySelector(this._config.cardLikeButtonSelector).addEventListener('click', (event) => this._handleLike(event));
    this._element.querySelector(this._config.cardDeleteButtonSelector).addEventListener('click', (event) => this._handleDelete(event));

    this._picture.addEventListener('click', () => {
      this._handleCardClick(this._link, this._name);
    });
  }

  generateCard() {
    this._element = this._getTemplate();
    this._picture = this._element.querySelector(this._config.cardPictureSelector);

    this._setEventListeners();

    this._picture.src = this._link;
    this._picture.alt = this._name;

    this._caption = this._element.querySelector(this._config.cardCaptionSelector);
    this._caption.textContent = this._name;

    return this._element;
  }
}
