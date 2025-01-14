// organizar as constantes
const canvas = document.querySelector(".canvas");
const inputSize = document.querySelector(".input-size");
const inputColor = document.querySelector(".input-color");
const usedColors = document.querySelector(".used-colors");
const buttonSave = document.querySelector(".button-save");
const resize = document.querySelector(".resize");
const main = document.querySelector("main");

const MIN_CanvaSize = 4;

let isPainting = false;

let isResizing = false;

const createElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};

const setPixelColor = (pixel) => {
  pixel.style.backgroundColor = inputColor.value;
};

const createPixel = () => {
  const pixel = createElement("div", "pixel");

  pixel.addEventListener("mousedown", () => setPixelColor(pixel));
  //lógica para que enquanto o mouse fique precionado o quadrados por onde ele passar sejam pintados.
  pixel.addEventListener("mouseover", () => {
    if (isPainting) setPixelColor(pixel);
  });

  return pixel;
};

const loadCanvas = () => {
  const length = inputSize.value;

  canvas.innerHTML = ""; //faz a limpeza do canva

  for (let i = 0; i < length; i += 1) {
    const row = createElement("div", "row");

    for (let j = 0; j < length; j += 1) {
      row.append(createPixel());
    }

    canvas.append(row);
  }
};

const updateCanva = () => {
  if (inputSize.value >= MIN_CanvaSize) {
    loadCanvas();
  }
};

const changeColor = () => {
  const button = createElement("button", "button-color");
  const currentColor = inputColor.value;

  button.style.backgroundColor = currentColor;
  button.setAttribute("data-color", currentColor);
  button.addEventListener("click", () => (inputColor.value = currentColor));

  const savedColors = Array.from(usedColors.children);

  const validateColor = (btn) => btn.getAttribute("data-color") != currentColor;

  if (savedColors.every(validateColor)) {
    usedColors.append(button);
  }
};

const resizeCanvas = (cursorPositionX) => {
  if (!isResizing) return;

  const canvasOffSet = canvas.getBoundingClientRect().left;
  const width = `${cursorPositionX - canvasOffSet - 20}px`;

  canvas.style.maxWidth = width;
  resize.style.height = width;
};

const saveCanvasImg = () => {
  html2canvas(canvas, {
    onrendered: (img) => {
      const image = img.toDataURL("image/png");
      const link = createElement("a");

      link.href = image;
      link.download = "pixelart.png";

      link.click();
    },
  });
};

canvas.addEventListener("mousedown", () => (isPainting = true));
canvas.addEventListener("mouseup", () => (isPainting = false));

// lógicas para executar a mudança de tamanho do canva
resize.addEventListener("mousedown", () => (isResizing = true));
main.addEventListener("mouseup", () => (isResizing = false));
main.addEventListener("mousemove", ({ clientX }) => resizeCanvas(clientX));

inputSize.addEventListener("change", updateCanva);
inputColor.addEventListener("change", changeColor);

buttonSave.addEventListener("click", saveCanvasImg);

loadCanvas();
