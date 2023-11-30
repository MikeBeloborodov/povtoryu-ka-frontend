// selectors
const wordCardSource: HTMLTemplateElement | null =
  document.querySelector('#word-card');
const sentenceCardSource: HTMLTemplateElement | null =
  document.querySelector('#sentence-card');
const wordCardTemplate = wordCardSource?.content;
const sentenceCardTemplate = sentenceCardSource?.content;
const trainerSection = document.querySelector('.trainer');

// functions
const setWordCardTriggers = async (
  card: HTMLElement,
  cardData: WordCardData,
  nextCardCallback: Function
) => {
  const cardFront = card.querySelector('.card__front');
  const cardBack = card.querySelector('.card__back');
  const cardNextBtn = card.querySelector('.card__back-controls-next');
  const answerForm = document.forms.namedItem('answer');
  const cardFooter = card.querySelector('.card__back-footer');
  const cardFooterText = cardFooter?.querySelector('.card__back-footer-text');
  const errorSpan = answerForm?.querySelector('.card__front-answer-error');
  const elements = answerForm?.elements as answerForm;
  const answer = elements.answer;
  answer.focus();

  answerForm?.addEventListener('submit', (evt) => {
    evt.preventDefault();
    if (card.dataset.cardId) {
      toggleLoader();
      sendWordCardAnswer({
        cardId: parseInt(card.dataset.cardId),
        answer: answer.value,
      })
        .then((res) => {
          cardFront?.classList.remove('card__front_active');
          cardBack?.classList.add('card__back_active');
          if (res.isCorrect) {
            cardFooter?.classList.add('card__back-footer_correct');
            cardFooterText ? (cardFooterText.textContent = 'Правильно!') : null;
          } else {
            const translations = cardData.translations
              .map((item) => {
                return item.translation;
              })
              .toString();
            cardFooter?.classList.add('card__back-footer_incorrect');
            cardFooterText
              ? (cardFooterText.textContent = `Неверно.\nВаш ответ: ${answer.value}.\nПравильные ответы: ${translations}.`)
              : null;
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          toggleLoader();
        });
    }
  });

  // input validation
  answer.addEventListener('input', (evt) => {
    if (answer.validity.patternMismatch) {
      answer.dataset.errorMessage
        ? answer.setCustomValidity(answer.dataset.errorMessage)
        : null;
    } else {
      answer.setCustomValidity('');
    }
    if (!answer.validity.valid) {
      errorSpan ? (errorSpan.textContent = answer.validationMessage) : null;
      answer.classList.add('card__front-answer-input_error');
    } else {
      errorSpan ? (errorSpan.textContent = '') : null;
      answer.classList.remove('card__front-answer-input_error');
    }
  });

  cardNextBtn?.addEventListener('click', async (evt) => {
    card.remove();
    nextCardCallback();
  });
};

const setSentenceCardTriggers = async (
  card: HTMLElement,
  cardData: SentenceCardData,
  nextCardCallback: Function
) => {
  const cardFront = card.querySelector('.card__front');
  const cardBack = card.querySelector('.card__back');
  const cardNextBtn = card.querySelector('.card__back-controls-next');
  const answerForm = document.forms.namedItem('answer');
  const cardFooter = card.querySelector('.card__back-footer');
  const cardFooterText = cardFooter?.querySelector('.card__back-footer-text');
  const errorSpan = answerForm?.querySelector('.card__front-answer-error');
  const elements = answerForm?.elements as answerForm;
  const answer = elements.answer;
  const audio = document.querySelector('.card__audio') as HTMLAudioElement;
  answer.focus();

  answerForm?.addEventListener('submit', (evt) => {
    evt.preventDefault();
    audio ? audio.play() : null;
    if (card.dataset.cardId) {
      toggleLoader();
      sendSentenceCardAnswer({
        cardId: parseInt(card.dataset.cardId),
        answer: answer.value,
      })
        .then((res) => {
          cardFront?.classList.remove('card__front_active');
          cardBack?.classList.add('card__back_active');
          if (res.isCorrect) {
            cardFooter?.classList.add('card__back-footer_correct');
            cardFooterText ? (cardFooterText.textContent = 'Правильно!') : null;
          } else {
            cardFooter?.classList.add('card__back-footer_incorrect');
            cardFooterText
              ? (cardFooterText.textContent = `Неверно.\nВаш ответ: ${answer.value}.\nПравильный ответ: ${cardData.answer}.`)
              : null;
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          toggleLoader();
        });
    }
  });

  // input validation
  answer.addEventListener('input', (evt) => {
    if (answer.validity.patternMismatch) {
      answer.dataset.errorMessage
        ? answer.setCustomValidity(answer.dataset.errorMessage)
        : null;
    } else {
      answer.setCustomValidity('');
    }
    if (!answer.validity.valid) {
      errorSpan ? (errorSpan.textContent = answer.validationMessage) : null;
      answer.classList.add('card__front-answer-input_error');
    } else {
      errorSpan ? (errorSpan.textContent = '') : null;
      answer.classList.remove('card__front-answer-input_error');
    }
  });

  cardNextBtn?.addEventListener('click', async (evt) => {
    card.remove();
    nextCardCallback();
  });
};

const prepareAudio = (cardElement: HTMLElement, cardData: WordCardData) => {
  const cardAudio = cardElement.querySelector(
    '.card__back-audio'
  ) as HTMLAudioElement;
  if (!cardData.audio) cardAudio.remove();
  cardAudio ? (cardAudio.src = cardData.audio) : null;
};

const prepareFrontSentenceCard = (
  cardElement: HTMLElement,
  cardData: SentenceCardData
) => {
  //pos
  const cardPos = cardElement.querySelector('.sentence-card__front-pos');
  cardPos ? (cardPos.textContent = cardData.pos) : null;

  // sentence
  const cardSentence = cardElement.querySelector(
    '.sentence-card__front-sentence'
  );
  let sentence =
    cardData.sentence[0].toUpperCase() + cardData.sentence.slice(1);
  const regex = /\*.[^*]*\*/g;
  const searchResult = sentence.match(regex);
  searchResult?.forEach((item) => {
    sentence = sentence.replace(
      item,
      `<span class="card__front-bold-text">${item.replace(/\*/g, '')}</span>`
    );
  });
  cardSentence ? (cardSentence.innerHTML = sentence) : null;

  // word
  const cardWord = cardElement.querySelector('.sentence-card__front-word');
  cardWord ? (cardWord.textContent = cardData.word.toLowerCase()) : null;
};

const prepareBackSentenceCard = async (
  cardElement: HTMLElement,
  cardData: SentenceCardData
) => {
  // sentence
  const cardSentence = cardElement.querySelector('.card__back-sentence-text');
  let sentence =
    cardData.sentence[0].toUpperCase() + cardData.sentence.slice(1);
  const regex = /\*.[^*]*\*/g;
  const searchResult = sentence.match(regex);
  searchResult?.forEach((item) => {
    sentence = sentence.replace(
      item,
      `<span class="card__back-bold-text">${item.replace(/\*/g, '')}</span>`
    );
  });
  cardSentence ? (cardSentence.innerHTML = sentence) : null;

  // translation
  const cardTranslation = cardElement.querySelector(
    '.card__back-translation-text'
  );
  const translation =
    cardData.sentenceTranslation[0].toUpperCase() +
    cardData.sentenceTranslation.slice(1);
  cardTranslation ? (cardTranslation.textContent = translation) : null;

  // word
  const cardWord = cardElement.querySelector('.card__back-word-text');
  cardWord ? (cardWord.textContent = cardData.word) : null;

  // definition
  const cardDefinition = cardElement.querySelector(
    '.card__back-definition-text'
  );
  cardDefinition ? (cardDefinition.textContent = cardData.definition) : null;

  // answer
  const cardAnswer = cardElement.querySelector('.card__back-answer-text');
  cardAnswer ? (cardAnswer.textContent = cardData.answer) : null;

  // image
  const cardImage = cardElement.querySelector(
    '.card__back-image'
  ) as HTMLImageElement;
  cardImage ? (cardImage.src = cardData.image) : null;
  cardImage.addEventListener('click', () => {
    const modal = createImageModal({ id: 1, url: cardData.image });
    modal.addEventListener('click', () => modal.remove());
    document.body.append(modal);
    scroll(0, 0);
  });

  // audio
  const cardAudio = cardElement.querySelector(
    '.card__audio'
  ) as HTMLAudioElement;
  const audioBlob = await getCardAudio(cardData.audio);
  cardAudio ? (cardAudio.src = URL.createObjectURL(audioBlob)) : null;
};

const prepareWord = (cardElement: HTMLElement, cardData: WordCardData) => {
  const cardWord = cardElement.querySelector('.card__front-word');
  cardWord ? (cardWord.textContent = cardData.word.toLowerCase()) : null;
};

const prepareDefinition = (
  cardElement: HTMLElement,
  cardData: WordCardData
) => {
  const definitionContainer = cardElement.querySelector(
    '.card__back-definition'
  );
  if (definitionContainer) {
    const definition = definitionContainer.querySelector(
      '.card__back-definition-text'
    );
    definition
      ? (definition.textContent =
          cardData.definition[0].toUpperCase() + cardData.definition.slice(1))
      : null;
  }
};

const prepareSentences = (cardElement: HTMLElement, cardData: WordCardData) => {
  const sentencesContainer = cardElement.querySelector(
    '.card__back-sentences-container'
  );
  if (cardData.sentences.length > 0) {
    cardData.sentences.forEach((sentence_data, index) => {
      const sentenceListItem = cardElement
        .querySelector('.card__back-sentence-item')
        ?.cloneNode(true) as HTMLElement;
      const sentence = sentenceListItem.querySelector('.card__back-sentence');
      if (sentence) {
        sentence.textContent = sentence_data.sentence;
      }
      if (index === 0 && sentenceListItem) {
        sentenceListItem.classList.add('card__back-sentence-item_active');
      }
      sentencesContainer ? sentencesContainer.append(sentenceListItem) : null;
    });
    //remove sentence template
    const sentenceListItemOriginal = cardElement.querySelector(
      '.card__back-sentence-item'
    );
    sentenceListItemOriginal ? sentenceListItemOriginal.remove() : null;
  } else {
    const nextSentenceBtn = cardElement.querySelector(
      '.card__back-next-sentence-btn'
    ) as HTMLButtonElement;
    nextSentenceBtn.remove();
    const sentenceListItemOriginal = cardElement.querySelector(
      '.card__back-sentence-item'
    ) as HTMLElement;
    const sentence = sentenceListItemOriginal.querySelector(
      '.card__back-sentence'
    );
    if (sentence && sentenceListItemOriginal) {
      sentenceListItemOriginal.classList.add('card__back-sentence-item_active');
      sentence.textContent = 'К сожалению, примеров предложений нет :(';
    }
  }
};

const createImageModal = (image_data: ImageObject) => {
  const modal = document.createElement('div');
  modal.classList.add('image-modal');
  const modalContent = document.createElement('div');
  modalContent.classList.add('image-modal__content');
  const modalImage = document.createElement('img');
  modalImage.classList.add('image-modal__image');
  modalImage.src = image_data.url;
  modalContent.append(modalImage);
  modal.append(modalContent);

  return modal;
};

const prepareImages = (cardElement: HTMLElement, cardData: WordCardData) => {
  const imagesContainer = cardElement.querySelector(
    '.card__back-images-container'
  );
  cardData.images.forEach((image_data, index) => {
    const imageListItem = cardElement
      ?.querySelector('.card__back-image-item')
      ?.cloneNode(true) as HTMLElement;
    const image = imageListItem.querySelector(
      '.card__back-image'
    ) as HTMLImageElement;
    imageListItem.addEventListener('click', () => {
      const modal = createImageModal(image_data);
      modal.addEventListener('click', () => modal.remove());
      document.body.append(modal);
      scroll(0, 0);
    });
    image ? (image.src = image_data.url) : null;
    if (index === 0 && imageListItem) {
      imageListItem.classList.add('card__back-image-item_active');
    }
    imagesContainer ? imagesContainer.append(imageListItem) : null;
  });
  // remove image template
  const imageListItemOriginal = cardElement.querySelector(
    '.card__back-image-item'
  );
  imageListItemOriginal ? imageListItemOriginal.remove() : null;
};

const prepareTranslations = (
  cardElement: HTMLElement,
  cardData: WordCardData
) => {
  const translationsContainer = cardElement.querySelector(
    '.card__back-translations-container'
  );
  cardData.translations.forEach((translation_data, index) => {
    const translationListItem = cardElement
      .querySelector('.card__back-translations-item')
      ?.cloneNode(true) as HTMLElement;
    const translation = translationListItem.querySelector(
      '.card__back-translation'
    );
    translation
      ? (translation.textContent = translation_data.translation)
      : null;
    if (index === 0 && translationListItem) {
      translationListItem.classList.add('card__back-translations-item_active');
    }
    translationsContainer
      ? translationsContainer.append(translationListItem)
      : null;
  });
  // remove translations template
  const translationListItemOriginal = cardElement.querySelector(
    '.card__back-translations-item'
  );
  translationListItemOriginal ? translationListItemOriginal.remove() : null;
};

const prepareButtons = (cardElement: HTMLElement, cardData: WordCardData) => {
  // buttons
  const nextSentenceBtn = cardElement.querySelector(
    '.card__back-next-sentence-btn'
  ) as HTMLButtonElement;
  const nextImageBtn = cardElement.querySelector(
    '.card__back-next-image-btn'
  ) as HTMLButtonElement;
  const nextTranslationBtn = cardElement.querySelector(
    '.card__back-next-translation-btn'
  ) as HTMLButtonElement;

  // remove buttons if no more data is available
  if (cardData.sentences.length <= 1) nextSentenceBtn.remove();
  if (cardData.images.length <= 1) nextImageBtn.remove();
  if (cardData.translations.length <= 1) nextTranslationBtn.remove();

  // event listeners
  nextSentenceBtn?.addEventListener('click', () => {
    const shownSentences = cardElement.querySelectorAll(
      '.card__back-sentence-item_active'
    );
    const nextSentence = shownSentences[shownSentences.length - 1]
      .nextSibling as HTMLElement;
    if (nextSentence) {
      nextSentence.classList.add('card__back-sentence-item_active');
      if (!nextSentence.nextSibling) {
        nextSentenceBtn.style.display = 'none';
      }
    }
  });

  nextImageBtn?.addEventListener('click', () => {
    const shownImages = cardElement.querySelectorAll(
      '.card__back-image-item_active'
    );
    const nextImage = shownImages[shownImages.length - 1]
      .nextSibling as HTMLElement;
    if (nextImage) {
      nextImage.classList.add('card__back-image-item_active');
      if (!nextImage.nextSibling) {
        nextImageBtn.style.display = 'none';
      }
    }
  });

  nextTranslationBtn?.addEventListener('click', () => {
    const shownTranslation = cardElement.querySelectorAll(
      '.card__back-translations-item_active'
    );
    const nextTranslation = shownTranslation[shownTranslation.length - 1]
      .nextSibling as HTMLElement;
    if (nextTranslation) {
      nextTranslation.classList.add('card__back-translations-item_active');
      if (!nextTranslation.nextSibling) {
        nextTranslationBtn.style.display = 'none';
      }
    }
  });
};

const createWordCard = (cardData: WordCardData) => {
  const cardElement = wordCardTemplate
    ?.querySelector('.card')
    ?.cloneNode(true) as HTMLElement;

  if (cardElement) {
    // fill data
    prepareWord(cardElement, cardData);

    prepareDefinition(cardElement, cardData);

    prepareSentences(cardElement, cardData);

    prepareImages(cardElement, cardData);

    prepareTranslations(cardElement, cardData);

    prepareButtons(cardElement, cardData);

    prepareAudio(cardElement, cardData);

    cardElement.dataset.cardId = cardData.id.toString();

    return cardElement;
  }
};

const createSentenceCard = (cardData: SentenceCardData) => {
  const cardElement = sentenceCardTemplate
    ?.querySelector('.card')
    ?.cloneNode(true) as HTMLElement;

  if (cardElement) {
    prepareFrontSentenceCard(cardElement, cardData);

    prepareBackSentenceCard(cardElement, cardData);

    cardElement.dataset.cardId = cardData.id.toString();

    return cardElement;
  }
};
