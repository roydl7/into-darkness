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
	
});

$(document).ready(function() {
	
	$("#musicmute").click(function(){
		
		if(!music.muted) {
			$(this).removeClass("unmmute").addClass("mmute");
			 music.muted = true;
		} else {
			$(this).removeClass("mmute").addClass("unmmute");
			 music.muted = false;
			
		}
	});
	
});