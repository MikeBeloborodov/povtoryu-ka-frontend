// selectors
const loginUserBtn = document.querySelector('#login-btn');
const regUserBtn = document.querySelector('#register-btn');

const validationConfigStudentLogin: ValidationConfig = {
  formSelector: '.auth-container__form',
  inputSelector: '.auth-container__input',
  submitButtonSelector: '#login-btn',
  inactiveButtonClass: 'auth-container__button_disabled',
  inputErrorClass: 'auth-container__input_error',
};

// event listeners
popupCloseButton?.addEventListener('click', (evt) => {
  closePopup();
});

regUserBtn?.addEventListener('click', (evt) => {
  evt.preventDefault();
  window.location.href = studentRegPageURL;
});

loginUserBtn?.addEventListener('click', async (evt) => {
  toggleLoader();
  closePopup();
  await sleep(1000);

  const userNameElement = document.querySelector(
    '#user-name'
  ) as HTMLInputElement;
  const passwordElement = document.querySelector(
    '#password'
  ) as HTMLInputElement;

  if (userNameElement.value && passwordElement.value) {
    const data = {
      userName: userNameElement.value,
      password: passwordElement.value,
    };

    loginStudent(data)
      .then(async (res) => {
        openPopup('success', 'Вход успешен.');
        await sleep(2000);
        setCookie('studentToken', res.token, 365);
        window.location.href = studentDashboardURL;
      })
      .catch((error) => {
        handleError(error);
        setCookie('studentToken', '', -1);
      })
      .finally(() => {
        toggleLoader();
      });
  }
});

// function calls
checkToken('student', '')
  .then(() => {
    window.location.href = studentDashboardURL;
  })
  .catch((err) => {
    console.log(err);
  });

enableValidation(validationConfigStudentLogin);
