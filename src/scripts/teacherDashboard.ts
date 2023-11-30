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
          };
          const payload = JSON.stringify(data);
          const res = await fetch(apiStudentNewCodeURL, {
            body: payload,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${cookie.teacherToken}`,
            },
          });
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
  let serverData;
  const res = await fetch(apiGetStudentsURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookie.teacherToken}`,
    },
  });
  if (res.status === 404) {
    return null;
  } else if (res.status === 200) {
    serverData = await res.json();
    return serverData;
  } else {
    throw new Error('Something wrong with the API.');
  }
};

const fillStudentsTable = async () => {
  let studentsData;
  try {
    studentsData = await getStudentsData();
  } catch (error) {
    throw error;
  }
  if (!studentsData) return;
  studentsData.forEach((item: StudentData) => {
    const studentElement = studentTemplate
      .querySelector('.students__item')
      ?.cloneNode(true) as HTMLLIElement;
    if (studentElement) {
      // render student element
      const nameElement = studentElement.querySelector(
        '.students__item-name'
      ) as HTMLParagraphElement;
      const newCardsSpan = studentElement.querySelector(
        '.students__item-stats-new-cards'
      ) as HTMLSpanElement;
      const reviewCardsSpan = studentElement.querySelector(
        '.students__item-stats-review-cards'
      );
      const allCardsSpan = studentElement.querySelector(
        '.sutdents__item-stats-all-cards'
      );
      newCardsSpan
        ? (newCardsSpan.textContent = item.cardsCount.cardsNew.toString())
        : null;
      reviewCardsSpan
        ? (reviewCardsSpan.textContent =
            item.cardsCount.cardsToReview.toString())
        : null;
      allCardsSpan
        ? (allCardsSpan.textContent = item.cardsCount.cardsAll.toString())
        : null;
      nameElement.textContent = item.student.nickname;
      studentElement.id = item.student.id.toString();

      // add menu
      const studentElementContainer = studentElement.querySelector(
        '.students__item-container'
      ) as HTMLDivElement;
      if (studentElementContainer) {
        studentElementContainer.addEventListener('contextmenu', (evt) => {
          evt.preventDefault();
          const handler = () => {
            console.log('click!');
          };
          const menu = createRightClickMenu(
            [
              'Создать карточку слова',
              newWordCardModal,
              'Создать карточку предложения',
              newSentenceCardModal,
              'Посмотреть карточки',
              handler,
              'Статистика',
              handler,
              'Удалить ученика',
              handler,
            ],
            item.student.id
          );
          studentElement.append(menu);

          // modal to close menu
          const closeModal = document.createElement('div');
          closeModal.classList.add('close-right-click-menu-modal');
          closeModal.addEventListener('click', () => {
            menu.remove();
            closeModal.remove();
          });

          // offset menu if too close to body borders
          if (document.body.offsetWidth - (evt.pageX + menu.offsetWidth) < 0) {
            menu.style.insetInlineStart = `${
              document.body.offsetWidth - menu.offsetWidth
            }px`;
          } else {
            menu.style.insetInlineStart = `${evt.pageX}px`;
          }
          menu.style.insetBlockStart = `${evt.pageY}px`;
          document.body.append(closeModal);
        });
      }

      // append student item
      studentsList.append(studentElement);
    }
  });
};

