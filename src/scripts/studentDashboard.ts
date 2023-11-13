const newCardsSpan = document.querySelector('#new-cards-amount');
const reviewCardsSpan = document.querySelector('#review-cards-amount');
const allCardsSpan = document.querySelector('#all-cards-amount');

// functions
const loadCardsAmount = async (studentData: studentOwnData) => {
  newCardsSpan
    ? (newCardsSpan.textContent = studentData.newCards.toString())
    : null;
  reviewCardsSpan
    ? (reviewCardsSpan.textContent = studentData.reviewCards.toString())
    : null;
  allCardsSpan
    ? (allCardsSpan.textContent = studentData.allCards.toString())
    : null;
};

// invocations;
(async () => {
  if (await checkToken('student', studentLoginPageURL)) {
    try {
      const studentData = (await returnStudentData())
        .studentData as studentOwnData;
      loadCardsAmount(studentData);
    } catch (error) {
      console.log(error);
    }
  }
})();
