<?php 
session_start();
$_SESSION['tek_emailid'] = uniqid() . "@email.com";
$_SESSION['tek_fname'] = "player_" . uniqid();
?>
<html>
<head>
<link rel="stylesheet" href="game/css/style.css"></link>
<script src="js/jquery-2.1.4.min.js"></script>
<script src="game/js/core.js"></script>
<script src="game/js/interface.js"></script>
<title>Into Darkness</title>

</head>
<body>
<canvas id="game"></canvas>
<div id="cv-footer">
	<div id="mutebtn" class="cv-footer-btn unmute"></div>
	<div id="musicmute" class="music-btn unmmute"></div>
</div>
<div id="loader"><img src="images/loader.svg"/><span id="loadertext">Connecting...</span></div>
<div id="toggle-leaderboard"><span class='lb'><span>LEADERBOARD</span></span><span id='tablearea'>Connecting...</span></div>
</body>
</html>