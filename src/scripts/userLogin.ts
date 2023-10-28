// selectors
const loginUserBtn = document.querySelector('#login-btn');
const regUserBtn = document.querySelector('#register-btn');

// invocations;
(async () => {
  const res = await checkToken('student', '');
  res ? (window.location.href = userDashboardURL) : null;
})();

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
      setCookie('studentToken', serverData.token, 365);
      setCookie('studentUserName', serverData.userName, 365);
      window.location.href = 'http://localhost:3000/pages/userDashboard.html';
    } else {
      console.log(serverData);
      setCookie('studentToken', '', -1);
      setCookie('studentUserName', '', -1);
    }
  } else {
    console.log('error');
  }
});
