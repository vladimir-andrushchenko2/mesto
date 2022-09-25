function makeFrontInserter(container) {
  return function (node) {
    container.prepend(node);
  }
}

function hidePopUp(popUp) {
  popUp.classList.remove('pop-up_opened');
}

function showPopUp(popUp) {
  popUp.classList.add('pop-up_opened');
}

function getSubmitButton(popUp) {
  return popUp.querySelector('.pop-up__save-button');
}

function getCloseButton(popUp) {
  return popUp.querySelector('.pop-up__close-btn');
}

function getForm(popUp) {
  return popUp.querySelector('.pop-up__form');
}

// ============================= pop-up open and close helper wrapper
function submitMiddleware(action, popUp) {
  return function (event) {
    event.preventDefault();

    action();

    hidePopUp(popUp);
  }
}

function setOpeningAndClosingOfPopUp(popUp, openButton, onOpen, onClose = () => { }) {
  function openPopUp() {
    onOpen();
    document.addEventListener('keydown', closeOnEsc);
    showPopUp(popUp);
  }

  function closePopUp() {
    onClose();
    document.removeEventListener('keydown', closeOnEsc);
    hidePopUp(popUp);
  }

  function closeOnEsc(event) {
    if (event.key === 'Escape') {
      closePopUp();
    }
  }

  getCloseButton(popUp).addEventListener('click', closePopUp);

  openButton.addEventListener('click', openPopUp);

  // close by clicking on off-white area
  popUp.addEventListener('mousedown', (event) => {
    if (event.target.classList.contains('pop-up')) {
      closePopUp();
    }
  })
}

export { getForm, makeFrontInserter, hidePopUp, showPopUp, submitMiddleware, setOpeningAndClosingOfPopUp };