const newWordCardModal = (studentId: number) => {
  // close menu
  const closeModal = document.querySelector('.close-right-click-menu-modal');
  const menu = document.querySelector('.right-click-list');
  if (closeModal && menu) {
    closeModal.remove();
    menu.remove();
  }

  // modal container logic
  const modalContainer = modalTemplate
    ?.querySelector('.modal__container')
    ?.cloneNode(true) as HTMLElement;
  const modal = modalContainer.querySelector('.modal');

  if (modalContainer && modal) {
    // elements
    const newCardForm = document.createElement('form');
    const inputWord = document.createElement('input');
    const labelWord = document.createElement('label');
    const posFieldset = document.createElement('fieldset');
    const posLegend = document.createElement('legend');
    const posInputNoun = document.createElement('input');
    const posLabelNoun = document.createElement('label');
    const posInputVerb = document.createElement('input');
    const posLabelVerb = document.createElement('label');
    const posInputAdjective = document.createElement('input');
    const posLabelAdjective = document.createElement('label');
    const inputSentence = document.createElement('textarea');
    const labelSentence = document.createElement('label');
    const inputTranslation = document.createElement('input');
    const labelTranslation = document.createElement('label');
    const inputImage = document.createElement('input');
    const labelImage = document.createElement('label');
    const inputDefinition = document.createElement('textarea');
    const labelDefinition = document.createElement('label');
    const sendButton = document.createElement('button');

    // word
    inputWord.type = 'text';
    inputWord.name = 'word';
    inputWord.id = 'word';
    labelWord.htmlFor = 'word';
    labelWord.textContent = 'Слово';

    // part of speech
    posLegend.textContent = 'Часть речи:';
    posInputNoun.type = 'radio';
    posInputNoun.id = 'noun';
    posInputNoun.name = 'pos';
    posInputNoun.value = 'noun';
    posInputVerb.type = 'radio';
    posInputVerb.id = 'verb';
    posInputVerb.name = 'pos';
    posInputVerb.value = 'verb';
    posInputAdjective.type = 'radio';
    posInputAdjective.id = 'adjective';
    posInputAdjective.name = 'pos';
    posInputAdjective.value = 'adjective';
    posLabelNoun.textContent = 'Noun';
    posLabelVerb.textContent = 'Verb';
    posLabelAdjective.textContent = 'Adjective';
    posFieldset.append(posLegend);
    posFieldset.append(posInputNoun);
    posFieldset.append(posLabelNoun);
    posFieldset.append(posInputVerb);
    posFieldset.append(posLabelVerb);
    posFieldset.append(posInputAdjective);
    posFieldset.append(posLabelAdjective);

    // sentence
    inputSentence.name = 'sentence';
    inputSentence.id = 'sentence';
    inputSentence.rows = 5;
    inputSentence.cols = 33;
    labelSentence.htmlFor = 'sentence';
    labelSentence.textContent = 'Пример предложения:';

    // translation
    inputTranslation.type = 'text';
    inputTranslation.id = 'translation';
    inputTranslation.name = 'translation';
    labelTranslation.htmlFor = 'translation';
    labelTranslation.textContent = 'Перевод:';

    // definition
    inputDefinition.name = 'definition';
    inputDefinition.id = 'definition';
    inputDefinition.rows = 5;
    inputDefinition.cols = 33;
    labelDefinition.htmlFor = 'definition';
    labelDefinition.textContent = 'Определение:';

    // image
    inputImage.type = 'text';
    inputImage.id = 'image';
    inputImage.name = 'image';
    labelImage.htmlFor = 'image';
    labelImage.textContent = 'Ссылка на картинку: ';

    // submit button
    sendButton.textContent = 'Отправить';
    sendButton.addEventListener('click', async (evt) => {
      evt.preventDefault();
      try {
        await sendNewCard(studentId);
        location.reload();
      } catch (error) {
        alert(error);
      }
    });

    // form construction
    newCardForm.name = 'newCardForm';
    newCardForm.append(labelWord);
    newCardForm.append(inputWord);
    newCardForm.append(posFieldset);
    newCardForm.append(labelSentence);
    newCardForm.append(inputSentence);
    newCardForm.append(labelTranslation);
    newCardForm.append(inputTranslation);
    newCardForm.append(labelDefinition);
    newCardForm.append(inputDefinition);
    newCardForm.append(labelImage);
    newCardForm.append(inputImage);
    newCardForm.append(sendButton);

    // modal removal
    const modalBackdrop = modalContainer.querySelector('.modal__backdrop');
    modalBackdrop?.addEventListener('click', () => {
      modalContainer.remove();
    });

    // append
    modal.append(newCardForm);
    document.body.append(modalContainer);
  }
};

