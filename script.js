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
  constructor() {
    this._quranFetching();
    btnSave.addEventListener("click", this._saveImgToLocal);
    controlsContainer.addEventListener("change", this._drawVisualization);
  }

  _saveImgToLocal() {
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "quran_spiral.png";
    link.click();
  }
  _drawVisualization() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const spiralType = spiralTypeEl.value;
    const fontSize = +fontSizeEl.value;
    const spiralDensity = +spiralDensityEl.value;
    const highlightWord = highlightWordEl.value;

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
    for (let i = 0; i < quranText.length; i++) {
      char = quranText[i];

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
      }
      if (
        highlightWord &&
        quranText.slice(i, i + highlightWord.length) === highlightWord
      ) {
        ctx.font = "bold " + fontSize + "px Arial";
        ctx.fillText(char, x, y);
        i += highlightWord.length - 1;
      } else {
        ctx.font = fontSize + "px Arial";
        ctx.fillText(char, x, y);
      }

      angle += angleIncrement / spiralDensity;
    }
  }

  async _quranFetching() {
    // Load the Quranic text from a plain text file
    try {
      const response = await fetch("quran.txt");
      const text = await response.text();
      quranText = text;
      this._drawVisualization();
    } catch (error) {
      console.error("Error loading Quranic text:", error.message);
    }
  }
}

const app = new App();
