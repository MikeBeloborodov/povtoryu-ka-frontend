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
