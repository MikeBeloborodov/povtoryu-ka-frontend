// urls
const baseURL = 'http://localhost:3000/';
const studentLoginPageURL = baseURL;
const studentRegPageURL = baseURL + 'pages/studentRegistration.html';
const studentDashboardURL = baseURL + 'pages/studentDashboard.html';
const teacherLoginPageURL = baseURL + 'pages/teacherLogin.html';
const teacherRegPageURL = baseURL + 'pages/teacherRegistration.html';
const teacherDashboardURL = baseURL + 'pages/teacherDashboard.html';
const apiBaseURL = 'http://localhost:8080/api/v1/';
const apiCheckTeacherTokenURL = apiBaseURL + 'teacher/token';
const apiCheckStudentTokenURL = apiBaseURL + 'student/token';
const apiStudentNewCodeURL = apiBaseURL + 'student/code/new';
const apiTeacherRegisterURL = apiBaseURL + 'teacher/register';
const apiStudentRegisterURL = apiBaseURL + 'student/register';
const apiStudentLoginURL = apiBaseURL + 'student/login';
const apiTeacherLoginURL = apiBaseURL + 'teacher/login';
const apiGetStudentsURL = apiBaseURL + 'students';
const apiSaveWordCard = apiBaseURL + 'cards/word/new';
const apiSaveSentenceCard = apiBaseURL + 'cards/sentence/new';
const apiGetStudentOwnData = apiBaseURL + 'student/own';
const apiGetNewWordCard = apiBaseURL + 'cards/word/study/new';
const apiGetNewSentenceCard = apiBaseURL + 'cards/sentence/study/new';
const apiGetReviewWordCard = apiBaseURL + 'cards/word/study/review';
const apiGetReviewSentenceCard = apiBaseURL + 'cards/sentence/study/review';
const apiAnswerWordCard = apiBaseURL + 'cards/word/study/answer';
const apiAnswerSentenceCard = apiBaseURL + 'cards/sentence/study/answer';
const apiReturnCardsCount = apiBaseURL + 'student/cardsCount';
const apiReturnCardAudio = apiBaseURL + 'cards/audio';

// selectors
const messageSource: HTMLTemplateElement | null =
  document.querySelector('#message-container');
const messageTemplate = messageSource?.content;
const popupCloseButton = document.querySelector('.popup__close');

// functions
const renderMessageContainer = (
  message: string,
  buttonText: string,
  buttonCallback: Function
) => {
  const messageElement = messageTemplate
    ?.querySelector('.message-container')
    ?.cloneNode(true) as HTMLElement;

  if (messageElement) {
    const messageText = messageElement.querySelector(
      '.message-container__text'
    );
    const messageButton = messageElement.querySelector(
      '.message-container__button'
    );

    messageText ? (messageText.textContent = message) : null;
    messageButton ? (messageButton.textContent = buttonText) : null;

    messageButton?.addEventListener('click', () => {
      buttonCallback();
    });

    document.body.append(messageElement);
  }
};

