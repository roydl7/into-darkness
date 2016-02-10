<?php

?>
<html>
<head>
	<link rel="stylesheet" href="css/home.css"></link>
	<script src="js/jquery-2.1.4.min.js"></script>
	<style>
	.closebtn {
		margin: auto; 
		display:block; 
		width:100px; 
		border-radius: 10px; 
		background: teal;
		cursor: pointer;
		font-family: Arial;
		color: black;
		padding: 5px;
		text-align: center;
		font-weight: bold;
		opacity: 0.5;
		transition: 0.5s;
	}
	.closebtn:hover {
		background: yellow;
	}
	</style>
	<script>
	function story() {
		/*var div = document.createElement('iframe');
		div.style = "width: 100%; height: 100%; position: fixed; z-Index: 100; margin-top: 100; left: 0; display: none;";
		div.src = 'story';
		document.body.appendChild(div);
		
		$(div).fadeIn(1000);
		
		return false;
		*/
		$('body').fadeOut(1000, function() {
			window.location = 'story/';
		});
	}
	
	(function() {
		$.post("ajax/stats.php", { action: 'get_stats' },  function(data) {
			var theData = JSON.parse(data);
			loadlb(theData);
		});
		
		setTimeout('incscore()', 1);
		
	})();
	
	function incscore() {
		if(parseInt($('.score').attr('data-score')) > parseInt($('.score').text())) {
			var score = parseInt($('.score').text()) + 5;
			$('.score').text(++score);
			setTimeout('incscore()', 1);
		}
	}
	
	function lbinit() {
		
		$('table').animate({'margin-top': '-50'}, 1500);
		$("#leaderboarddiv").fadeIn();
		$(".option").fadeOut();
		$(".welcomenigga").fadeOut();
	}
	
	function lbend() {
		$("#leaderboarddiv").fadeOut();
		$(".option").fadeIn();
		$(".welcomenigga").fadeIn();
	}
	
	function loadlb (data) {
		
		$("#tablearea").html("");
		$("#tablearea").append("<table/>");
		$("#tablearea table").append("<tr><td>Rank</td><td>Name</td><td>Score</td></tr>");
		for(var i = 0; i < data.leaderboard_data.length; i++) {
			$("#tablearea table").append("<tr><td>" + (i + 1) + "</td><td>" + data.leaderboard_data[i].n + "</td><td>" + data.leaderboard_data[i].s + "</td></tr>");
		}
		
		$('table').css('margin-top', '100');
		
	}
	</script>
</head>
<body style="color: white;">
	<br/>
	<br/>
	<div id = "main">
		<img id = "headimg" src = "images/logo3.png"></img>
		<br/>
		<span class='welcomenigga'>
			Welcome <?php echo "#NAME"; ?>. 
			<br/>Your current high score:<br/>
			<span class='score' data-score='2343'><?php echo '0'; ?></span>
		</span>
		
		<br/><br/>
		
		<span class = "option"><a href="game.php"><img src="images/play.png"/></a></span></br> 	
		<span class = "option"><a onclick='story();' ><img src="images/story.png"></a></span></br>
		<span class = "option"><a onclick='lbinit();'><img src="images/leaderboard.png"></a></span>

		
		
	</div>
	
	
	<div id = 'leaderboarddiv' style="position:fixed; top: 30%; width: 100%; height: 50%; display: none; ">
		
		<div  style="display: block; width: 81%; margin:auto; margin-top: 20px; height: 30px; ">
		
			
		
		</div>
		<div id = 'tablearea' style="display:block; width: 80%; height: 100%; margin: auto; padding: 10px; background: transparent; opacity: 0.5; ">
			
			
			
		
		</div>
		
		<span class='closebtn' onclick='lbend()' title="Get back nigga">Close</span>
		
		
	
	</div>
	<video autoplay loop id="video" muted="true">
		<source src = "media/video.webm"></source>
	</video>
</body>
</html>