class UserInfo {
  constructor(name, description) {
    this._name = name;
    this.description = description;
  }

  getUserInfo() {
    return { name: this._name, description: this._description }
  }

  setUserInfo({ name, description }) {
    this._name = name || this._name;
    this._description = description || this._description;
  }
}
