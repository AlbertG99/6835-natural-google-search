const debouncedProcessSpeech = _.debounce(processSpeech, 500);

const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;

recognition.onresult = function (event) {
  let transcript = '';
  let hasFinal = false;
  for (var i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal)
      hasFinal = true;
    else
      transcript += event.results[i][0].transcript;
  }

  debouncedProcessSpeech(transcript);
};

recognition.onend = function (event) {
  setTimeout(function () {
    recognition.start();
  }, 1000);
};

recognition.start();
