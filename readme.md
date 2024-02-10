<p align="center">
  <img src="src/images/logos/small_logo.png"/>
</p>

# ❄️ Retro Ski game
Welcome on a small game dev project.<br>
Put your skis and let's race some randomly generated alpine ski tracks with your friends.

## 💻 Demo
<a href="https://une-entreprise.ch/retroski">Play RetroSki</a>

## 🎮 Controls
### During the race
<table>
  <tr>
    <th>Action</th>
    <th align="left">⌨️ Keyboard</th>
    <th align="left">🎮 Gamepad</th>
    <th align="left">📱 Touch</th>
  </tr>
  <tr>
    <td>Start skiing (1x)</td>
    <td><img src="src/images/icons/keyboard_arrow_up.png" valign="bottom"/></td>
    <td><img src="src/images/icons/gamepad_a.png" valign="bottom"/></td>
    <td>Touch the screen</td>
  </tr>
  <tr>
    <td>Carving</td>
    <td><img src="src/images/icons/keyboard_arrow_left.png" valign="bottom"/><img src="src/images/icons/keyboard_arrow_right.png" valign="bottom"/></td>
    <td><img src="src/images/icons/gamepad_left_stick.png" valign="bottom"/></td>
    <td>Touch left/right</td>
  </tr>
  <tr>
    <td>Braking/Sliding</td>
    <td><img src="src/images/icons/keyboard_space.png" valign="bottom"/></td>
    <td><img src="src/images/icons/gamepad_b.png" valign="bottom"/></td>
    <td>Touch bottom</td>
  </tr>
  <tr>
    <td>Show/hide ghosts</td>
    <td><img src="src/images/icons/keyboard_g.png" valign="bottom"/></td>
    <td><img src="src/images/icons/gamepad_left_bumper.png" valign="bottom"/></td>
    <td></td>
  </tr>
  <tr>
    <td>Return to the event manager (restart the race)</td>
    <td><img src="src/images/icons/keyboard_exit.png" valign="bottom"/></td>
    <td><img src="src/images/icons/gamepad_select.png" valign="bottom"/></td>
    <td></td>
  </tr>
  <tr>
    <td>Toggle debug mode</td>
    <td><img src="src/images/icons/keyboard_d.png" valign="bottom"/></td>
    <td></td>
    <td></td>
  </tr>
</table>

### Event manager
<table>
  <tr>
    <th>Action</th>
    <th>⌨️ Keyboard</th>
    <th>🎮 Gamepad</th>
  </tr>
  <tr>
    <td>Leave the event and go back to event setup</td>
    <td><img src="src/images/icons/keyboard_exit.png" valign="bottom"/></td>
    <td><img src="src/images/icons/gamepad_select.png" valign="bottom"/></td>
  </tr>
</table>

## 📘 Gamer guide
### Event setup
Welcome to your event setup.<br>
Here you have to provide few informations before starting to ride :
1. Name of the track (if the track doesn't exist it generates a new one)<br>
<b>Note: Check one of the preloaded tracks below for your first ride</b>
2. Style of the track (Slalom, Giant slalom, Super-G or Downhill)<br>
<b>Note: This param is only applied when generating a new track.</b>
3. Name of the first player
4. Name of the second player
5. Number of races (1 to 10 is recommended)
### Event manager
This screen is the home place before and after each race.<br>
It provides informations about the current event.
### Race
You made it to the top of the hill !<br>
Now it's time to have fun and enjoy some nice carving !<br><br>
Press (1x) ⌨️<img src="src/images/icons/keyboard_arrow_up.png" valign="bottom"/>, 🎮<img src="src/images/icons/gamepad_a.png" valign="bottom"/> or 📱touch to start skiing and see you at the finish line !<br>
⚠️ Don't miss a gate or you'll receive a penalty of <b>3 seconds</b>

## 💡 Tips
### Preloaded tracks
By default the game provides 5 tracks, so you can use the same track as your friends even on a different setup.
1. <img src="https://www.kidlink.org/icons/f0-ch.gif" valign="middle"/> Davos (Giant slalom)
2. <img src="https://www.kidlink.org/icons/f0-ch.gif" valign="middle"/> Adelboden (Slalom)
3. <img src="https://www.kidlink.org/icons/f0-at.gif" valign="middle"/> Soelden (Giant slalom)
4. <img src="https://www.kidlink.org/icons/f0-ch.gif" valign="middle"/> Wengen (Super-G)
5. <img src="https://www.kidlink.org/icons/f0-ch.gif" valign="middle"/> Zermatt (Downhill)

### Different track styles
Each track style follow is own rule when generating a new track.<br>
The dynamic of the skier is also impacted by the style of the track to mimic real world differences.<br>
<b>Note: For your first rides, Giant slalom is a good style to start gaining some experience</b>

### Keep your records
RetroSki use localStorage to persist generated tracks and records.<br> 
You can easily export them and share them with friends by using the browser developper tools.

### Follow your path
By default ghost mode is activated and you can see your best times while racing<br>
<table>
  <tr>
    <th>Ghost</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><img src="src/images/icons/global_record_ghost.png" valign="bottom"/></td>
    <td>Absolute best time on the track</td>
  </tr>
  <tr>
    <td><img src="src/images/icons/event_record_ghost.png" valign="bottom"/></td>
    <td>Current event best time on the track</td>
  </tr>
</table>

## 👷‍♂️ What's next ?
<a href="roadmap.md">Draft of a roadmap</a>

## ❤️ Support the project
Be sure to enjoy your time on the mountain with us 😃<br>
Feel free to support the project 🙏 :
<a href="https://donate.stripe.com/7sIaGu2wO52K9S8aEE">Support the project via Stripe</a>

## ⚫ Developer guide
1. Run `npm install` to install dependencies
2. Run `npm run dev` to start the Vite server!
3. Have fun!
