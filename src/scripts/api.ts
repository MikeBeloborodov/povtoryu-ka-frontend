const getResponseData = (res: Response) => {
  if (res.status === 204) {
    return Promise.resolve(null);
  }
  return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
};

const getNewWordCard = async () => {
  const cookie = getCookie();
  return fetch(apiGetNewWordCard, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookie.studentToken}`,
    },
  }).then((res) => getResponseData(res));
};

const getNewSentenceCard = async () => {
  const cookie = getCookie();
  return fetch(apiGetNewSentenceCard, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookie.studentToken}`,
    },
  }).then((res) => getResponseData(res));
};

const getReviewWordCard = async () => {
  const cookie = getCookie();
  return fetch(apiGetReviewWordCard, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookie.studentToken}`,
    },
  }).then((res) => getResponseData(res));
};

const sendWordCardAnswer = async (answer: WordCardAnswer) => {
  const cookie = getCookie();
  return fetch(apiAnswerWordCard, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookie.studentToken}`,
    },
    body: JSON.stringify({
      cardId: answer.cardId,
      answer: answer.answer,
    }),
  }).then((res) => getResponseData(res));
};

const sendSentenceCardAnswer = async (answer: WordCardAnswer) => {
  const cookie = getCookie();
  return fetch(apiAnswerSentenceCard, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookie.studentToken}`,
    },
    body: JSON.stringify({
      cardId: answer.cardId,
      answer: answer.answer,
    }),
  }).then((res) => getResponseData(res));
};

const getCardsCount = async () => {
  const cookie = getCookie();
  return fetch(apiReturnCardsCount, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookie.studentToken}`,
    },
  }).then((res) => getResponseData(res));
};

const getCardAudio = async (path: string) => {
  const cookie = getCookie();
  return fetch(apiReturnCardAudio + `?path=${path}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookie.studentToken}`,
    },
  }).then((res) => res.blob());
};