const returnStudentData = async () => {
  const cookie = getCookie();
  let res;
  try {
    res = await fetch(apiGetStudentOwnData, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookie.studentToken}`,
      },
    });
    if (res.status !== 200) {
      throw new Error('Problems with the server.');
    }
  } catch (error) {
    console.log(error);
    throw new Error('Problems with the server.');
  }
  const serverData = await res.json();
  return serverData;
};

const checkTokenOnServer = async (token: string, entity: string) => {
  let response: any;
  switch (entity) {
    case 'student':
      response = await fetch(apiCheckStudentTokenURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      break;
    case 'teacher':
      response = await fetch(apiCheckTeacherTokenURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      break;
  }
  if (!response.ok) {
    return Promise.reject(`Error: ${response.status}`);
  }
  return response.json();
};

const checkToken = async (entity: string, redirect_url: string) => {
  const cookie = getCookie();
  switch (entity) {
    case 'student':
      if (!cookie.studentToken) {
        setCookie('studentToken', '', -1);
        redirect_url ? (window.location.href = redirect_url) : null;
        return Promise.reject('No token in cookies.');
      }
      return checkTokenOnServer(cookie.studentToken, entity)
        .then(() => {
          return Promise.resolve();
        })
        .catch((err) => {
          console.log(err);
          setCookie('studentToken', '', -1);
          redirect_url ? (window.location.href = redirect_url) : null;
          return Promise.reject('No such token on server.');
        });
    case 'teacher':
      if (!cookie.teacherToken) {
        setCookie('teacherToken', '', -1);
        redirect_url ? (window.location.href = redirect_url) : null;
        return Promise.reject('No token in cookies.');
      }
      return checkTokenOnServer(cookie.teacherToken, entity)
        .then(() => {
          return Promise.resolve();
        })
        .catch((err) => {
          console.log(err);
          setCookie('studentToken', '', -1);
          setCookie('studentUserName', '', -1);
          redirect_url ? (window.location.href = redirect_url) : null;
          return Promise.reject('No such token on server.');
        });
  }
};

const getCookie = () => {
  let cookie: any = {};
  document.cookie.split(';').forEach((el: string) => {
    let [key, value] = el.split('=');
    cookie[key.trim()] = value;
  });
  return cookie;
};

const setCookie = (key: string, value: string, expiresDays: number) => {
  let date = new Date();
  date.setTime(date.getTime() + expiresDays * 24 * 60 * 60 * 1000);
  document.cookie = `${key}=${value}; expires=${date.toUTCString()}`;
};

const createRightClickMenu = (
  items: (string | Function)[],
  studentId: number
) => {
  const menuBox = document.createElement('ul');
  menuBox.classList.add('right-click-list');

  for (let i = 1; i < items.length + 1; i++) {
    if (i % 2 !== 0) {
      const menuItem = document.createElement('li');
      const menuItemContainer = document.createElement('div');
      menuItemContainer.classList.add('right-click-item-container');
      menuItem.classList.add('right-click-item');
      menuItem.textContent = items[i - 1] as string;
      const handler = items[i] as Function;
      menuItem.addEventListener('click', () => {
        handler(studentId);
      });
      menuItemContainer.append(menuItem);
      menuBox.append(menuItemContainer);
    } else {
      continue;
    }
  }
  return menuBox;
};

const toggleLoader = () => {
  const loader = document.querySelector('.loader');
  loader?.classList.toggle('loader_invisible');
};

const toggleContentVisibility = (
  contentSelector: string,
  contentInvisibleClass: string
) => {
  const content = document.querySelector(contentSelector);
  content?.classList.toggle(contentInvisibleClass);
};

const handleAudio = (
  isRecordingElement: HTMLSpanElement,
  audioElement: HTMLAudioElement,
  stopRecordingElement: HTMLButtonElement
) => {
  let audioChunks: any[] = [];
  let rec: any;

  isRecordingElement.textContent = 'Идёт запись...';

  window.navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    rec = new MediaRecorder(stream);
    rec.start();
    rec.ondataavailable = (e: any) => {
      audioChunks.push(e.data);
      if (rec.state == 'inactive') {
        let blob = new Blob(audioChunks, { type: 'audio/mp3' });
        audioElement.src = URL.createObjectURL(blob);
      }
    };
  });

  stopRecordingElement.addEventListener('click', (evt) => {
    evt.preventDefault();
    rec.stop();
    isRecordingElement.textContent = 'Нажмите кнопку, чтобы прослушать';
  });
};

const openPopup = (status: string, message: string) => {
  const popup = document.querySelector('.popup');
  const popupMessage = popup?.querySelector('.popup__message');
  if (popup && popupMessage) {
    popup.classList.add(`popup_${status}`);
    popupMessage.textContent = message;
    popup.classList.add('popup_visible');
  }
};

const closePopup = () => {
  const popup = document.querySelector('.popup');
  if (popup) {
    popup.classList.remove('popup_visible');
    popup.classList.remove('popup_success');
    popup.classList.remove('popup_error');
  }
};

const sleep = async (ms: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
};

const handleError = (error: number) => {
  switch (error) {
    case 400:
      openPopup('error', 'Ошибка в формате данных, попробуйте еще раз.');
      break;
    case 403:
      openPopup('error', 'Введенный пароль или код не верны.');
      break;
    case 404:
      openPopup('error', 'Такой пользователь не зарегистрирован.');
      break;
    case 409:
      openPopup('error', 'Такой пользователь уже зарегистрирован.');
      break;
    case 500:
      openPopup('error', 'Ошибка сервера. Обратитесь к админу.');
      break;
    default:
      openPopup('error', `Ошибка ${error}, обратитесь к админу.`);
      break;
  }
};

// Interfaces
interface StudentData {
  student: Student;
  cardsCount: CardsCountData;
}

interface Student {
  id: number;
  nickname: string;
  userName: string;
  createdAt: Date;
  updatedAt: Date;
  newCards: number;
  reviewCards: number;
  allCards: number;
}

interface newWordCardForm extends HTMLFormControlsCollection {
  word: HTMLInputElement;
  pos: RadioNodeList;
  image: HTMLInputElement;
  sentence: HTMLTextAreaElement;
  definition: HTMLTextAreaElement;
  translation: HTMLInputElement;
}

interface newSentenceCardForm extends HTMLFormControlsCollection {
  sentence: HTMLTextAreaElement;
  word: HTMLInputElement;
  answer: HTMLInputElement;
  pos: HTMLSelectElement;
  translation: HTMLTextAreaElement;
  definition: HTMLTextAreaElement;
  image: HTMLInputElement;
  audio: HTMLAudioElement;
}

interface answerForm extends HTMLFormControlsCollection {
  answer: HTMLInputElement;
}

interface studentOwnData {
  id: number;
  newCards: number;
  reviewCards: number;
  allCards: number;
  role: string;
  userName: string;
}

interface CardsCountData {
  cardsAll: number;
  cardsNew: number;
  cardsToReview: number;
}

interface WordCardData {
  definition: string;
  id: number;
  images: ImageObject[];
  sentences: SentenceObject[];
  newCard: boolean;
  partOfSpeech: string;
  partOfSpeechRu: string;
  studentId: number;
  teacherId: number;
  translations: TranslationObject[];
  word: string;
  audio: string;
}

interface SentenceCardData {
  id: number;
  sentence: string;
  word: string;
  answer: string;
  definition: string;
  image: string;
  newCard: boolean;
  pos: string;
  sentenceTranslation: string;
  studentId: number;
  teacherId: number;
  audio: string;
}

interface ImageObject {
  id: number;
  url: string;
}

interface SentenceObject {
  id: number;
  sentence: string;
}

interface TranslationObject {
  id: number;
  translation: string;
}

interface WordCardAnswer {
  cardId: number;
  answer: string;
}

interface ValidationConfig {
  formSelector: string;
  inputSelector: string;
  submitButtonSelector: string;
  inactiveButtonClass: string;
  inputErrorClass: string;
}

interface TeacherRegistrationData {
  userName: string;
  password: string;
  specialCode: string;
}

interface TeacherLoginData {
  userName: string;
  password: string;
}

interface StudentRegistrationData {
  userName: string;
  password: string;
  specialCode: string;
}

interface StudentLoginData {
  userName: string;
  password: string;
}
