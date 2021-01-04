<?php
?>

<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="style.css" />
    <script src="sim.js" type="module"></script>
  </head>
  <body>
    <div id="content" style="width:600px">
      <canvas id="canvas" width="600" height="450"></canvas>
    </div>
    <div id="timer">
      Current Time: <span id="time">0.000</span>s
    </div>
    <br><br>
    <button id="pause">Pause!</button>
    <button id="step">Step!</button>
    <button id="start">Start!</button>
    <br><br>
    <input type="range" min="1" max="400" value="200" class="slider" id="speed">
    <div>Simulation Speed</div>
    <br><br>
    <input type="checkbox" class="slider" id="rotate">
    <div>Rotating View</div>
    <br><br>
    <input type="checkbox" class="slider" id="random">
    <div>Randomize Velocity</div>
    <br><br>
    <input type="range" min="1" max="100" value="10" class="slider" id="gravity">
    <div>Gravity Strength</div>
  </body>
</html>

