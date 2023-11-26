// selectors
const submitFormBtn = document.querySelector('#submit-form');

// functions
const renderCardTest = (serverData: WordCardData[]) => {
  const card = createWordCard(serverData[0]);
  if (trainerSection && card) {
    trainerSection.append(card);
  }
};

// event listeners
submitFormBtn?.addEventListener('click', async (evt) => {
  // prevent reload
  evt.preventDefault();

  const wordElement = document.querySelector('#word') as HTMLInputElement;
  const word = wordElement.value;

  const posElement = document.querySelector(
    'input[name="pos"]:checked'
  ) as HTMLInputElement;
  const pos = posElement.value;
  let posRU = '';
  switch (pos) {
    case 'noun':
      posRU = 'существительное';
      break;
    case 'verb':
      posRU = 'глагол';
      break;
    case 'adjective':
      posRU = 'прилагательное';
      break;
  }

  const teacherIdElement = document.querySelector(
    '#teacherId'
  ) as HTMLInputElement;
  const teacherId = teacherIdElement.value;

  const studentIdElement = document.querySelector(
    '#studentId'
  ) as HTMLInputElement;
  const studentId = studentIdElement.value;

  const categoryElement = document.querySelector(
    '#category'
  ) as HTMLInputElement;
  const category = categoryElement.value;

  const themeElement = document.querySelector('#theme') as HTMLInputElement;
  const theme = themeElement.value;

  const data = {
    words: [
      {
        word: word,
        partOfSpeech: pos,
        partOfSpeechRu: posRU,
        teacherId: parseInt(teacherId),
        studentId: parseInt(studentId),
        category: category,
        theme: theme,
      },
    ],
  };

  const payload = JSON.stringify(data);

  const res = await fetch('http://localhost:8080/api/v1/words', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
  });
  const serverData = await res.json();
  console.log(serverData);
  renderCardTest(serverData);
});
