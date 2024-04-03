export function saveImgToLocal(canvas) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', canvas.width);
    svg.setAttribute('height', canvas.height);
    svg.setAttribute('viewBox', `0 0 ${canvas.width} ${canvas.height}`);
  
    const spiralType = document.querySelector('.spiral-type').value;
    const fontSize = parseFloat(document.querySelector('.font-size').value);
    const spiralDensity = parseFloat(document.querySelector('.spiral-density').value);
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
      } else if (spiralType === 'spheres') {
        const adjustedRadius = spiralDensity;
        const layers = 7;
  
        for (let layer = 0; layer < layers; layer++) {
          const layerRadius = 8 * (layer + 2);
          const phi = Math.acos(-1 + (2 * wordIndex + 1) / words.length);
          const theta = Math.sqrt(words.length * Math.PI) * phi;
          x = centerX + layerRadius * Math.sin(phi) * Math.cos(theta) * angle;
          y = centerY + layerRadius * Math.sin(phi) * Math.sin(theta) * angle;
        }
      } else if (spiralType === 'fermat') {
        const numLoops = 20;
        const angleFer = wordIndex * ((2 * Math.PI) / numLoops);
        const raduis = Math.sqrt(angle);
        x = centerX + raduis * Math.cos(angleFer) * angle;
        y = centerY + raduis * Math.sin(angleFer) * angle;
      } else if (spiralType === 'fibonacci') {
        radius = 1;
        const growthFactor = 0.01;
        const numLoops = 1000;
        const angleIncrement = (2 * Math.PI) / numLoops;
        const petalCount = 6;
        const petalSize = 20;
        const angleF = wordIndex * angleIncrement;
        const petalAngle = angleF * petalCount;
        x = centerX + radius * Math.cos(petalAngle) * Math.cos(angleF) * angle;
        y = centerY + radius * Math.sin(petalAngle) * Math.cos(angleF) * angle;
        radius = growthFactor * Math.sqrt(wordIndex);
      } else if (spiralType === 'rose') {
        if (fontSize > 5) fontSize = 5;
        if (radius < 50) radius = 50;
        const growthFactor = 0.0006;
        const angleIncrement = 2 / 1000;
        const petalCount = 6;
        x = centerX + Math.cos(petalCount * angle * Math.PI) * Math.cos(angle * Math.PI) * radius;
        y = centerY + Math.cos(petalCount * angle * Math.PI) * Math.sin(angle * Math.PI) * radius;
        angle += angleIncrement;
        radius += growthFactor;
      } else if (spiralType === 'epitrochoid') {
        if (fontSize > 5) fontSize = 5;
        if (radius < 30) radius = 30;
        const p1 = 0.8;
        const p2 = 3;
        const d = 2.5;
        const angleIncrement = 10 / 1000;
        const growthFactor = 0.00005;
        x = centerX + (((p1 + p2) * Math.cos(angle)) - (d * Math.cos((p1 + p2) / p1 * angle))) * radius;
        y = centerY + (((p1 + p2) * Math.sin(angle)) - (d * Math.sin((p1 + p2) / p1 * angle))) * radius;
        angle += angleIncrement;
        radius += growthFactor;
      } else if (spiralType === 'hypotrochoid') {
        if (fontSize > 5) fontSize = 5;
        if (radius < 30) radius = 30;
        const p1 = 0.8;
        const p2 = 3;
        const d = 2.5;
        const angleIncrement = 10 / 1000;
        const growthFactor = 0.00005;
        x = centerX + (((p1 + p2) * Math.cos(angle)) + (d * Math.cos((p1 + p2) / p1 * angle))) * radius;
        y = centerY + (((p1 + p2) * Math.sin(angle)) - (d * Math.sin((p1 + p2) / p1 * angle))) * radius;
        angle += angleIncrement;
        radius += growthFactor;
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
      text.setAttribute('transform', `translate(${centerX + x}, ${centerY + y}) rotate(${(angle + Math.PI / 2) * 180 / Math.PI})`);
  
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