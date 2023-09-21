// Config section input validation
const quantityInputs = document.querySelectorAll(".quantity");

// Listen for input event
quantityInputs.forEach(function (input) {
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
      if (inputValue < minValue) {
        this.value = this.min;
      } else if (inputValue > maxValue) {
        this.value = this.max;
      }
    }
  });
});