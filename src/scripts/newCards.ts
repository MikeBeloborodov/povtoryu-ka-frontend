// functions
const displayNewCard = async () => {
  toggleLoader('.loader', 'loader_invisible');
  try {
    let cardData = await getNewWordCard();
    if (cardData) {
      const card = createWordCard(cardData);
      if (trainerSection && card) {
        trainerSection.append(card);
        setWordCardTriggers(card, cardData, displayNewCard);
      }
    } else {
      cardData = await getNewSentenceCard();
      if (cardData) {
        const card = createSentenceCard(cardData);
        if (trainerSection && card) {
          trainerSection.append(card);
          setSentenceCardTriggers(card, cardData, displayNewCard);
        }
      } else {
        document.addEventListener('keydown', (evt) => {
          if (evt.key === 'Enter') {
            window.location.href = studentDashboardURL;
          }
        });
        renderMessageContainer(
          'Вы выучили все новые карточки!',
          'Назад',
          () => {
            window.location.href = studentDashboardURL;
          }
        );
        return;
      }
    }
  } catch (error) {
    console.log(error);
    alert(error);
  } finally {
    toggleLoader('.loader', 'loader_invisible');
  }
};

// listeners
// remove old card on enter if user looks at the back of the card
document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Enter') {
    const card = document.querySelector('.card');
    const cardBack = card?.querySelector('.card__back');
    if (card && cardBack?.classList.contains('card__back_active')) {
      card.remove();
      displayNewCard();
    }
  }
});

// invocations;
toggleLoader('.loader', 'loader_invisible');
checkToken('student', studentLoginPageURL)
  .then(() => {
    displayNewCard();
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    toggleLoader('.loader', 'loader_invisible');
  });
