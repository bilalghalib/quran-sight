const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let quranText = '';
let currentSearchIndex = 0;
let zoomLevel = 1;
let fontSizeAnimationInterval;
let spiralDensityAnimationInterval;
let currentHighlightWord = '';


let roseMinimumRadius = 50;
let roseGrowthFactor = 0.01;
let roseAngleStep = 0.1;
let rosePetalCount = 6;

let trochoidMinimumRadius = 0;
let trochoidGrowthFactor = 0.00006;
let trochoidAngleStep = 0.01;
let trochoidInnerRadii = 0.8;
let trochoidOuterRadii = 2;
let trochoidDistance = 3;

// Load the Quranic text from a plain text file
fetch('quran.txt')
  .then(response => response.text())
  .then(text => {
    //remove copyright block from quran text
    let quranLines = text.split('\n').slice(0, 6236)
    text = quranLines.join('\n')

    quranText = text.slice(0, 10000); // Limit to 10,000 characters for testing
    drawVisualization();
  })
  .catch(error => {
    console.error('Error loading Quranic text:', error);
  });

function drawVisualization() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.scale(zoomLevel, zoomLevel);

  const spiralType = document.getElementById('spiralType').value;
  const fontSize = parseFloat(document.getElementById('fontSizeText').value);
  const spiralDensity = parseFloat(document.getElementById('spiralDensityText').value);
  const abjadColorEnabled = document.getElementById('abjadColor').checked;
  const abjadSizeEnabled = document.getElementById('abjadSize').checked;
  const abjadWordTotalEnabled = document.getElementById('abjadWordTotal').checked;

  ctx.font = fontSize + 'px "Noto Naskh Arabic"';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const centerX = canvas.width / (2 * zoomLevel);
  const centerY = canvas.height / (2 * zoomLevel);
  let radius = 10;
  let angle = 0;
  const angleIncrement = 0.1;

  const words = quranText.split(/\s+/);
  let wordIndex = 0;

  while (wordIndex < words.length) {
    const word = words[wordIndex];

    let x, y;
    if (spiralType === 'logarithmic') {
      x = Math.cos(angle) * radius;
      y = Math.sin(angle) * radius;
      radius += 0.1 * word.length;
    } else if (spiralType === 'archimedean') {
      x = Math.cos(angle) * angle;
      y = Math.sin(angle) * angle;
    } else if (spiralType === 'goldenMean') {
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      x = Math.cos(angle) * Math.sqrt(angle);
      y = Math.sin(angle) * Math.sqrt(angle);
      angle += goldenAngle;
    } else if (spiralType === 'fibonacci') {
      const fibonacciAngle = Math.PI * (3 - Math.sqrt(5));
      x = Math.cos(angle) * Math.sqrt(angle);
      y = Math.sin(angle) * Math.sqrt(angle);
      angle += fibonacciAngle;
      radius += 0.1 * Math.sqrt(angle) * word.length;
    } else if (spiralType === "rose") {
      if (radius < roseMinimumRadius) radius = roseMinimumRadius

      x = Math.cos(rosePetalCount * angle * Math.PI) * Math.cos(angle * Math.PI) * radius;
      y = Math.cos(rosePetalCount * angle * Math.PI) * Math.sin(angle * Math.PI) * radius;

      angle += roseAngleStep;
      radius += roseGrowthFactor;
    } else if (spiralType === "epitrochoid") {
      if (radius < trochoidMinimumRadius) radius = trochoidMinimumRadius;

      x = (((trochoidInnerRadii + trochoidOuterRadii) * Math.cos(angle)) - (trochoidDistance * Math.cos((trochoidInnerRadii + trochoidOuterRadii) / trochoidInnerRadii * angle))) * radius;
      y = (((trochoidInnerRadii + trochoidOuterRadii) * Math.sin(angle)) - (trochoidDistance * Math.sin((trochoidInnerRadii + trochoidOuterRadii) / trochoidInnerRadii * angle))) * radius;

      angle += trochoidAngleStep;
      radius += trochoidGrowthFactor;
    } else if (spiralType === "hypotrochoid") {
      if (radius < trochoidMinimumRadius) radius = trochoidMinimumRadius;

      x = (((trochoidInnerRadii + trochoidOuterRadii) * Math.cos(angle)) + (trochoidDistance * Math.cos((trochoidInnerRadii + trochoidOuterRadii) / trochoidInnerRadii * angle))) * radius;
      y = (((trochoidInnerRadii + trochoidOuterRadii) * Math.sin(angle)) - (trochoidDistance * Math.sin((trochoidInnerRadii + trochoidOuterRadii) / trochoidInnerRadii * angle))) * radius;

      angle += trochoidAngleStep;
      radius += trochoidGrowthFactor;
    }

    ctx.save();
    ctx.translate(centerX + x, centerY + y);
    ctx.rotate(angle + Math.PI / 2);

    const searchWord = cleanupHarakat(word)
    if (searchWord === currentHighlightWord) {
      ctx.font = 'bold ' + (fontSize + 1) + 'px "Noto Naskh Arabic"';
      ctx.fillStyle = 'red';
      ctx.fillText(word, 0, 0);
    } else {
      const abjadValue = getAbjadValue(word, abjadWordTotalEnabled);
      if (abjadSizeEnabled) {
        ctx.font = (fontSize + abjadValue / 100) + 'px "Noto Naskh Arabic"';
      } else {
        ctx.font = fontSize + 'px "Noto Naskh Arabic"';
      }
      if (abjadColorEnabled) {
        ctx.fillStyle = getColorByAbjadValue(abjadValue);
      } else {
        ctx.fillStyle = 'black';
      }
      ctx.fillText(word, 0, 0);
    }

    ctx.restore();

    angle += (angleIncrement * fontSize * word.length) / (20 * spiralDensity);
    wordIndex++;
  }

  ctx.restore();
}

