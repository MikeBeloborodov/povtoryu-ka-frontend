// functions
const waitForElement = async (selector: string): Promise<HTMLElement> => {
  return new Promise<HTMLElement>((resolve) => {
    if (document.querySelector(selector)) {
      resolve(document.querySelector(selector) as HTMLElement);
    }
    const observer = new MutationObserver((_, observer) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector) as HTMLElement);
        observer.disconnect();
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
};

const setTriggers = async () => {
  const card: HTMLElement | null = await waitForElement('.card');
  if (card) {
    const cardFront = card.querySelector('.card__front');
    const cardBack = card.querySelector('.card__back');
    card.addEventListener('click', () => {
      cardFront?.classList.remove('card__front_active');
      cardBack?.classList.add('card__back_active');
    });
  }
};

// function calls
setTriggers();
