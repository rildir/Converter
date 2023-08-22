const textareaElement = document.querySelector("textarea");
const buttonElement = document.querySelector("button");

let synth = window.speechSynthesis;
let utterance;

const textToSpeech = () => {
  const text = textareaElement.value;

  if (!synth.speaking && text) {
    utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
    buttonElement.innerText = "Pause";
    sessionStorage.setItem("isSpeaking", "true");
  } else if (synth.speaking && synth.paused) {
    synth.resume();
    buttonElement.innerText = "Pause";
  } else if (synth.speaking) {
    synth.pause();
    buttonElement.innerText = "Resume";
  } else {
    buttonElement.innerText = "Speak";
  }
};

window.addEventListener("beforeunload", () => {
  if (synth.speaking) {
    sessionStorage.setItem("isSpeaking", "true");
    synth.cancel();
  }
});

window.addEventListener("load", () => {
  const storedIsSpeaking = sessionStorage.getItem("isSpeaking");
  if (storedIsSpeaking === "true") {
    sessionStorage.removeItem("isSpeaking");
    textToSpeech();
  }
});

textareaElement.addEventListener("input", () => {
  if (!textareaElement.value) {
    if (synth.speaking) {
      synth.cancel();
    }
    buttonElement.innerText = "Speak";
    sessionStorage.removeItem("isSpeaking");
  }
});

buttonElement.addEventListener("click", textToSpeech);

const clearButton = document.getElementById("clearButton");

clearButton.addEventListener("click", () => {
  textareaElement.value = "";
  if (synth.speaking) {
    synth.cancel();
  }
  buttonElement.innerText = "Speak";
  sessionStorage.removeItem("isSpeaking");
});

const copyButton = document.getElementById("copyButton");
const textToCopy = document.querySelector("p").innerText;
const textCopied = document.getElementById("textCopied");

copyButton.addEventListener("click", () => {
  const textarea = document.createElement("textarea");
  textarea.value = textToCopy;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  textCopied.innerText = "Text Copied!";
});