function getAbjadValue(word, isWordTotal) {
  const abjadMap = {
    'ا': 1, 'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9,
    'ي': 10, 'ك': 20, 'ل': 30, 'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80,
    'ص': 90, 'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400, 'ث': 500, 'خ': 600,
    'ذ': 700, 'ض': 800, 'ظ': 900, 'غ': 1000,
  };
  let value = 0;
  if (isWordTotal) {
    for (let i = 0; i < word.length; i++) {
      value += abjadMap[word[i]] || 0;
    }
  } else {
    value = abjadMap[word[0]] || 0;
  }
  return value;
}

function getColorByAbjadValue(value) {
  const hue = (value * 137.508) % 360;
  return `hsl(${hue}, 50%, 50%)`;
}

function cleanupHarakat(str) {
  //remove all harakat and space from string
  const compareStr = new RegExp(/[\u0617-\u061A\u064B-\u0652\s]/, 'ig')
  return str.replaceAll(compareStr, '')
}

function updateRoseSettings(e){
  roseMinimumRadius = +document.getElementById('roseMinimumRadius').value;
  rosePetalCount = +document.getElementById('rosePetalCount').value;
  roseGrowthFactor = +document.getElementById('roseGrowthFactor').value;
  roseAngleStep = +document.getElementById('roseAngleStep').value;
  drawVisualization();
}

function updateTrochoidSettings(e){
  trochoidMinimumRadius = +document.getElementById('trochoidMinimumRadius').value;
  trochoidGrowthFactor = +document.getElementById('trochoidGrowthFactor').value;
  trochoidAngleStep = +document.getElementById('trochoidAngleStep').value;
  trochoidInnerRadii = +document.getElementById('trochoidInnerRadii').value;
  trochoidOuterRadii = +document.getElementById('trochoidOuterRadii').value;
  trochoidDistance = +document.getElementById('trochoidDistance').value;
  drawVisualization();
}

function searchAndHighlight() {
  const highlightWord = document.getElementById('highlightWord').value;
  currentHighlightWord = cleanupHarakat(highlightWord);
  drawVisualization();
}

function zoomIn() {
  zoomLevel *= 1.1;
  drawVisualization();
}

function zoomOut() {
  zoomLevel /= 1.1;
  drawVisualization();
}

function saveSVG() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', canvas.width);
  svg.setAttribute('height', canvas.height);
  svg.setAttribute('viewBox', `0 0 ${canvas.width} ${canvas.height}`);

  const spiralType = document.getElementById('spiralType').value;
  const fontSize = parseFloat(document.getElementById('fontSizeText').value);
  const spiralDensity = parseFloat(document.getElementById('spiralDensityText').value);
  const abjadColorEnabled = document.getElementById('abjadColor').checked;
  const abjadSizeEnabled = document.getElementById('abjadSize').checked;
  const abjadWordTotalEnabled = document.getElementById('abjadWordTotal').checked;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  let radius = 10;
  let angle = 0;
  const angleIncrement = 0.1;

  const words = quranText.split(/\s+/);
  let wordIndex = 0;

  while (wordIndex < words.length) {
    const word = words[wordIndex];

    let x, y;
    if (spiralType === 'logarithmic') {
      x = Math.cos(angle) * radius;
      y = Math.sin(angle) * radius;
      radius += 0.1 * word.length;
    } else if (spiralType === 'archimedean') {
      x = Math.cos(angle) * angle;
      y = Math.sin(angle) * angle;
    } else if (spiralType === 'goldenMean') {
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      x = Math.cos(angle) * Math.sqrt(angle);
      y = Math.sin(angle) * Math.sqrt(angle);
      angle += goldenAngle;
    } else if (spiralType === 'fibonacci') {
      const fibonacciAngle = Math.PI * (3 - Math.sqrt(5));
      x = Math.cos(angle) * Math.sqrt(angle);
      y = Math.sin(angle) * Math.sqrt(angle);
      angle += fibonacciAngle;
      radius += 0.1 * Math.sqrt(angle) * word.length;
    }

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'black');
    path.setAttribute('stroke-width', '1');
    path.setAttribute('transform', `translate(${centerX + x}, ${centerY + y}) rotate(${(angle + Math.PI / 2) * 180 / Math.PI})`);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('font-family', 'Noto Naskh Arabic');
    text.setAttribute('font-size', fontSize);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('transform', 'translate(' + (centerX + x) + ', ' + (centerY + y) + ') rotate(' + ((angle + Math.PI / 2) * 180 / Math.PI) + ')');


    if (word === currentHighlightWord) {
      text.setAttribute('font-weight', 'bold');
      text.setAttribute('fill', 'red');
    } else {
      const abjadValue = getAbjadValue(word, abjadWordTotalEnabled);
      if (abjadSizeEnabled) {
        text.setAttribute('font-size', fontSize + abjadValue / 100);
      }
      if (abjadColorEnabled) {
        text.setAttribute('fill', getColorByAbjadValue(abjadValue));
      } else {
        text.setAttribute('fill', 'black');
      }
    }

    text.textContent = word;

    const bbox = text.getBBox();
    path.setAttribute('d', `M${bbox.x},${bbox.y}L${bbox.x + bbox.width},${bbox.y}L${bbox.x + bbox.width},${bbox.y + bbox.height}L${bbox.x},${bbox.y + bbox.height}Z`);

    svg.appendChild(path);
    svg.appendChild(text);

    angle += (angleIncrement * fontSize * word.length) / (20 * spiralDensity);
    wordIndex++;
  }

  const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quran_spiral.svg';
  link.click();
  URL.revokeObjectURL(url);
}

