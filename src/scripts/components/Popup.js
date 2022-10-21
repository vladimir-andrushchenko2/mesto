import { isLeftMouseClick } from '../utilities.js';
export default class Popup {
  constructor(popupSelector) {
    this._element = document.querySelector(popupSelector);
    this.escapeButtonHandler = this._handleEscClose.bind(this);
    this.closeHandler = this._handleClose.bind(this);
  }

  open() {
    document.addEventListener('keydown', this.escapeButtonHandler);
    this._element.classList.add('pop-up_opened');
  }

  close() {
    document.removeEventListener('keydown', this.escapeButtonHandler);
    this._element.classList.remove('pop-up_opened');
  }

  _handleClose({ target, button }) {
    if (isLeftMouseClick(button) &&
      (target.classList.contains('pop-up') ||
        target.classList.contains('pop-up__close-btn'))) {
      this.close();
    }
  }

  setEventListeners() {
    this._element.addEventListener('mousedown', this.closeHandler);
  }

  removeEventListeners() {
    this._element.removeEventListener('mousedown', this.closeHandler);
  }

  _handleEscClose(event) {
    if (event.key === 'Escape') {
      this.close();
    }
  }
}
