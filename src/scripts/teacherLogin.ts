// selectors
const loginBtn = document.querySelector('#login-btn');
const regBtn = document.querySelector('#register-btn');

const validationConfigTeacherLogin: ValidationConfig = {
  formSelector: '.auth-container__form',
  inputSelector: '.auth-container__input',
  submitButtonSelector: '#login-btn',
  inactiveButtonClass: 'auth-container__button_disabled',
  inputErrorClass: 'auth-container__input_error',
};

popupCloseButton?.addEventListener('click', (evt) => {
  closePopup();
});

regBtn?.addEventListener('click', (evt) => {
  evt.preventDefault();
  window.location.href = teacherRegPageURL;
});

loginBtn?.addEventListener('click', async (evt) => {
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

    loginTeacher(data)
      .then(async (res) => {
        openPopup('success', 'Вход успешен.');
        await sleep(2000);
        setCookie('teacherToken', res.token, 365);
        window.location.href = teacherDashboardURL;
      })
      .catch((error) => {
        handleError(error);
        setCookie('teacherToken', '', -1);
      })
      .finally(() => {
        toggleLoader();
      });
  }
});

enableValidation(validationConfigTeacherLogin);
