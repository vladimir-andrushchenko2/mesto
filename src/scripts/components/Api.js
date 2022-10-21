class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _makeRequest(path, method = 'GET', body) {
    return fetch(`${this._baseUrl}${path}`, {
      headers: this._headers,
      method,
      body: JSON.stringify(body)
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }

        return Promise.reject(res.status);
      })
      .catch(err => Promise.reject(`Ошибка при методе ${method} по URI ${this._baseUrl + path}\nС телом ${body}\n Caught: ${err}`));
  }

  getInitialCards() {
    return this._makeRequest('/cards');
  }

  getUserInfo() {
    return this._makeRequest('/users/me');
  }

  patchUserInfo(name, about) {
    return this._makeRequest('/users/me', 'PATCH', { name, about });
  }

  postCard(name, link) {
    return this._makeRequest('/cards', 'POST', { name, link });
  }

  deleteCard(cardId) {
    return this._makeRequest(`/cards/${cardId}`, 'DELETE');
  }

  putCardLike(cardId) {
    return this._makeRequest(`/cards/${cardId}/likes`, 'PUT');
  }

  deleteCardLike(cardId) {
    return this._makeRequest(`/cards/${cardId}/likes`, 'DELETE')
  }
}

export const api = new Api({
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-52',
  headers: {
    authorization: '701d7c23-a5ed-4bcd-aa15-7b4714e01efc',
    'Content-Type': 'application/json'
  }
});
