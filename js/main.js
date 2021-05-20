// Extract elements from page
const circle = document.getElementById("circle");
const voiceInput = document.getElementById("voice-input");
let video = undefined;

// HISTORY
let currentURL = "intro.html";
$(function () {
  $("#iframe").load(currentURL);
});
let history = {};
let positionHistory = {};
// Function to load a given URL
const loadURL = (newURL) => {
  // Skip if same URL
  if (currentURL == newURL) return;
  // Save history
  history[newURL] = currentURL;
  positionHistory[currentURL] = { xCoord: window.scrollX, yCoord: window.scrollY };
  // Load new URL
  $("#iframe").load(newURL);
  currentURL = newURL;
  // Restore scroll position
  if (currentURL in positionHistory) resetScroll(positionHistory[currentURL].xCoord, positionHistory[currentURL].yCoord);
  else resetScroll(0, 0);
  // Disable intro page styling
  $('link[href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"]').prop('disabled', true);
};

// MOUSE/LEAP ACTIONS
let paused = false;
let videoPlaying = false;
// Function to perform click red dot position
const click = function () {
  // Extract red dot position
  const xPosition = circle.getAttribute('cx');
  const yPosition = circle.getAttribute('cy');
  // Extract elements under dot
  const elements = document.elementsFromPoint(xPosition, yPosition);
  for (const i in elements) {
    // If clicking on video
    if (currentURL == "intro.html" & elements[i] instanceof HTMLVideoElement) {
      video = elements[i];
      // Automatically unfreeze page when video ends
      video.addEventListener('ended', () => {
        videoPlaying = false;
        enableScrolling();
        voiceInput.innerHTML = '';
      }, false);
      // If video is playing, pause it and unfreeze page
      if (videoPlaying) {
        video.pause();
        enableScrolling();
        videoPlaying = false;
        voiceInput.innerHTML = '';
      }
      // If video is not playing, play it and freeze page
      else {
        video.play();
        disableScrolling();
        videoPlaying = true;
        voiceInput.innerHTML = "Tutorial is playing. Say 'stop' to stop video.";
      }
      break;
    }
    // If clicking elsewhere
    if (elements[i] instanceof HTMLAnchorElement) {
      $(function () {
        const newURL = elements[i].href.replace(elements[i].baseURI, currentURL.substring(0, currentURL.lastIndexOf('/') + 1));
        loadURL(newURL);
      });
      break;
    }
  }
};
// Move red dot and click with mouse cursor
document.body.onmousemove = function (mouseEvent) {
  circle.setAttribute('cx', mouseEvent.clientX);
  circle.setAttribute('cy', mouseEvent.clientY);

  determineScroll();
};
document.body.addEventListener("click", click);
// Move red dot with gesture
Leap.loop({
  hand: function (hand) {
    circle.setAttribute('cx', hand.screenPosition()[0]);
    circle.setAttribute('cy', hand.screenPosition()[1] + 500);

    determineScroll();
  }
}).use('screenPosition', { scale: 0.6 });

// SCROLL ACTIONS
let direction = 1;
// Function to determine how much to scroll based on red dot position
const determineScroll = function () {
  // Extract red dot position
  const xPosition = circle.getAttribute('cx');
  const yPosition = circle.getAttribute('cy');
  // Calculate and execute scroll amount
  const THRESHOLD = 150;
  const SPEED = 0.02;
  const diffX = xPosition - window.innerWidth / 2;
  const diffY = yPosition - window.innerHeight / 2;
  scroll(Math.abs(diffX) > THRESHOLD ? diffX * SPEED : 0, Math.abs(diffY) > THRESHOLD ? diffY * SPEED : 0);
};
// Functions to disable and enable normal scrolling
const disableScrolling = () => {
  const x = window.scrollX;
  const y = window.scrollY;
  window.onscroll = () => window.scrollTo(x, y);
};
const enableScrolling = () => {
  window.onscroll = () => { };
};
// Function to scroll horizontally and vertically given amounts
const scroll = function (amountX, amountY) {
  // Do not scroll if application paused or watching tutorial video
  if (paused | videoPlaying) return;
  // Ensure scrolling is within bounds and execute
  const xCoord = Math.max(Math.min(window.scrollX + amountX, document.documentElement.scrollWidth), 0);
  const yCoord = Math.max(Math.min(window.scrollY + direction * amountY, document.documentElement.scrollHeight), 0);
  window.scroll(xCoord, yCoord);
};
// Function to scroll to a given position
const resetScroll = function (xCoord, yCoord) {
  window.scroll(xCoord, yCoord);
};

// SPEECH ACTIONS
let lastAction = 0;
// Function to process speech input
const processSpeech = function (transcript) {
  transcript = transcript.toLowerCase();
  let processed = false;

  // Helper function to determine whether command is in transcript
  const userSaid = function (str, commands) {
    for (let i = 0; i < commands.length; i++) {
      if (str.indexOf(commands[i]) > -1)
        return true;
    }
    return false;
  };

  // Special cases to unpause application or stop tutorial video
  if (paused & userSaid(transcript, ['unpause', 'resume'])) {
    paused = false;
    enableScrolling();
    processed = true;
    voiceInput.innerHTML = transcript.toLowerCase();
  }
  if (videoPlaying & userSaid(transcript, ['stop'])) {
    video.pause();
    enableScrolling();
    videoPlaying = false;
    voiceInput.innerHTML = transcript.toLowerCase();
  }
  if (paused | videoPlaying) return processed; // do not proceed if application paused or video playing

  if (Date.now() < lastAction + 1000) return false; // ensure that command is not duplicate
  if (transcript != '') voiceInput.innerHTML = transcript; // display command to user if not empty

  // Cases to handle available voice commands
  if (userSaid(transcript, ['search for'])) {
    const query = transcript.substring(transcript.indexOf('search for')).replace('search for', '');
    $(function () {
      const newURL = `https://www.google.com/search?q=${query.replaceAll(' ', '+')}`;
      loadURL(newURL);
    });
    processed = true;
  }
  else if (userSaid(transcript, ['down'])) {
    scroll(0, 100);
    processed = true;
  }
  else if (userSaid(transcript, ['upwards'])) {
    scroll(0, -100);
    processed = true;
  }
  else if (userSaid(transcript, ['click', 'open', 'select'])) {
    click();
    processed = true;
  }
  else if (userSaid(transcript, ['instructions'])) {
    $(function () {
      const newURL = "intro.html";
      loadURL(newURL);
    });
    resetScroll(0, 0);
    processed = true;
  }
  else if (userSaid(transcript, ['reverse'])) {
    direction = direction * (-1);
    processed = true;
  }
  else if (userSaid(transcript, ['back', 'return'])) {
    $(function () {
      // Save scroll position history
      positionHistory[currentURL] = { xCoord: window.scrollX, yCoord: window.scrollY };
      // Load new URL
      $("#iframe").load(history[currentURL]);
      currentURL = history[currentURL];
      // Restore scroll position
      if (currentURL in positionHistory) resetScroll(positionHistory[currentURL].xCoord, positionHistory[currentURL].yCoord);
      else resetScroll(0, 0);
    });
    processed = true;
  }
  else if (userSaid(transcript, ['pause'])) {
    paused = true;
    disableScrolling();
    processed = true;
    voiceInput.innerHTML = "Application is paused. Say 'unpause' or 'resume' to resume.";
  }

  if (processed) lastAction = Date.now();
  return processed;
};
