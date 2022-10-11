import Popup from './Popup.js';

export default class PopupWithForm extends Popup {
  constructor(popupSelector, onSubmit) {
    super(popupSelector);

    this._form = document.querySelector(popupSelector).querySelector('.pop-up__form');

    this._onSubmit = onSubmit;
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
    // достаём все элементы полей
    this._inputList = this._form.querySelectorAll('.pop-up__input');

    // создаём пустой объект
    this._formValues = {};

    // добавляем в этот объект значения всех полей
    this._inputList.forEach(input => {
      this._formValues[input.name] = input.value;
    });

    // возвращаем объект значений
    return this._formValues;
  }
}
