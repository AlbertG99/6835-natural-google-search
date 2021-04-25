// Mouse actions
let mouseX = 0;
let mouseY = 0;
document.getElementById("iframe").onmousemove = function (mouseEvent) {
  mouseX = mouseEvent.clientX;
  mouseY = mouseEvent.clientY;
}
const click = function (x, y) {
  const href = document.elementFromPoint(x, y).href ? document.elementFromPoint(x, y).href : document.elementFromPoint(x, y).parentElement.href;
  if (href != undefined) window.location = href;
};

// Scroll actions
let xCoord = window.scrollX;
let yCoord = window.scrollY;
const scroll = function (amount) {
  yCoord = Math.max(Math.min(yCoord + amount, 3000), 0);
  window.scroll(xCoord, yCoord);
};

// Speech actions
const processSpeech = function (transcript) {
  console.log(transcript);

  const userSaid = function (str, commands) {
    for (let i = 0; i < commands.length; i++) {
      if (str.indexOf(commands[i]) > -1)
        return true;
    }
    return false;
  };

  let processed = false;
  if (userSaid(transcript.toLowerCase(), ['down'])) {
    scroll(100);
    processed = true;
  }
  else if (userSaid(transcript.toLowerCase(), ['up'])) {
    scroll(-100);
    processed = true;
  }
  else if (userSaid(transcript.toLowerCase(), ['click'])) {
    click(mouseX, mouseY);
    processed = true;
  }

  return processed;
};
