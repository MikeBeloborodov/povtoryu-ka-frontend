// functions
const displayReviewWordCard = () => {
  toggleLoader('.loader', 'loader_invisible');
  getReviewWordCard()
    .then((cardData) => {
      if (!cardData) {
        document.addEventListener('keydown', (evt) => {
          if (evt.key === 'Enter') {
            window.location.href = studentDashboardURL;
          }
        });
        renderMessageContainer('Вы повторили все карточки!', 'Назад', () => {
          window.location.href = studentDashboardURL;
        });
        return;
      }
      const card = createCard(cardData);
      if (trainerSection && card) {
        trainerSection.append(card);
        setCardTriggers(card, cardData, displayReviewWordCard);
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      toggleLoader('.loader', 'loader_invisible');
    });
};

// listeners
// remove old card on enter if user looks at the back of the card
document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Enter') {
    const card = document.querySelector('.card');
    const cardBack = card?.querySelector('.card__back');
    if (card && cardBack?.classList.contains('card__back_active')) {
      card.remove();
      displayReviewWordCard();
    }
  }
});

// invocations;
toggleLoader('.loader', 'loader_invisible');
checkToken('student', studentLoginPageURL)
  .then(() => {
    displayReviewWordCard();
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    toggleLoader('.loader', 'loader_invisible');
  });
