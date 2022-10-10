import Popup from './Popup.js';

export default class PopupWithImage extends Popup {
  constructor(popupSelector, popupImageSelector, popupCaptionSelector) {
    super(popupSelector);
    this._image = this._element.querySelector(popupImageSelector);
    this._caption = this._element.querySelector(popupCaptionSelector);
  }

  open(src, caption) {
    super.open();
    this._image.src = src;
    this._image.alt = caption;
    this._caption = caption;
  }
}
