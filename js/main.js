const circle = document.getElementById("circle");
const circleContainer = document.getElementById("circle-container");
const voiceInput = document.getElementById("voice-input");

// Mouse/leap actions
document.body.onmousemove = function (mouseEvent) {
  circle.setAttribute('cx', mouseEvent.clientX);
  circle.setAttribute('cy', mouseEvent.clientY);

  determineScroll();
}
let currentURL = "intro.html";
$(function () {
  $("#iframe").load(currentURL);
});
let history = {};
const loadURL = (newURL) => {
  history[newURL] = currentURL;
  $("#iframe").load(newURL);
  currentURL = newURL;
  $('link[href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"]').prop('disabled', true);
}
const click = function () {
  const xPosition = circle.getAttribute('cx');
  const yPosition = circle.getAttribute('cy');

  const elements = document.elementsFromPoint(xPosition, yPosition);
  for (const i in elements) {
    if (elements[i] instanceof HTMLAnchorElement) {
      $(function () {
        const newURL = elements[i].href.replace(elements[i].baseURI, currentURL.substring(0, currentURL.lastIndexOf('/') + 1));
        loadURL(newURL);
      });
      break;
    }
  }
};
document.body.addEventListener("click", click);
Leap.loop({
  hand: function (hand) {
    circle.setAttribute('cx', hand.screenPosition()[0]);
    circle.setAttribute('cy', hand.screenPosition()[1] + 500);

    determineScroll();
  }
}).use('screenPosition', { scale: 0.6 });
// webgazer.setGazeListener(function(data, elapsedTime) {
//   if (data == null) {
//     return;
//   }
//   var xprediction = data.x;
//   var yprediction = data.y;
//   console.log(data.x, data.y);
// }).begin();

// Scroll actions
let xCoord = window.scrollX;
let yCoord = window.scrollY;
const determineScroll = function () {
  const xPosition = circle.getAttribute('cx');
  const yPosition = circle.getAttribute('cy');

  const THRESHOLD = 200;
  const SPEED = 7;
  const diffX = xPosition - window.innerWidth / 2
  const diffY = yPosition - window.innerHeight / 2
  scroll(Math.abs(diffX) > THRESHOLD ? Math.sign(diffX) * SPEED : 0, Math.abs(diffY) > THRESHOLD ? Math.sign(diffY) * SPEED : 0);
}
const scroll = function (amountX, amountY) {
  xCoord = Math.max(Math.min(xCoord + amountX, document.documentElement.scrollWidth), 0);
  yCoord = Math.max(Math.min(yCoord + amountY, document.documentElement.scrollHeight), 0);
  window.scroll(xCoord, yCoord);
};

// Speech actions
const processSpeech = function (transcript) {
  if (transcript.toLowerCase() != '') voiceInput.innerHTML = transcript.toLowerCase();

  const userSaid = function (str, commands) {
    for (let i = 0; i < commands.length; i++) {
      if (str.indexOf(commands[i]) > -1)
        return true;
    }
    return false;
  };

  let processed = false;
  if (userSaid(transcript.toLowerCase(), ['search for'])) {
    const query = transcript.toLowerCase().replace('search for', '');
    $(function () {
      const newURL = `https://www.google.com/search?q=${query.replaceAll(' ', '+')}`;
      loadURL(newURL);
    });
    processed = true;
  }
  else if (userSaid(transcript.toLowerCase(), ['down'])) {
    scroll(0, 100);
    processed = true;
  }
  else if (userSaid(transcript.toLowerCase(), ['upwards'])) {
    scroll(0, -100);
    processed = true;
  }
  else if (userSaid(transcript.toLowerCase(), ['click'])) {
    click();
    processed = true;
  }
  else if (userSaid(transcript.toLowerCase(), ['instructions'])) {
    $(function () {
      const newURL = "intro.html";
      loadURL(newURL);
    });
    processed = true;
  }
  else if (userSaid(transcript.toLowerCase(), ['back', 'return'])) {
    $(function () {
      $("#iframe").load(history[currentURL]);
      currentURL = history[currentURL];
    });
    processed = true;
  }

  return processed;
};
