// selectors
const loginUserBtn = document.querySelector('#login-btn');
const regUserBtn = document.querySelector('#register-btn');

// event listeners
regUserBtn?.addEventListener('click', (evt) => {
  evt.preventDefault();
  window.location.href = studentRegPageURL;
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

    const res = await fetch(apiStudentLoginURL, {
      method: 'POST',
      body: payload,
      headers: { 'Content-Type': 'application/json' },
    });
    const serverData = await res.json();

    if (res.status === 200) {
      console.log(serverData);
      setCookie('studentToken', serverData.token, 365);
      window.location.href = studentDashboardURL;
    } else {
      console.log(serverData);
      setCookie('studentToken', '', -1);
    }
  } else {
    console.log('error');
  }
});

// invocations;
checkToken('student', '')
  .then(() => {
    window.location.href = studentDashboardURL;
  })
  .catch((err) => {
    console.log(err);
  });
