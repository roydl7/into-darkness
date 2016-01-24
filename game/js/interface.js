$(document).ready(function() {
	
	$("#mutebtn").click(function(){
		
		if(!music.muted) {
			$(this).removeClass("unmute").addClass("mute");
			sound_muted = music.muted = true;
		} else {
			$(this).removeClass("mute").addClass("unmute");
			sound_muted = music.muted = false;
			
		}
	});
	
});