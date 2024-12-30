<p align="center">
  <img src="src/assets/logos/logo.png"/>
</p>

# ❄️ Retro Ski game
Welcome to a fun, small game development project!
Put on your skis and race down randomly generated alpine ski tracks with friends.

## 💻 Play the official game
<a href="https://retro-ski.ch">RetroSki</a>

## 🎮 Controls
<table>
  <tr>
    <th>Action</th>
    <th align="left">⌨️ Keyboard</th>
    <th align="left">🎮 Gamepad</th>
    <th align="left">📱 Touch device</th>
  </tr>
  <tr>
    <td>Start riding (1x)</td>
    <td><img src="src/assets/icons/keyboard_arrow_up.png" valign="bottom"/></td>
    <td><img src="src/assets/icons/gamepad_a.png" valign="bottom"/></td>
    <td>Touch the screen</td>
  </tr>
  <tr>
    <td>Carve</td>
    <td><img src="src/assets/icons/keyboard_arrow_left.png" valign="bottom"/><img src="src/assets/icons/keyboard_arrow_right.png" valign="bottom"/></td>
    <td><img src="src/assets/icons/gamepad_left_stick.png" valign="bottom"/></td>
    <td>Touch left/right</td>
  </tr>
  <tr>
    <td>Brake / slide</td>
    <td><img src="src/assets/icons/keyboard_space.png" valign="bottom"/></td>
    <td><img src="src/assets/icons/gamepad_b.png" valign="bottom"/></td>
    <td>Touch bottom</td>
  </tr>
  <tr>
    <td>Leave the race</td>
    <td><img src="src/assets/icons/keyboard_exit.png" valign="bottom"/></td>
    <td><img src="src/assets/icons/gamepad_select.png" valign="bottom"/></td>
    <td></td>
  </tr>
  <tr>
    <td>Toggle ghosts</td>
    <td><img src="src/assets/icons/keyboard_g.png" valign="bottom"/></td>
    <td><img src="src/assets/icons/gamepad_left_bumper.png" valign="bottom"/></td>
    <td></td>
  </tr>
  <tr>
    <td>Toggle debug mode</td>
    <td><img src="src/assets/icons/keyboard_d.png" valign="bottom"/></td>
    <td></td>
    <td></td>
  </tr>
</table>

## 📘 Gamer guide
### Ride local
Set up your event here!<br>
Enter a few details to get started:<br>
1. Choose a track (or create a new one if it doesn’t exist).
2. Enter rider names.
3. Select the number of races (1 to 10).

### Ride online
1. Create or join servers with your friends
2. Ride, compete and share records with them

### Race
You’re at the top of the hill. <br>
Time to carve some turns!<br>
Press (1x) ⌨️<img src="src/assets/icons/keyboard_arrow_up.png" valign="bottom"/>, 🎮<img src="src/assets/icons/gamepad_a.png" valign="bottom"/> or 📱touch to start skiing and see you at the finish line !<br>
⚠️ Don't miss a gate or you'll receive a penalty of <b>3 seconds</b>

### Game setup
You can access to specific game setup by clicking the ⚙️ on the top right in the interface<br>
Here you can enable or disable few settings for your race:
<ul>
  <li>🔊 Sounds</li>
  <li>🧑‍🤝‍🧑 Spectators</li>
  <li>👻 Ghosts</li>
  <li>🫧 Particles (may affect performance)</li>
  <li>🌲 Decorations</li>
</ul>
You can also reset the game to default settings, restoring all tracks, ghosts, and records.

## 💡 Tips
### Different track styles
Each track style follows unique rules when generating a new track.<br> 
Track style also impacts skier dynamics, mimicking real-world conditions.<br>
<b>Note:</b> Giant Slalom is a great track style to start gaining experience!

### Keep your records
#### Local
RetroSki uses localStorage and indexedDB to save local generated tracks and records.
#### Online
Online records, ghosts, tracks and events are persisted on servers.

### Follow your path
Ghost mode is activated by default so you can view your best time as you race.<br>
<table>
  <tr>
    <th>Ghost</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><img src="src/assets/icons/global_record_ghost.png" valign="bottom"/></td>
    <td>Global best time on the track</td>
  </tr>
  <tr>
    <td><img src="src/assets/icons/event_record_ghost.png" valign="bottom"/></td>
    <td>Event best time on the track</td>
  </tr>
</table>

### Performance
RetroSki is designed to run smoothly on any modern device with an updated browser.<br>
If you encounter performance issues, try reloading the game first.<br>
For further performance improvements, consider disabling particles and other game objects in the game settings.

### Crash
If the game crashes, try resetting and erasing all content via the game setup menu to reload the original content.

## 👷‍♂️ What's next ?
<a href="roadmap.md">Draft of a roadmap</a>

## ❤️ Support the project
Be sure to enjoy your time on the mountain with us 😃<br>
Feel free to support the project 🙏 :
<a href="https://donate.stripe.com/7sIaGu2wO52K9S8aEE">Support the project via Stripe</a>

## ⚫ Developer guide
1. Run `yarn install` to install dependencies
2. Run `yarn start` to start in local!
3. Have fun!
