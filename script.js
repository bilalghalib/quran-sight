const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const controlsContainer = document.querySelector(".controls");
const btnSave = document.querySelector(".save-to");
const spiralTypeEl = document.querySelector(".spiral-type");
const fontSizeEl = document.querySelector(".font-size");
const spiralDensityEl = document.querySelector(".spiral-density");
const highlightWordEl = document.querySelector(".highlight-word");
let quranText = "";

class App {

  roseMinimumRadius = 50;
  roseGrowthFactor = 0.0006;
  roseAngleStep = 0.0006;
  rosePetalCount = 6;

  epitrochoidMinimumRadius = 50;
  epitrochoidGrowthFactor = 0.006;
  epitrochoidAngleStep = 0.006;
  epitrochoidInnerRadii = 0.8;
  epitrochoidOuterRadii = 3;
  epitrochoidDistance = 2.5;

  hypotrochoidMinimumRadius = 50;
  hypotrochoidGrowthFactor = 0.006;
  hypotrochoidAngleStep = 0.006;
  hypotrochoidInnerRadii = 0.8;
  hypotrochoidOuterRadii = 3;
  hypotrochoidDistance = 2.5;

  constructor() {
    this._quranFetching();
    btnSave.addEventListener("click", this._saveImgToLocal.bind(this));
    controlsContainer.addEventListener("change", this._updateControlAndVisual.bind(this));
  }

  _saveImgToLocal() {
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "quran_spiral.png";
    link.click();
  }

  _updateControlAndVisual() {
    const spiralType = spiralTypeEl.value;

    const subControls = document.getElementsByClassName(".sub-controls")
    for (let ctrl of subControls) ctrl.style.display = 'none'

    if (spiralType === "rose") {
      document.querySelector(".rose-controls").style.display = 'flex'
      this.roseMinimumRadius = +document.querySelector(".roseMinimumRadius").value;
      this.roseGrowthFactor = +document.querySelector(".roseGrowthFactor").value;
      this.roseAngleStep = +document.querySelector(".roseAngleStep").value;
      this.rosePetalCount = +document.querySelector(".rosePetalCount").value;
    } else if (spiralType === "epitrochoid") {
      document.querySelector(".epitrochoid-controls").style.display = 'flex'
      this.epitrochoidMinimumRadius = +document.querySelector(".epitrochoidMinimumRadius").value;
      this.epitrochoidGrowthFactor = +document.querySelector(".epitrochoidGrowthFactor").value;
      this.epitrochoidAngleStep = +document.querySelector(".epitrochoidAngleStep").value;
      this.epitrochoidInnerRadii = +document.querySelector(".epitrochoidInnerRadii").value;
      this.epitrochoidOuterRadii = +document.querySelector(".epitrochoidOuterRadii").value;
      this.epitrochoidDistance = +document.querySelector(".epitrochoidDistance").value;
    } else if (spiralType === "hypotrochoid") {
      document.querySelector(".hypotrochoid-controls").style.display = 'flex'
      this.hypotrochoidMinimumRadius = +document.querySelector(".hypotrochoidMinimumRadius").value;
      this.hypotrochoidGrowthFactor = +document.querySelector(".hypotrochoidGrowthFactor").value;
      this.hypotrochoidAngleStep = +document.querySelector(".hypotrochoidAngleStep").value;
      this.hypotrochoidInnerRadii = +document.querySelector(".hypotrochoidInnerRadii").value;
      this.hypotrochoidOuterRadii = +document.querySelector(".hypotrochoidOuterRadii").value;
      this.hypotrochoidDistance = +document.querySelector(".hypotrochoidDistance").value;
    }

    this._drawVisualization()
  }

  _drawVisualization() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const spiralType = spiralTypeEl.value;
    const spiralDensity = +spiralDensityEl.value;
    const highlightWord = this._safeKeywordString(highlightWordEl.value);
    let fontSize = +fontSizeEl.value;
    
    //remove copyright block from quran text
    let quranLines = quranText.split('\n').slice(0, 6237)
    quranText = quranLines.join('\n')

