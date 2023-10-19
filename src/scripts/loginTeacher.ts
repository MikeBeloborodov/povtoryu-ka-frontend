// selectors
const loginBtn = document.querySelector('#login-btn');
const regBtn = document.querySelector('#register-btn');
//
// functions
const setCookieLogin = (key: string, value: string, expiresDays: number) => {
  let date = new Date();
  date.setTime(date.getTime() + expiresDays * 24 * 60 * 60 * 1000);
  document.cookie = `${key}=${value}; expires=${date.toUTCString()};`;
};

regBtn?.addEventListener('click', (evt) => {
  evt.preventDefault();
  window.location.href = 'http://localhost:3000/pages/teacherRegistration.html';
});

loginBtn?.addEventListener('click', async (evt) => {
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

    const res = await fetch('http://localhost:8080/api/v1/teacher/login', {
      method: 'POST',
      body: payload,
      headers: { 'Content-Type': 'application/json' },
    });
    const serverData = await res.json();

    if (res.status === 200) {
      setCookieLogin('token', serverData.token, 365);
      setCookieLogin('userName', serverData.userName, 365);
      window.location.href =
        'http://localhost:3000/pages/teacherDashboard.html';
    } else {
      console.log(serverData);
      setCookieLogin('token', '', -1);
      setCookieLogin('userName', '', -1);
    }
  } else {
    console.log('error');
  }
});
