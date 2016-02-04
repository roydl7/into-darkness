var leaderboardStatus = false;
var leaderboardData;

var lt, rt, st;

$(document).ready(function() {
	
	$("#mutebtn").click(function(){
		
		if(sound_muted == false) {
			$(this).removeClass("unmute").addClass("mute");
			sound_muted  = true;
		} else {
			$(this).removeClass("mute").addClass("unmute");
			sound_muted  = false;
			
		}
	});
	
	$("#musicmute").click(function(){
		
		if(!music.muted) {
			$(this).removeClass("unmmute").addClass("mmute");
			 music.muted = true;
		} else {
			$(this).removeClass("mmute").addClass("unmmute");
			 music.muted = false;
			
		}
	});
	
	
	$("#t-right").on('mousedown', function() {
		
		rt = setInterval(function() { falcon_fa += 5; }, 20);
	}).on('mouseup', function() { clearInterval(rt); });
	
	$("#t-left").on('mousedown', function() {
		lt = setInterval(function() { falcon_fa -= 5; }, 20);
	}).on('mouseup', function() { clearInterval(lt); });
	
	$("#t-fire").on('mousedown', function() {
		if(!gameStarted) gameScreenProceed();
		at = setInterval(function() { shoot(); }, 100);
	}).on('mouseup', function() { clearInterval(at); });
	
	$("#t-acc").on('mousedown', function() {
		touch_acc = true;
	}).on('mouseup', function() { touch_acc = false; });
	
	
	
});



function showLeaderboard() {
	if(!leaderboardStatus) {
		$("#toggle-leaderboard").animate({'right': 0});
		leaderboardStatus = true;
	}
}

function hideLeaderboard() {
	if(leaderboardStatus) {
		$("#toggle-leaderboard").animate({'right': -390});
		leaderboardStatus = false;
	}
}

function updateLeaderboard(data) {
	
	$("#tablearea").html("");
	$("#tablearea").append("<table/>");
	$("#tablearea table").append("<tr><td>Rank</td><td>Name</td><td>Score</td></tr>");
	for(var i = 0; i < data.leaderboard_data.length; i++) {
		$("#tablearea table").append("<tr><td>" + (i + 1) + "</td><td>" + data.leaderboard_data[i].n + "</td><td>" + data.leaderboard_data[i].s + "</td></tr>");
	}
	
}



