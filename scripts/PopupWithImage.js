import Popup from './Popup'

export class PopupWithImage extends Popup {
  constructor(popupSelector, popupImageSelector, popupCaptionSelector) {
    super(popupSelector);
    this._image = super._element.querySelector(popupImageSelector);
    this._caption = super._element.querySelector(popupCaptionSelector);
  }

  open(src, caption) {
    super.open();
    this._image.src = src;
    this._image.alt = caption;
    this._caption = caption;
  }
}
