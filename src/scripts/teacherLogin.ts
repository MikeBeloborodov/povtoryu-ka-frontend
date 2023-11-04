// selectors
const loginBtn = document.querySelector('#login-btn');
const regBtn = document.querySelector('#register-btn');

regBtn?.addEventListener('click', (evt) => {
  evt.preventDefault();
  window.location.href = teacherRegPageURL;
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

    const res = await fetch(apiTeacherLoginURL, {
      method: 'POST',
      body: payload,
      headers: { 'Content-Type': 'application/json' },
    });
    const serverData = await res.json();

    if (res.status === 200) {
      setCookie('teacherToken', serverData.token, 365);
      window.location.href = teacherDashboardURL;
    } else {
      console.log(serverData);
      setCookie('teacherToken', '', -1);
    }
  } else {
    console.log('error');
  }
});
