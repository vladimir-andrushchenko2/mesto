export default class UserInfo {
  constructor(nameSelector, descriptionSelector, avatarSelector) {
    this._name = document.querySelector(nameSelector);
    this._description = document.querySelector(descriptionSelector);
    this._avatar = document.querySelector(avatarSelector);
  }

  getUserInfo() {
    return { name: this._name.textContent, description: this._description.textContent }
  }

  setUserInfo({ name, description, avatarLink }) {
    this._name.textContent = name || this._name.textContent;
    this._description.textContent = description || this._description.textContent;
    this._avatar.src = avatarLink || this._avatar.src;
  }
}
