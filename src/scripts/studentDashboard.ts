const newCardsSpan = document.querySelector('#new-cards-amount');
const reviewCardsSpan = document.querySelector('#review-cards-amount');
const allCardsSpan = document.querySelector('#all-cards-amount');
const newCardsTextSpan = document.querySelector('#new-cards-amount-text');
const allCardsTextSpan = document.querySelector('#all-cards-amount-text');
const reviewCardsTextSpan = document.querySelector('#review-cards-amount-text');

// functions
const handleAmountSpanText = (spanElement: Element, amount: number) => {
  const amountString = amount.toString();
  const lastDigit = amountString[amountString.length - 1];
  switch (lastDigit) {
    case '1':
      spanElement.textContent = 'карточка';
      break;
    case '2':
    case '3':
    case '4':
      spanElement.textContent = 'карточки';
      break;
    default:
      spanElement.textContent = 'карточек';
      break;
  }
};

const loadCardsAmount = (cardsCountData: CardsCountData) => {
  newCardsSpan
    ? (newCardsSpan.textContent = cardsCountData.cardsNew.toString())
    : null;
  reviewCardsSpan
    ? (reviewCardsSpan.textContent = cardsCountData.cardsToReview.toString())
    : null;
  allCardsSpan
    ? (allCardsSpan.textContent = cardsCountData.cardsAll.toString())
    : null;
  if (allCardsTextSpan) {
    handleAmountSpanText(allCardsTextSpan, cardsCountData.cardsAll);
  }
  if (newCardsTextSpan) {
    handleAmountSpanText(newCardsTextSpan, cardsCountData.cardsNew);
  }
  if (reviewCardsTextSpan) {
    handleAmountSpanText(reviewCardsTextSpan, cardsCountData.cardsToReview);
  }
};

// function calls
toggleLoader();
checkToken('student', studentLoginPageURL)
  .then(() => {
    toggleLoader();
    getCardsCount()
      .then((cardsCountData: CardsCountData) => {
        loadCardsAmount(cardsCountData);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        toggleLoader();
      });
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    toggleLoader();
    toggleContentVisibility(
      '.student-dashboard__main',
      'student-dashboard__main_invisible'
    );
  });
