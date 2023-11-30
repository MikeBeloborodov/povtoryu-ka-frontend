const enableValidation = ({
  formSelector,
  inputSelector,
  submitButtonSelector,
  inactiveButtonClass,
  inputErrorClass,
}: ValidationConfig) => {
  const formList = Array.from(
    document.querySelectorAll(formSelector)
  ) as HTMLFormElement[];

  formList.forEach((formElement) => {
    formElement.addEventListener('submit', (evt) => {
      evt.preventDefault();
    });
    setEventListeners(formElement, {
      formSelector,
      inputSelector,
      submitButtonSelector,
      inactiveButtonClass,
      inputErrorClass,
    });
  });
};

const setEventListeners = (
  formElement: HTMLFormElement,
  {
    inputSelector,
    submitButtonSelector,
    inactiveButtonClass,
    inputErrorClass,
  }: ValidationConfig
) => {
  const inputList = Array.from(
    formElement.querySelectorAll(inputSelector)
  ) as HTMLInputElement[];
  const buttonElement = formElement.querySelector(
    submitButtonSelector
  ) as HTMLButtonElement;
  toggleButtonState(inputList, buttonElement, inactiveButtonClass);
  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, inputErrorClass);
      toggleButtonState(inputList, buttonElement, inactiveButtonClass);
    });
  });
};

const toggleButtonState = (
  inputList: HTMLInputElement[],
  buttonElement: HTMLButtonElement,
  inactiveButtonClass: string
) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(inactiveButtonClass);
    buttonElement.disabled = false;
  }
};

const hasInvalidInput = (inputList: HTMLInputElement[]) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

const checkInputValidity = (
  formElement: HTMLFormElement,
  inputElement: HTMLInputElement,
  inputErrorClass: string
) => {
  if (inputElement.validity.patternMismatch) {
    inputElement.dataset.errorMessage
      ? inputElement.setCustomValidity(inputElement.dataset.errorMessage)
      : null;
  } else {
    inputElement.setCustomValidity('');
  }

  if (!inputElement.validity.valid) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      inputErrorClass
    );
  } else {
    hideInputError(formElement, inputElement, inputErrorClass);
  }
};

const showInputError = (
  formElement: HTMLFormElement,
  inputElement: HTMLInputElement,
  errorMessage: string,
  inputErrorClass: string
) => {
  const errorSpanElement = formElement.querySelector(
    `#${inputElement.id}-error`
  );
  inputElement.classList.add(inputErrorClass);
  errorSpanElement ? (errorSpanElement.textContent = errorMessage) : null;
};

const hideInputError = (
  formElement: HTMLFormElement,
  inputElement: HTMLInputElement,
  inputErrorClass: string
) => {
  const errorSpanElement = formElement.querySelector(
    `#${inputElement.id}-error`
  );
  inputElement.classList.remove(inputErrorClass);
  errorSpanElement ? (errorSpanElement.textContent = '') : null;
};