function animateValue(inputId, textId, startId, endId, stepId, speedId, callback) {
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
      callback();
      reverseAnimation();
    } else {
      input.value = currentValue.toFixed(1);
      text.value = currentValue.toFixed(1);
      callback();
    }
  }

  function reverseAnimation() {
    currentValue -= increment;
    if ((increment > 0 && currentValue < start) || (increment < 0 && currentValue > start)) {
      currentValue = start;
      callback();
    } else {
      input.value = currentValue.toFixed(1);
      text.value = currentValue.toFixed(1);
      callback();
    }
  }

  return setInterval(updateValue, speed);
}

document.getElementById('fontSizeAnimationStart').addEventListener('click', function () {
  if (fontSizeAnimationInterval) {
    clearInterval(fontSizeAnimationInterval);
  }
  fontSizeAnimationInterval = animateValue('fontSize', 'fontSizeText', 'fontSizeStart', 'fontSizeEnd', 'fontSizeStep', 'fontSizeSpeed', function () {
    drawVisualization();
  });
});

document.getElementById('fontSizeAnimationStop').addEventListener('click', function () {
  clearInterval(fontSizeAnimationInterval);
});

document.getElementById('spiralDensityAnimationStart').addEventListener('click', function () {
  if (spiralDensityAnimationInterval) {
    clearInterval(spiralDensityAnimationInterval);
  }
  spiralDensityAnimationInterval = animateValue('spiralDensity', 'spiralDensityText', 'spiralDensityStart', 'spiralDensityEnd', 'spiralDensityStep', 'spiralDensitySpeed', function () {
    drawVisualization();
  });
});

document.getElementById('spiralDensityAnimationStop').addEventListener('click', function () {
  clearInterval(spiralDensityAnimationInterval);
});

document.getElementById('spiralType').addEventListener('change', function() {
  const spiralType = document.getElementById('spiralType').value;
  const el = document.getElementsByClassName('subdrawer')
  if (el) [...el].map(el => el.classList.add("hidden"))
  if (spiralType === 'rose') {
    document.getElementById('roseSettings').classList.remove("hidden");
  }else if (['epitrochoid', 'hypotrochoid'].includes(spiralType)) {
      document.getElementById('trochoidSettings').classList.remove("hidden");
  }
  drawVisualization()
});
document.getElementById('fontSize').addEventListener('input', function () {
  document.getElementById('fontSizeText').value = this.value;
  drawVisualization();
});
document.getElementById('fontSizeText').addEventListener('input', function () {
  document.getElementById('fontSize').value = this.value;
  drawVisualization();
});
document.getElementById('spiralDensity').addEventListener('input', function () {
  document.getElementById('spiralDensityText').value = this.value;
  drawVisualization();
});
document.getElementById('spiralDensityText').addEventListener('input', function () {
  document.getElementById('spiralDensity').value = this.value;
  drawVisualization();
});
document.getElementById('highlightWord').addEventListener('input', drawVisualization);
document.getElementById('searchButton').addEventListener('click', searchAndHighlight);
document.getElementById('saveButton').addEventListener('click', saveSVG);
document.getElementById('zoomInButton').addEventListener('click', zoomIn);
document.getElementById('zoomOutButton').addEventListener('click', zoomOut);
document.getElementById('abjadColor').addEventListener('change', drawVisualization);
document.getElementById('abjadSize').addEventListener('change', drawVisualization);
document.getElementById('abjadWordTotal').addEventListener('change', drawVisualization);

document.querySelectorAll('.controls h3').forEach(function (header) {
  header.addEventListener('click', function () {
    this.parentElement.classList.toggle('active');
  });
});

document.getElementById('roseSettingsUpdate').addEventListener('click', updateRoseSettings)
document.getElementById('trochoidSettingsUpdate').addEventListener('click', updateTrochoidSettings)