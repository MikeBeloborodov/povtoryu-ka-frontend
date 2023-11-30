// selectors
const registerStudentBtn = document.querySelector('#register-btn');

const validationConfigStudentReg: ValidationConfig = {
  formSelector: '.auth-container__form',
  inputSelector: '.auth-container__input',
  submitButtonSelector: '.auth-container__button',
  inactiveButtonClass: 'auth-container__button_disabled',
  inputErrorClass: 'auth-container__input_error',
};

popupCloseButton?.addEventListener('click', (evt) => {
  closePopup();
});

registerStudentBtn?.addEventListener('click', async (evt) => {
  toggleLoader();
  closePopup();
  await sleep(1000);

  const userName = document.querySelector('#user-name') as HTMLInputElement;
  const password = document.querySelector('#password') as HTMLInputElement;
  const specialCode = document.querySelector('#special') as HTMLInputElement;

  if (userName.value && password.value && specialCode.value) {
    const data = {
      userName: userName.value,
      password: password.value,
      specialCode: specialCode.value,
    };
    registerStudent(data)
      .then(async (res) => {
        openPopup('success', 'Вы успешно зарегистрировались!');
        await sleep(2000);
        window.location.href = baseURL;
      })
      .catch((error) => {
        handleError(error);
      })
      .finally(() => {
        toggleLoader();
      });
  }
});

enableValidation(validationConfigStudentReg);
