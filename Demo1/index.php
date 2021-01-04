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
  </body>
</html>

