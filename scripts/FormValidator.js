export default class FormValidator {
  constructor(form, config) {
    this._form = form;
    this._config = config;
  }

  _hasInvalidInput(inputList) {
    return inputList.some(input => !input.validity.valid);
  }

  _setEventListeners() {
    this._inputList = Array.from(this._form.querySelectorAll(this._config.inputSelector));
    this._buttonElement = this._form.querySelector(this._config.submitButtonSelector);

    this._inputList.forEach((inputElement) => {
      inputElement.addEventListener('input', () => {
        this._checkInputValidity(inputElement);
        this.toggleButtonState();
      });
    });
  }

  toggleButtonState() {
    if (this._hasInvalidInput(this._inputList)) {
      this._buttonElement.classList.add(this._config.inactiveButtonClass);
      this._buttonElement.setAttribute('disabled', '');
    } else {
      this._buttonElement.classList.remove(this._config.inactiveButtonClass);
      this._buttonElement.removeAttribute('disabled');
    }
  }

  _showInputError(inputElement, errorMessage) {
    inputElement.classList.add(this._config.inputErrorClass);

    const errorElement = this._form.querySelector(`.${inputElement.id}-error`);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(this._config.errorClass);
  }

  _hideInputError(inputElement) {
    inputElement.classList.remove(this._config.inputErrorClass);

    const errorElement = this._form.querySelector(`.${inputElement.id}-error`);
    errorElement.textContent = '';
    errorElement.classList.remove(this._config.errorClass);
  }

  _checkInputValidity(inputElement) {
    if (!inputElement.validity.valid) {
      this._showInputError(inputElement, inputElement.validationMessage);
    } else {
      this._hideInputError(inputElement);
    }
  }

  resetError() {
    this._inputList.forEach(inputElement => this._hideInputError(inputElement));
  }

  enableValidation() {
    this._setEventListeners();
  }
}
