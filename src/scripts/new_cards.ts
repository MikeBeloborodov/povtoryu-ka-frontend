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
const createCard = (cardData: CardData) => {
  const cardElement = cardTemplate
    ?.querySelector('.card')
    ?.cloneNode(true) as HTMLElement;

  if (cardElement) {
    // fill data
    //
    // word
    const cardWord = cardElement.querySelector('.card__front-word');
    cardWord ? (cardWord.textContent = cardData.word) : null;

    // sentences
    const sentencesContainer = cardElement.querySelector(
      '.card__back-sentences-container'
    );
    cardData.in_context.forEach((sentence_data) => {
      const sentenceListItem = cardElement
        .querySelector('.card__back-sentence-item')
        ?.cloneNode(true) as HTMLElement;
      const sentence = sentenceListItem.querySelector('.card__back-sentence');
      sentence ? (sentence.textContent = sentence_data) : null;
      sentencesContainer ? sentencesContainer.append(sentenceListItem) : null;
    });
    //remove sentence template
    const sentenceListItemOriginal = cardElement.querySelector(
      '.card__back-sentence-item'
    );
    sentenceListItemOriginal ? sentenceListItemOriginal.remove() : null;

    // images
    const imagesContainer = cardElement.querySelector(
      '.card__back-images-container'
    );
    cardData.images.forEach((image_data) => {
      const imageListItem = cardElement
        ?.querySelector('.card__back-image-item')
        ?.cloneNode(true) as HTMLElement;
      const image = imageListItem.querySelector(
        '.card__back-image'
      ) as HTMLImageElement;
      image ? (image.src = image_data.thumb) : null;
      imagesContainer ? imagesContainer.append(imageListItem) : null;
    });
    // remove image template
    const imageListItemOriginal = cardElement.querySelector(
      '.card__back-image-item'
    );
    imageListItemOriginal ? imageListItemOriginal.remove() : null;

    // translation
    const translationsContainer = cardElement.querySelector(
      '.card__back-translations-container'
    );
    cardData.translation.forEach((translation_data) => {
      const translationListItem = cardElement
        .querySelector('.card__back-translations-item')
        ?.cloneNode(true) as HTMLElement;
      const translation = translationListItem.querySelector(
        '.card__back-translation'
      );
      translation ? (translation.textContent = translation_data) : null;
      translationsContainer
        ? translationsContainer.append(translationListItem)
        : null;
    });
    // remove translation template
    const translationListItemOriginal = cardElement.querySelector(
      '.card__back-translations-item'
    );
    translationListItemOriginal ? translationListItemOriginal.remove() : null;

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