const newSentenceCardModal = (studentId: number) => {
  // close menu
  const closeModal = document.querySelector('.close-right-click-menu-modal');
  const menu = document.querySelector('.right-click-list');
  if (closeModal && menu) {
    closeModal.remove();
    menu.remove();
  }

  // modal container logic
  const modalContainer = modalTemplate
    ?.querySelector('.modal__container')
    ?.cloneNode(true) as HTMLElement;
  const modal = modalContainer.querySelector('.modal');

  if (modalContainer && modal) {
    // elements
    const newCardForm = document.createElement('form');
    const inputSentence = document.createElement('textarea');
    const labelSentence = document.createElement('label');
    const inputWord = document.createElement('input');
    const labelWord = document.createElement('label');
    const inputAnswer = document.createElement('input');
    const labelAnswer = document.createElement('label');
    const inputTranslation = document.createElement('textarea');
    const labelTranslation = document.createElement('label');
    const inputImage = document.createElement('input');
    const labelImage = document.createElement('label');
    const inputDefinition = document.createElement('textarea');
    const labelDefinition = document.createElement('label');
    const selectPos = document.createElement('select');
    const selectPosLabel = document.createElement('label');
    const nounOption = document.createElement('option');
    const verbOption = document.createElement('option');
    const adjectiveOption = document.createElement('option');
    const adverbOption = document.createElement('option');
    const pronounOption = document.createElement('option');
    const prepositionOption = document.createElement('option');
    const conjunctionOption = document.createElement('option');
    const interjectionOption = document.createElement('option');
    const audioBox = document.createElement('div');
    const startRecordingButton = document.createElement('button');
    const stopRecordingButton = document.createElement('button');
    const audio = document.createElement('audio');
    const isRecordingSpan = document.createElement('span');
    const sendButton = document.createElement('button');

    // sentence
    inputSentence.name = 'sentence';
    inputSentence.id = 'sentence';
    inputSentence.rows = 5;
    inputSentence.cols = 33;
    labelSentence.htmlFor = 'sentence';
    labelSentence.textContent = 'Введите предложение:';

    // word
    inputWord.type = 'text';
    inputWord.name = 'word';
    inputWord.id = 'word';
    labelWord.htmlFor = 'word';
    labelWord.textContent = 'Ключевое слово: ';

    // answer
    inputAnswer.type = 'text';
    inputAnswer.name = 'answer';
    inputAnswer.id = 'answer';
    labelAnswer.htmlFor = 'answer';
    labelAnswer.textContent = 'Правильный ответ: ';

    // translation
    inputTranslation.name = 'translation';
    inputTranslation.id = 'translation';
    inputTranslation.rows = 5;
    inputTranslation.cols = 33;
    labelTranslation.htmlFor = 'translation';
    labelTranslation.textContent = 'Перевод предложения: ';

    // definition
    inputDefinition.name = 'definition';
    inputDefinition.id = 'definition';
    inputDefinition.rows = 5;
    inputDefinition.cols = 33;
    labelDefinition.htmlFor = 'definition';
    labelDefinition.textContent = 'Определение:';

    // pos
    selectPos.name = 'pos';
    selectPos.id = 'pos';
    selectPosLabel.htmlFor = 'pos';
    selectPosLabel.textContent = 'Часть речи:';
    nounOption.value = 'Существительное';
    nounOption.textContent = 'Существительное';
    verbOption.value = 'Глагол';
    verbOption.textContent = 'Глагол';
    adjectiveOption.value = 'Прилагательное';
    adjectiveOption.textContent = 'Прилагательное';
    adverbOption.value = 'Наречие';
    adverbOption.textContent = 'Наречие';
    pronounOption.value = 'Местоимение';
    pronounOption.textContent = 'Местоимение';
    prepositionOption.value = 'Предлог';
    prepositionOption.textContent = 'Предлог';
    conjunctionOption.value = 'Союз';
    conjunctionOption.textContent = 'Союз';
    interjectionOption.value = 'Междометие';
    interjectionOption.textContent = 'Междометие';
    selectPos.append(nounOption);
    selectPos.append(verbOption);
    selectPos.append(adjectiveOption);
    selectPos.append(adverbOption);
    selectPos.append(pronounOption);
    selectPos.append(prepositionOption);
    selectPos.append(conjunctionOption);
    selectPos.append(interjectionOption);

    // image
    inputImage.type = 'text';
    inputImage.id = 'image';
    inputImage.name = 'image';
    labelImage.htmlFor = 'image';
    labelImage.textContent = 'Ссылка на картинку: ';

    // audio
    startRecordingButton.textContent = 'Запись';
    stopRecordingButton.textContent = 'Стоп';
    audio.controls = true;
    audio.id = 'audio';
    isRecordingSpan.textContent = "Нажмите 'Запись', чтобы записать аудио.";
    startRecordingButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      handleAudio(isRecordingSpan, audio, stopRecordingButton);
    });
    audioBox.append(startRecordingButton);
    audioBox.append(stopRecordingButton);
    audioBox.append(isRecordingSpan);
    audioBox.append(audio);

    // submit button
    sendButton.textContent = 'Отправить';
    sendButton.addEventListener('click', async (evt) => {
      evt.preventDefault();
      try {
        await sendNewSentenceCard(studentId);
        location.reload();
      } catch (error) {
        alert(error);
      }
    });

    // form construction
    newCardForm.name = 'newSentenceCardForm';
    newCardForm.append(labelSentence);
    newCardForm.append(inputSentence);
    newCardForm.append(labelWord);
    newCardForm.append(inputWord);
    newCardForm.append(selectPosLabel);
    newCardForm.append(selectPos);
    newCardForm.append(labelAnswer);
    newCardForm.append(inputAnswer);
    newCardForm.append(labelTranslation);
    newCardForm.append(inputTranslation);
    newCardForm.append(labelDefinition);
    newCardForm.append(inputDefinition);
    newCardForm.append(labelImage);
    newCardForm.append(inputImage);
    newCardForm.append(audioBox);
    newCardForm.append(sendButton);

    // modal removal
    const modalBackdrop = modalContainer.querySelector('.modal__backdrop');
    modalBackdrop?.addEventListener('click', () => {
      modalContainer.remove();
    });

    // append
    modal.append(newCardForm);
    document.body.append(modalContainer);
  }
};

