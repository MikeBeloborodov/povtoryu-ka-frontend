// functions
const displayReviewCard = async () => {
  toggleLoader();
  try {
    let cardData = await getReviewWordCard();
    if (cardData) {
      const card = createWordCard(cardData);
      if (trainerSection && card) {
        trainerSection.append(card);
        setWordCardTriggers(card, cardData, displayReviewCard);
      }
    } else {
      cardData = await getReviewSentenceCard();
      if (cardData) {
        const card = createSentenceCard(cardData);
        if (trainerSection && card) {
          trainerSection.append(card);
          setSentenceCardTriggers(card, cardData, displayReviewCard);
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
    toggleLoader();
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
      displayReviewCard();
    }
  }
});

// function calls
toggleLoader();
checkToken('student', studentLoginPageURL)
  .then(() => {
    displayReviewCard();
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    toggleLoader();
  });
