// selectors
const loginUserBtn = document.querySelector('#login-btn');
const regUserBtn = document.querySelector('#register-btn');

// functions
const checkTokenUserLogin = async (token: string, userName: string) => {
  const data = {
    token: token,
    userName: userName,
  };
  const payload = JSON.stringify(data);
  const res = await fetch('http://localhost:8080/api/v1/user/token', {
    method: 'POST',
    body: payload,
    headers: { 'Content-Type': 'application/json' },
  });
  const serverData = await res.json();
  if (res.status === 200) {
    return serverData;
  } else {
    return false;
  }
};

const getUserLoginCookie = () => {
  let cookie: any = {};
  document.cookie.split(';').forEach((el: string) => {
    let [key, value] = el.split('=');
    cookie[key.trim()] = value;
  });
  return cookie;
};

const checkUserTokenLogin = async () => {
  const cookie = getUserLoginCookie();
  if (cookie.studentToken && cookie.studentUserName) {
    const res = await checkTokenUserLogin(
      cookie.studentToken,
      cookie.studentUserName
    );
    if (res) {
      window.location.href = 'http://localhost:3000/pages/userDashboard.html';
    }
  }
};

const setCookieUser = (key: string, value: string, expiresDays: number) => {
  let date = new Date();
  date.setTime(date.getTime() + expiresDays * 24 * 60 * 60 * 1000);
  document.cookie = `${key}=${value}; expires=${date.toUTCString()};`;
};

// invocations;
checkUserTokenLogin();

// event listeners
regUserBtn?.addEventListener('click', (evt) => {
  evt.preventDefault();
  window.location.href = 'http://localhost:3000/pages/userRegistration.html';
});

loginUserBtn?.addEventListener('click', async (evt) => {
  evt.preventDefault();

  const userNameElement = document.querySelector(
    '#user-name'
  ) as HTMLInputElement;
  const passwordElement = document.querySelector(
    '#password'
  ) as HTMLInputElement;

  if (userNameElement.value && passwordElement.value) {
    const data = {
      userName: userNameElement.value,
      password: passwordElement.value,
    };

    const payload = JSON.stringify(data);

    const res = await fetch('http://localhost:8080/api/v1/user/login', {
      method: 'POST',
      body: payload,
      headers: { 'Content-Type': 'application/json' },
    });
    const serverData = await res.json();

    if (res.status === 200) {
      setCookieUser('studentToken', serverData.token, 365);
      setCookieUser('studentUserName', serverData.userName, 365);
      window.location.href = 'http://localhost:3000/pages/userDashboard.html';
    } else {
      console.log(serverData);
      setCookieUser('studentToken', '', -1);
      setCookieUser('studentUserName', '', -1);
    }
  } else {
    console.log('error');
  }
});
