<?php 
session_start();
//$_SESSION['tek_emailid'] = uniqid() . "@email.com";
//$_SESSION['tek_fname'] = "player_" . uniqid();
?>
<html>
<head>
<meta content='user-scalable=0'/>
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

<?php 
if($_GET['d']) {
		echo "<script>debugEnabled = true;</script>";
}
if($_GET['m']) {
?>
	<div id="mobi-footer">
		<button id="t-left" class="ctr-btn left">LEFT</button>
		<button id="t-right" class="ctr-btn left">RIGHT</button>
		<button id="t-fire" class="ctr-btn right">FIRE</button>
		<button id="t-acc" class="ctr-btn right">ACC</button>
	</div>
<?php
}
?>



<div id="loader"><img src="images/loader.svg"/><span id="loadertext">Connecting...</span></div>
<div id="toggle-leaderboard"><span class='lb'><span>LEADERBOARD</span></span><span id='tablearea'>Connecting...</span></div>
</body>
</html>