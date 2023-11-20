const getResponseData = (res: Response): Promise<CardData> => {
  return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
};

const getNewWordCard = async (): Promise<CardData> => {
  const cookie = getCookie();
  return fetch(apiGetNewWordCard, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookie.studentToken}`,
    },
  }).then((res) => getResponseData(res));
};
