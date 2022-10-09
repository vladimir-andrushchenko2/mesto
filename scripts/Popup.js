import { isLeftMouseClick } from './utilities';
export default class Popup {
  constructor(popupSelector) {
    this._element = document.querySelector(popupSelector);
  }

  open() {
    this.escapeButtonHandler = this._handleEscClose.bind(this);
    document.addEventListener('keydown', this.escapeButtonHandler);
    this._element.classList.add('pop-up_opened');
  }

  close() {
    document.removeEventListener('keydown', this.escapeButtonHandler);
    this._element.classList.remove('pop-up_opened');
  }

  setEventListeners() {
    this._element.addEventListener('mousedown', ({ target, button }) => {
      if (isLeftMouseClick(button) &&
        (target.classList.contains('pop-up') ||
          target.classList.contains('pop-up__close-btn'))) {
        closePopUp();
      }
    })
  }

  _handleEscClose(event) {
    if (event.key === 'Escape') {
      this.close();
    }
  }
}
