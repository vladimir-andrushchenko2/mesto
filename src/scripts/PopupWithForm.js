import Popup from './Popup.js';

export default class PopupWithForm extends Popup {
  constructor(popupSelector, onSubmit) {
    super(popupSelector);

    this._form = this._element.querySelector('.pop-up__form');

    this._onSubmit = onSubmit;

    this._inputList = this._form.querySelectorAll('.pop-up__input');
  }

  close() {
    super.close();
    this._form.reset();
  }

  setEventListeners() {
    super.setEventListeners();

    this._form.addEventListener('submit', (event) => {
      event.preventDefault();

      this._onSubmit(this._getInputValues());

      this.close();
    });
  }

  _getInputValues() {
    this._formValues = {};

    this._inputList.forEach(input => {
      this._formValues[input.name] = input.value;
    });

    return this._formValues;
  }
}
