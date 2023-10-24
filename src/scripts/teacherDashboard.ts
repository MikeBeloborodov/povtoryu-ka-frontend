// selectors
const modalSource = document.querySelector('#modal') as HTMLTemplateElement;
const modalTemplate = modalSource.content;
const newStudentBtn = document.querySelector('#new-student-btn');

// functions
const createNewStudentModal = () => {
  const modalBackdrop = modalTemplate
    ?.querySelector('.modal__backdrop')
    ?.cloneNode(true) as HTMLElement;
  if (modalBackdrop) {
    // text
    const modalElement = modalBackdrop.querySelector('.modal');
    if (modalElement) {
      const text1 = document.createElement('p');
      text1.classList.add('modal__text');
      text1.textContent =
        'Чтобы пригласить ученика впишите в пустое место его имя (любое, оно нужно только для вас).';
      const text2 = document.createElement('p');
      text2.classList.add('modal__text');
      text2.textContent =
        'Далее нажмите кнопку и отправьте ученику сгенерированный код. При помощи этого кода, ученик сможет зарегистрироваться и отобразится у вас на панеле учеников.';

      // input
      const input = document.createElement('input');
      input.id = 'modal-input';
      input.classList.add('modal__input');
      input.type = 'text';

      // button
      const button = document.createElement('button');
      button.classList.add('modal__button');
      button.textContent = 'Сгеренировать код';
      // send data
      button.addEventListener('click', async () => {
        const nameElement = document.querySelector(
          '#modal-input'
        ) as HTMLInputElement;
        if (nameElement.value) {
          const cookie = getCookie();
          const data = {
            studentName: nameElement.value,
            teacherName: cookie.teacherUserName,
            token: cookie.teacherToken,
          };
          const payload = JSON.stringify(data);
          const res = await fetch(
            'http://localhost:8080/api/v1/user/token/new',
            {
              method: 'POST',
              body: payload,
              headers: { 'Content-Type': 'application/json' },
            }
          );
          const serverData = await res.json();
          if (res.status === 201) {
            input.value = serverData.code;
          } else {
            console.log('error, call admin');
            console.log(serverData);
          }
        }
      });
      modalElement.append(text1);
      modalElement.append(text2);
      modalElement.append(input);
      modalElement.append(button);
      modalBackdrop.append(modalElement);
      document.body.append(modalBackdrop);
    }
  }
};

// listeners
newStudentBtn?.addEventListener('click', () => {
  createNewStudentModal();
});

// invocations;
checkToken('teacher', teacherLoginPageURL);
