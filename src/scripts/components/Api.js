export default class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _makeRequest(path, method = 'GET', body) {
    const config = {
      headers: this._headers,
      method
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    return fetch(`${this._baseUrl}${path}`, config)
      .then(res => {
        if (res.ok) {
          return res.json();
        }

        return Promise.reject(res.status);
      })
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

  patchUserAvatar(avatarUrl) {
    return this._makeRequest(`/users/me/avatar`, 'PATCH', { avatar: avatarUrl });
  }
}