    ctx.font = fontSize + "px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let radius = 10;
    let angle = 0;
    const angleIncrement = 0.1;
    let x, y, char;
    let i = 0
    while (i < quranText.length) {

      let nextSpacePos = this._searchWordPosition(/\s/, quranText, i)

      char = quranText.slice(i, nextSpacePos);

      if (spiralType === "logarithmic") {
        x = centerX + Math.cos(angle) * radius;
        y = centerY + Math.sin(angle) * radius;
        radius += 0.1;
      } else if (spiralType === "archimedean") {
        x = centerX + Math.cos(angle) * angle;
        y = centerY + Math.sin(angle) * angle;
      } else if (spiralType === "goldenMean") {
        const goldenAngle = Math.PI * (3 - Math.sqrt(5));
        x = centerX + Math.cos(angle) * Math.sqrt(angle);
        y = centerY + Math.sin(angle) * Math.sqrt(angle);
        angle += goldenAngle;
      } else if (spiralType === "spheres") {
        const adjustedRadius = spiralDensity;

        const layers = 7; // Number of layers of spheres

        for (let layer = 0; layer < layers; layer++) {
          const layerRadius = 8 * (layer + 2); // Increase radius for each layer

          const phi = Math.acos(-1 + (2 * i + 1) / quranText.length);
          const theta = Math.sqrt(quranText.length * Math.PI) * phi;

          x = centerX + layerRadius * Math.sin(phi) * Math.cos(theta) * angle;
          y = centerY + layerRadius * Math.sin(phi) * Math.sin(theta) * angle;
        }
      } else if (spiralType === "fermat") {
        const numLoops = 20; //number of loops for the fermat's spiral
        // Calculate the angle for the fermat's spiral
        const angleFer = i * ((2 * Math.PI) / numLoops);
        // Calculate the radius for the fermat's spiral
        const raduis = Math.sqrt(angle);
        // Calculate the cooordinates for the fermats spiral
        x = centerX + radius * Math.cos(angleFer) * angle;
        y = centerY + radius * Math.sin(angleFer) * angle;
      } else if (spiralType === "fibonacci") {
        radius = 1;
        const growthFactor = 0.01;
        const numLoops = 1000;
        const angleIncrement = (2 * Math.PI) / numLoops;
        const petalCount = 6;
        const petaSize = 20;

        const angleF = i * angleIncrement;
        const petaAngle = angleF * petalCount;

        x = centerX + radius * Math.cos(petaAngle) * Math.cos(angleF) * angle;
        y = centerY + radius * Math.sin(petaAngle) * Math.cos(angleF) * angle;

        radius = growthFactor * Math.sqrt(i);
      } else if (spiralType === "rose") {
        if (radius < this.roseMinimumRadius) radius = this.roseMinimumRadius

        x = centerX + Math.cos(this.rosePetalCount * angle * Math.PI) * Math.cos(angle * Math.PI) * radius;
        y = centerY + Math.cos(this.rosePetalCount * angle * Math.PI) * Math.sin(angle * Math.PI) * radius;
        
        angle += this.roseAngleStep;
        radius += this.roseGrowthFactor;
      } else if (spiralType === "epitrochoid") {
        if (radius < this.epitrochoidMinimumRadius) radius = this.epitrochoidMinimumRadius;

        x = centerX + (((this.epitrochoidInnerRadii + this.epitrochoidOuterRadii) * Math.cos(angle)) - (this.epitrochoidDistance * Math.cos((this.epitrochoidInnerRadii + this.epitrochoidOuterRadii) / this.epitrochoidInnerRadii * angle))) * radius;
        y = centerY + (((this.epitrochoidInnerRadii + this.epitrochoidOuterRadii) * Math.sin(angle)) - (this.epitrochoidDistance * Math.sin((this.epitrochoidInnerRadii + this.epitrochoidOuterRadii) / this.epitrochoidInnerRadii * angle))) * radius;
        
        angle += this.epitrochoidAngleStep;
        radius += this.epitrochoidGrowthFactor;
      } else if (spiralType === "hypotrochoid") {
        if (radius < this.hypotrochoidMinimumRadius) radius = this.hypotrochoidMinimumRadius;

        x = centerX + (((this.hypotrochoidInnerRadii + this.hypotrochoidOuterRadii) * Math.cos(angle)) - (this.hypotrochoidDistance * Math.cos((this.hypotrochoidInnerRadii + this.hypotrochoidOuterRadii) / this.hypotrochoidInnerRadii * angle))) * radius;
        y = centerY + (((this.hypotrochoidInnerRadii + this.hypotrochoidOuterRadii) * Math.sin(angle)) - (this.hypotrochoidDistance * Math.sin((this.hypotrochoidInnerRadii + this.hypotrochoidOuterRadii) / this.hypotrochoidInnerRadii * angle))) * radius;
        
        angle += this.hypotrochoidAngleStep;
        radius += this.hypotrochoidGrowthFactor;
      }
      
      const compareChar = this._safeKeywordString(char)
      if (highlightWord === compareChar) {
        ctx.fillStyle = "#ff0000";
        ctx.font = "bold " + fontSize + "px Arial";
        ctx.fillText(char, x, y);
      } else {
        ctx.fillStyle = "#000000";
        ctx.font = fontSize + "px Arial";
        ctx.fillText(char, x, y);
      }

      angle += angleIncrement / spiralDensity;

      i += char.length + 1;
    }
  }

  _safeKeywordString(str) {
    //remove all harakat and space from string
    const compareStr = new RegExp(/[\u0617-\u061A\u064B-\u0652\s]/, 'ig')
    return str.replaceAll(compareStr, '')
  }

  _searchWordPosition(regexp, haystack, startIndex) {
    const nextSearch = haystack.substring(startIndex)
    const nextPos = nextSearch.search(regexp) + startIndex
    return nextPos
  }

  async _quranFetching() {
    // Load the Quranic text from a plain text file
    try {
      const response = await fetch("quran.txt");
      const text = await response.text();
      quranText = text;
      this._updateControlAndVisual();
    } catch (error) {
      console.error("Error loading Quranic text:", error.message);
    }
  }
}

const app = new App();
