# Natural Google Search

## About
Developed by Albert Gerovitch

Final Submission Video: https://youtu.be/RyigF-0yCYc

## File Explanation
- `css`
  -  `styles.css`: styling for most page components
- `js`
  - `main.js`: primary application code with all logic
  - `setupSpeech.js`: helper code to configure the Web Speech API
- `lib`
  - `jquery.min.js`: jQuery JavaScript library
  - `leap-plugins.min.js` and `leap.min.js`: Leap Motion sensor libraries
  - `underscore.min.js`: Underscore.js JavaScript library
- `video`
  - `TutorialVideo.mp4`: video tutorial embedded on instructions page
- `index.html`: primary page that loads files and displays content
- `intro.html`: instructions page that is displayed to the user first

## Running Instructions
**Requirements:** macOS computer with Chrome installed (preferred), Leap Motion sensor, Python 3 installation
1. Clone this GitHub repository onto your computer (https://github.com/AlbertG99/6835-natural-google-search)
2. Connect the Leap Motion sensor
3. Launch a separate instance of Chrome with specific flags from Terminal (on Mac): 
```
open -na Google\ Chrome --args --user-data-dir=/tmp/temporary-chrome-profile-dir --disable-web-security --use-fake-ui-for-media-stream --autoplay-policy=no-user-gesture-required
```
4. Navigate to the code directory in Terminal and start the application with the following command:
```
python3 -m http.server
```
5. Find the application at http://0.0.0.0:8000/ in the separate Chrome instance
