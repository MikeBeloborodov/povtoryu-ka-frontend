fetch('../mock_data/new_cards.json')
  .then((res) => res.json())
  .then((json) => console.log(json));
