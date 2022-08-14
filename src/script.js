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

function openPopUp() {
  inputTitle.value = title.textContent;
  inputSubtitle.value = subtitle.textContent;

  popUp.classList.add('pop-up_opened');
}

function formSubmitHandler(event) {
  event.preventDefault();


  if (newTitle.value != '') {
    title.textContent = inputTitle.value;
  }

  if (newSubtitle.value != '') {
    subtitle.textContent = inputSubtitle.value;
  }

  closeForm();
}

editButton.addEventListener('click', openPopUp);

popUpCloseBtn.addEventListener('click', closeForm);

form.addEventListener('submit', formSubmitHandler);