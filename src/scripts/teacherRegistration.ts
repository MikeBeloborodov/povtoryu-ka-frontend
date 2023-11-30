// selectors
const registerBtn = document.querySelector(
  '#register-btn'
) as HTMLButtonElement;

const validationConfigTeacherReg: ValidationConfig = {
  formSelector: '.auth-container__form',
  inputSelector: '.auth-container__input',
  submitButtonSelector: '.auth-container__button',
  inactiveButtonClass: 'auth-container__button_disabled',
  inputErrorClass: 'auth-container__input_error',
};

popupCloseButton?.addEventListener('click', (evt) => {
  closePopup();
});

registerBtn?.addEventListener('click', async (evt) => {
  toggleLoader();
  closePopup();
  await sleep(1000);
  const userName = document.querySelector('#user-name') as HTMLInputElement;
  const password = document.querySelector('#password') as HTMLInputElement;
  const specialCode = document.querySelector('#special') as HTMLInputElement;

  const data = {
    userName: userName.value,
    password: password.value,
    specialCode: specialCode.value,
  };
  registerTeacher(data)
    .then(async (res) => {
      openPopup('success', 'Вы успешно зарегистрировались!');
      await sleep(2000);
      window.location.href = teacherLoginPageURL;
    })
    .catch((error) => {
      handleError(error);
    })
    .finally(() => toggleLoader());
});

enableValidation(validationConfigTeacherReg);
