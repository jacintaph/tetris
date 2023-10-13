/**
 * @class Configuration
 * @constructs
 * @classdesc The Configuration class handles all event listeners and input validation for the Configuration page
 * @example
 * const instance = new Configuration()
 */
export class Configuration {
  constructor() {
    if (Configuration._instance) {
      return Configuration._instance;
    }
    Configuration._instance = this;

    this.setEventListeners();
  }

  setEventListeners() {
    const quantityInputs = document.querySelectorAll(".quantity");
    // Apply validation to each user input
    quantityInputs.forEach((input) => {
      this.inputValidation(input);
    });
  }

  inputValidation(input) {
    // apply value/min/max specified in index.html
    let inputValue = parseFloat(input.value);
    let minValue = parseFloat(input.min);
    let maxValue = parseFloat(input.max);
    let isTyping = false;

    input.addEventListener("input", function () {
      inputValue = parseFloat(this.value);
      isTyping = true;
    });

    input.addEventListener("blur", function () {
      // Prevent immediate change if user still typing
      if (isTyping) {
        isTyping = false;
        // Check if the input value is outside the allowed range
        // If yes, then apply the default value from index.html
        if (inputValue < minValue) {
          this.value = this.min;
        } else if (inputValue > maxValue) {
          this.value = this.max;
        }
      }
    });
  }
}
