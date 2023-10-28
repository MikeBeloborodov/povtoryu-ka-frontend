// selectors
const modalSource = document.querySelector('#modal') as HTMLTemplateElement;
const modalTemplate = modalSource.content;
const newStudentBtn = document.querySelector('#new-student-btn');
const studentsSource = document.querySelector(
  '#student'
) as HTMLTemplateElement;
const studentTemplate = studentsSource.content;
const studentsList = document.querySelector(
  '#students-list'
) as HTMLUListElement;

// functions
const createNewStudentModal = () => {
  const modalContainer = modalTemplate
    ?.querySelector('.modal__container')
    ?.cloneNode(true) as HTMLElement;
  if (modalContainer) {
    // text
    const modalElement = modalContainer.querySelector('.modal');
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

      // modal removal
      const modalBackdrop = modalContainer.querySelector('.modal__backdrop');
      modalBackdrop?.addEventListener('click', () => {
        modalContainer.remove();
      });

      modalElement.append(text1);
      modalElement.append(text2);
      modalElement.append(input);
      modalElement.append(button);
      modalContainer.append(modalElement);
      document.body.append(modalContainer);
    }
  }
};

const getStudentsData = async () => {
  const cookie = getCookie();
  const data = {
    teacherName: cookie.teacherUserName,
    token: cookie.teacherToken,
  };
  const payload = JSON.stringify(data);
  const res = await fetch(apiBaseURL + 'users/', {
    method: 'POST',
    body: payload,
    headers: { 'Content-Type': 'application/json' },
  });
  const serverData = await res.json();
  if (res.status !== 200) {
    console.log('Error, call admin');
    console.log(serverData);
    return null;
  } else {
    return serverData;
  }
};

const fillStudentsTable = async () => {
  const studentsData = await getStudentsData();
  console.log(studentsData);
  studentsData.forEach((student: StudentData) => {
    const studentElement = studentTemplate
      .querySelector('.students__item')
      ?.cloneNode(true) as HTMLLIElement;
    if (studentElement) {
      const nameElement = studentElement.querySelector(
        '.students__item-name'
      ) as HTMLParagraphElement;
      nameElement.innerText = student.nickname;
      studentElement.id = student.id.toString();
      studentsList.append(studentElement);
    }
  });
};

// listeners
newStudentBtn?.addEventListener('click', () => {
  createNewStudentModal();
});

// invocations;
(async () => {
  if (await checkToken('teacher', teacherLoginPageURL)) {
    await fillStudentsTable();
  }
})();
