// selectors
const cardSource: HTMLTemplateElement | null = document.querySelector('#card');
const cardTemplate = cardSource?.content;
const trainerSection = document.querySelector('.trainer');

// interfaces
interface CardData {
  category: string;
  definition: string;
  id: number;
  images: ImageObject[];
  in_context: string[];
  new_card: boolean;
  part_of_speech: string;
  part_of_speech_ru: string;
  student_id: number;
  teacher_id: number;
  theme: string;
  translation: string[];
  word: string;
}

interface ImageObject {
  thumb: string;
  original: string;
}

// functions
const prepareWord = (cardElement: HTMLElement, cardData: CardData) => {
  const cardWord = cardElement.querySelector('.card__front-word');
  cardWord ? (cardWord.textContent = cardData.word) : null;
};

const prepareDefinition = (cardElement: HTMLElement, cardData: CardData) => {
  const definitionContainer = cardElement.querySelector(
    '.card__back-definition'
  );
  if (definitionContainer) {
    const definition = definitionContainer.querySelector(
      '.card__back-definition-text'
    );
    definition ? (definition.textContent = cardData.definition) : null;
  }
};

const prepareSentences = (cardElement: HTMLElement, cardData: CardData) => {
  const sentencesContainer = cardElement.querySelector(
    '.card__back-sentences-container'
  );
  cardData.in_context.forEach((sentence_data, index) => {
    const sentenceListItem = cardElement
      .querySelector('.card__back-sentence-item')
      ?.cloneNode(true) as HTMLElement;
    const sentence = sentenceListItem.querySelector('.card__back-sentence');
    if (sentence) {
      const frontTag = '{it}';
      const backTag = '{/it}';
      const textBeforeFrontTag = sentence_data.slice(
        0,
        sentence_data.indexOf(frontTag)
      );
      const textAfterBackTag = sentence_data
        .slice(sentence_data.indexOf(backTag))
        .replace(backTag, '');
      const span = document.createElement('span');
      span.classList.add('word-in-sentence');
      span.textContent = cardData.word;
      sentence.innerHTML += textBeforeFrontTag;
      sentence.append(span);
      sentence.innerHTML += textAfterBackTag;
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
};

const createImageModal = (image_data: ImageObject) => {
  const modal = document.createElement('div');
  modal.classList.add('image-modal');
  const modalContent = document.createElement('div');
  modalContent.classList.add('image-modal__content');
  const modalImage = document.createElement('img');
  modalImage.classList.add('image-modal__image');
  modalImage.src = image_data.original;
  modalContent.append(modalImage);
  modal.append(modalContent);

  return modal;
};

const prepareImages = (cardElement: HTMLElement, cardData: CardData) => {
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
    image ? (image.src = image_data.thumb) : null;
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

const prepareTranslations = (cardElement: HTMLElement, cardData: CardData) => {
  const translationsContainer = cardElement.querySelector(
    '.card__back-translations-container'
  );
  cardData.translation.forEach((translation_data, index) => {
    const translationListItem = cardElement
      .querySelector('.card__back-translations-item')
      ?.cloneNode(true) as HTMLElement;
    const translation = translationListItem.querySelector(
      '.card__back-translation'
    );
    translation ? (translation.textContent = translation_data) : null;
    if (index === 0 && translationListItem) {
      translationListItem.classList.add('card__back-translations-item_active');
    }
    translationsContainer
      ? translationsContainer.append(translationListItem)
      : null;
  });
  // remove translation template
  const translationListItemOriginal = cardElement.querySelector(
    '.card__back-translations-item'
  );
  translationListItemOriginal ? translationListItemOriginal.remove() : null;
};

const prepareButtons = (cardElement: HTMLElement) => {
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

const createCard = (cardData: CardData) => {
  const cardElement = cardTemplate
    ?.querySelector('.card')
    ?.cloneNode(true) as HTMLElement;

  if (cardElement) {
    // fill data
    prepareWord(cardElement, cardData);

    prepareDefinition(cardElement, cardData);

    prepareSentences(cardElement, cardData);

    prepareImages(cardElement, cardData);

    prepareTranslations(cardElement, cardData);

    prepareButtons(cardElement);

    return cardElement;
  }
};

const renderCard = () => {
  fetch('../mock_data/new_cards.json')
    .then((res) => res.json())
    .then((data: CardData[]) => {
      const card = createCard(data[0]);
      if (trainerSection && card) {
        trainerSection.append(card);
      }
    });
};

renderCard();
