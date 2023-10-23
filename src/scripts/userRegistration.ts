// selectors
const registerUserBtn = document.querySelector('#register-btn');

registerUserBtn?.addEventListener('click', async (evt) => {
  evt.preventDefault();

  const userName = document.querySelector('#user-name') as HTMLInputElement;
  const password = document.querySelector('#password') as HTMLInputElement;
  const specialCode = document.querySelector('#special') as HTMLInputElement;

  if (userName.value && password.value && specialCode.value) {
    const data = {
      userName: userName.value,
      password: password.value,
      specialCode: specialCode.value,
    };
    const payload = JSON.stringify(data);

    const res = await fetch('http://localhost:8080/api/v1/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    });
    const serverData = await res.json();
    console.log(serverData);
    if (res.status === 201) {
      window.location.href = 'http://localhost:3000/pages/userLogin.html';
    }
  } else {
    console.log('error');
  }
});
