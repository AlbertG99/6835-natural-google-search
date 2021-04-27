const circle = document.getElementById("circle");
const circleContainer = document.getElementById("circle-container");

// Mouse/leap actions
document.body.onmousemove = function (mouseEvent) {
  circle.setAttribute('cx', mouseEvent.clientX);
  circle.setAttribute('cy', mouseEvent.clientY);

  determineScroll();
}
const click = function () {
  const xPosition = circle.getAttribute('cx');
  const yPosition = circle.getAttribute('cy');

  const elements = document.elementsFromPoint(xPosition, yPosition);
  for (const i in elements) {
    if (elements[i] instanceof HTMLAnchorElement) {
      // window.location = elements[i].href;
      $(function () {
        $("#iframe").load(elements[i].href);
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
  xCoord = Math.max(Math.min(xCoord + amountX, 3000), 0);
  yCoord = Math.max(Math.min(yCoord + amountY, 3000), 0);
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
    click();
    processed = true;
  }
  else if (userSaid(transcript.toLowerCase(), ['back', 'return'])) {
    $(function () {
      $("#iframe").load("page/example.html");
    });
    processed = true;
  }

  return processed;
};
