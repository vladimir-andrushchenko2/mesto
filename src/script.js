const editButton = document.querySelector('.profile__modify-button');

const popUp = document.querySelector('.pop-up');
const popUpCloseBtn = document.querySelector('.pop-up__close-btn');

const form = document.querySelector('.edit-profile-form');

const inputTitle = document.querySelector('.edit-profile-form__input_type_title');
const inputSubtitle = document.querySelector('.edit-profile-form__input_type_subtitle');

const title = document.querySelector('.profile__title-text');
const subtitle = document.querySelector('.profile__subtitle');

function closeForm() {
  inputTitle.value = '';
  inputSubtitle.value = '';

  popUp.classList.remove('pop-up_opened');
}

editButton.addEventListener('click', () => {
  inputTitle.placeholder = document.querySelector('.profile__title').innerText;
  inputSubtitle.placeholder = document.querySelector('.profile__subtitle').innerText;

  popUp.classList.add('pop-up_opened');
});

popUpCloseBtn.addEventListener('click', closeForm);

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const newTitle = document.querySelector('.edit-profile-form__input_type_title');
  const newSubtitle = document.querySelector('.edit-profile-form__input_type_subtitle');

  if (newTitle.value != '') {
    title.innerText = newTitle.value;
  }

  if (newSubtitle.value != '') {
    subtitle.innerText = newSubtitle.value;
  }

  closeForm();
});