const sendNewCard = async (studentId: number) => {
  const cardForm = document.forms.namedItem('newCardForm');
  const elements = cardForm?.elements as newWordCardForm;
  const data = {
    word: elements.word.value,
    partOfSpeech: elements.pos.value,
    definition: elements.definition.value,
    images: [elements.image.value],
    sentences: [elements.sentence.value],
    translations: [elements.translation.value],
    studentId: studentId,
  };

  // check for empty values
  let key: keyof typeof data;
  for (key in data) {
    if (!data[key]) {
      throw new Error('Заполните пустые поля.');
    }
  }

  const payload = JSON.stringify(data);
  const cookie = getCookie();
  try {
    const res = await fetch(apiSaveWordCard, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookie.teacherToken}`,
      },
      body: payload,
    });
    const jsonRes = await res.json();
    console.log(jsonRes);
  } catch (error) {
    console.log(error);
    throw new Error('Ошибка сервера.');
  }
};

const sendNewSentenceCard = async (studentId: number) => {
  const cardForm = document.forms.namedItem('newSentenceCardForm');
  const elements = cardForm?.elements as newSentenceCardForm;
  const audio = document.querySelector('#audio') as HTMLAudioElement;
  const audioBlob = await fetch(audio.src).then((res) => res.blob());
  const formData = new FormData();
  formData.append('sentence', elements.sentence.value);
  formData.append('word', elements.word.value);
  formData.append('answer', elements.answer.value);
  formData.append('sentenceTranslation', elements.translation.value);
  formData.append('pos', elements.pos.value);
  formData.append('definition', elements.definition.value);
  formData.append('image', elements.image.value);
  formData.append('audio', audioBlob);
  formData.append('studentId', studentId.toString());

  const cookie = getCookie();
  try {
    const res = await fetch(apiSaveSentenceCard, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cookie.teacherToken}`,
      },
      body: formData,
    });
    const jsonRes = await res.json();
    console.log(jsonRes);
  } catch (error) {
    console.log(error);
    throw new Error('Ошибка сервера.');
  }
};

// listeners
newStudentBtn?.addEventListener('click', () => {
  createNewStudentModal();
});

// function calls
checkToken('teacher', teacherLoginPageURL)
  .then(async () => {
    toggleLoader();
    fillStudentsTable().finally(() => {
      toggleLoader();
      toggleContentVisibility(
        '.teacher-dashboard',
        'teacher-dashboard_invisible'
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });
