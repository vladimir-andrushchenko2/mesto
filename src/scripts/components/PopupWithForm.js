import Popup from './Popup.js';

export default class PopupWithForm extends Popup {
  constructor(popupSelector, onSubmit) {
    super(popupSelector);

    this._form = this._element.querySelector('.pop-up__form');

    this._onSubmit = onSubmit;

    this._inputList = this._form.querySelectorAll('.pop-up__input');

    this.submitHandler = this._handelSubmit.bind(this);
  }

  close() {
    super.close();
    this._form.reset();
  }

  _handelSubmit(event) {
    event.preventDefault();

    this._onSubmit(this._getInputValues());

    this.close();
  }

  setEventListeners() {
    super.setEventListeners();

    this._form.addEventListener('submit', this.submitHandler);
  }

  removeEventListeners() {
    super.removeEventListeners();

    this._form.removeEventListener('submit', this.submitHandler);
  }

  _getInputValues() {
    this._formValues = {};

    this._inputList.forEach(input => {
      this._formValues[input.name] = input.value;
    });

    return this._formValues;
  }
}
