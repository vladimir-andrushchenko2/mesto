const editButton = document.querySelector('.profile__modify-button');

const popUp = document.querySelector('.pop-up');
const popUpCloseBtn = document.querySelector('.pop-up__close-btn');

const saveBtn = document.querySelector('.edit-profile-form__save-button');

const editTitle = document.querySelector('.edit-profile-form__input_type_title');
const editSubtitle = document.querySelector('.edit-profile-form__input_type_subtitle');

const title = document.querySelector('.profile__title-text');
const subtitle = document.querySelector('.profile__subtitle');

function closeForm() {
    editTitle.value = '';
    editSubtitle.value = '';

    popUp.classList.add('hidden');
}

editButton.addEventListener('click', () => {
    editTitle.placeholder = document.querySelector('.profile__title').innerText;
    editSubtitle.placeholder = document.querySelector('.profile__subtitle').innerText;

    popUp.classList.remove('hidden');
});

popUpCloseBtn.addEventListener('click', closeForm);

saveBtn.addEventListener('click', () => {
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