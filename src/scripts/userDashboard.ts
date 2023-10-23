// selectors
//
// functions
const checkTokenUserDashboard = async (token: string, userName: string) => {
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

const getUserCookie = () => {
  let cookie: any = {};
  document.cookie.split(';').forEach((el: string) => {
    let [key, value] = el.split('=');
    cookie[key.trim()] = value;
  });
  return cookie;
};

const checkUserToken = async () => {
  const cookie = getUserCookie();
  if (!cookie.studentToken || !cookie.studentUserName) {
    window.location.href = 'http://localhost:3000/pages/userLogin.html';
  } else {
    const res = await checkTokenUserDashboard(
      cookie.studentToken,
      cookie.studentUserName
    );
    if (!res) {
      console.log('no token in server');
      window.location.href = 'http://localhost:3000/pages/userLogin.html';
    }
  }
};

// invocations;
checkUserToken();
