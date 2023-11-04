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

// functions
const checkTokenOnServer = async (token: string, entity: string) => {
  let serverData: any;
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
  serverData = await response.json();
  if (response.status === 200) {
    return serverData;
  } else {
    console.log(serverData);
    return null;
  }
};

const checkToken = async (entity: string, redirect_url: string) => {
  const cookie = getCookie();
  switch (entity) {
    case 'student':
      if (!cookie.studentToken) {
        setCookie('studentToken', '', -1);
        redirect_url ? (window.location.href = redirect_url) : null;
        return false;
      } else {
        const res = await checkTokenOnServer(cookie.studentToken, entity);
        if (!res) {
          setCookie('studentToken', '', -1);
          setCookie('studentUserName', '', -1);
          redirect_url ? (window.location.href = redirect_url) : null;
          return false;
        } else {
          return true;
        }
      }
    case 'teacher':
      if (!cookie.teacherToken) {
        setCookie('teacherToken', '', -1);
        redirect_url ? (window.location.href = redirect_url) : null;
        return false;
      } else {
        const res = await checkTokenOnServer(cookie.teacherToken, entity);
        if (!res) {
          setCookie('teacherToken', '', -1);
          redirect_url ? (window.location.href = redirect_url) : null;
          return false;
        } else {
          return true;
        }
      }
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

// Interfaces
interface StudentData {
  id: number;
  nickname: string;
  userName: string;
  createdAt: Date;
  updatedAt: Date;
}
