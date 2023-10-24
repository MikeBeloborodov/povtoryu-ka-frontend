// urls
const baseURL = 'http://localhost:3000/';
const userLoginPageURL = baseURL;
const userRegPageURL = baseURL + 'pages/userRegistration.html';
const userDashboardURL = baseURL + 'pages/userDashboard.html';
const teacherLoginPageURL = baseURL + 'pages/teacherLogin.html';
const teacherRegPageURL = baseURL + 'pages/teacherRegistration.html';
const teacherDashboardURL = baseURL + 'pages/teacherDashboard.html';

// functions
const checkTokenOnServer = async (
  token: string,
  userName: string,
  entity: string
) => {
  const data = {
    token: token,
    userName: userName,
  };
  const payload = JSON.stringify(data);
  let serverData;
  let response: any;
  switch (entity) {
    case 'student':
      response = await fetch('http://localhost:8080/api/v1/user/token', {
        method: 'POST',
        body: payload,
        headers: { 'Content-Type': 'application/json' },
      });
    case 'teacher':
      response = await fetch('http://localhost:8080/api/v1/teacher/token', {
        method: 'POST',
        body: payload,
        headers: { 'Content-Type': 'application/json' },
      });
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
      if (!cookie.studentToken && !cookie.studentUserName) {
        redirect_url ? (window.location.href = redirect_url) : null;
      } else {
        const res = await checkTokenOnServer(
          cookie.studentToken,
          cookie.studentUserName,
          entity
        );
        if (!res) {
          redirect_url ? (window.location.href = redirect_url) : null;
        }
      }
      break;
    case 'teacher':
      if (!cookie.teacherToken || !cookie.teacherUserName) {
        redirect_url ? (window.location.href = redirect_url) : null;
      } else {
        const res = await checkTokenOnServer(
          cookie.teacherToken,
          cookie.teacherUserName,
          entity
        );
        if (!res) window.location.href = redirect_url;
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
  document.cookie = `${key}=${value}; expires=${date.toUTCString()};`;
};
