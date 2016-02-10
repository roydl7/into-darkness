$(document).ready(function () {
    $("#highscore_btn").on("click", function () {
        $("#main").animate({ 'margin-left': '-500' }, 1000, function() { 
            $(this).fadeOut(function() { 
                $("#highscores").fadeIn(1000);
            });
        });
    });
    
    $("#leaderboard_btn").on("click", function () {
        $("#main").animate({ 'margin-left': '-500' }, 1000, function() { 
            $(this).fadeOut(function() { 
                $("#leaderboard").fadeIn(1000);
            });
        });
    });
    
});