export function animateValue(inputId, textId, startId, endId, stepId, speedId, callback) {
    const input = document.getElementById(inputId);
    const text = document.getElementById(textId);
    const start = parseFloat(document.getElementById(startId).value);
    const end = parseFloat(document.getElementById(endId).value);
    const step = parseFloat(document.getElementById(stepId).value);
    const speed = parseInt(document.getElementById(speedId).value);
  
    let currentValue = start;
    const increment = end > start ? step : -step;
  
    function updateValue() {
      currentValue += increment;
      if ((increment > 0 && currentValue > end) || (increment < 0 && currentValue < end)) {
        currentValue = end;
        callback(currentValue);
        setTimeout(reverseAnimation, speed);
      } else {
        input.value = currentValue.toFixed(1);
        text.value = currentValue.toFixed(1);
        callback(currentValue);
        setTimeout(updateValue, speed);
      }
    }
  
    function reverseAnimation() {
      currentValue -= increment;
      if ((increment > 0 && currentValue < start) || (increment < 0 && currentValue > start)) {
        currentValue = start;
        callback(currentValue);
      } else {
        input.value = currentValue.toFixed(1);
        text.value = currentValue.toFixed(1);
        callback(currentValue);
        setTimeout(reverseAnimation, speed);
      }
    }
  
    updateValue();
  }
  
  export function reverseAnimation(currentValue, start, increment, input, text, callback) {
    currentValue -= increment;
    if ((increment > 0 && currentValue < start) || (increment < 0 && currentValue > start)) {
      currentValue = start;
      callback(currentValue);
    } else {
      input.value = currentValue.toFixed(1);
      text.value = currentValue.toFixed(1);
      callback(currentValue);
      setTimeout(() => reverseAnimation(currentValue, start, increment, input, text, callback), 50);
    }
  }