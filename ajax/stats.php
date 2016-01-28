<?php
session_start();


require "mysql.php";
$action = $_POST['action'];

$query = "SELECT * FROM `into_darkness_data` WHERE `tek_emailid` = '" . $_SESSION['tek_emailid'] . "'";
$result = $conn -> query($query);


switch($action) {
	case "save": 	if($result) {
						$score = $_SESSION['asteroids_destroyed'];
						$alive = time() - $_SESSION['gameplay_session_start_time'];
						if ($result -> num_rows > 0) {
							$query = "UPDATE `into_darkness_data` SET `score` = $score, `time` = $alive, `lastplayed` = " . time() . ";";
						} else {
							$query = "INSERT INTO `into_darkness_data` VALUES ('" . $_SESSION['tek_emailid'] . "', '" . $_SESSION['tek_fname'] . "', $score, $alive, 0, " . time() . ")";
						}
					} else {
						echo $conn -> error;
					}
					if($conn -> query($query) === TRUE) {
							echo "SAVE001";				
					} else echo $conn->error;
					
					break;
	
	case "asteroid_update": 
					$_SESSION['asteroids_destroyed'] += $_POST['destroy_count'];
					break;
					
	case "start_gameplay_session": 
					sleep(2);
					$_SESSION['player_deaths'] = 3;
					$_SESSION['gameplay_session_start_time'] = time();
					break;
					
	case "on_death": 
					sleep(2);
					$_SESSION['player_deaths']--;
					echo json_encode(array('d' => $_SESSION['player_deaths']));
					break;					
					
					
					
}
					
					

$conn->close();
die;

/*
switch($action) {
	case "update": 	$query = "INSERT INTO `scores` VALUES ("
					if($conn -> query($query) === TRUE) {
						echo "200";
					}
					break;
	case "fetch":	$query = "SELECT `userid`, `score` FROM `scores`";
					if($conn -> query($query) === TRUE) {
						if ($result -> num_rows > 0) {
							$data = array();
							while($row = $result -> fetch_assoc()) {
								$data[] = $row;
							}
							echo json_encode($data);
						}
					}
	case "sfetch":	$query = "SELECT * FROM `scores` WHERE `userid` = " . $userid;
					if($conn -> query($query) === TRUE) {
						if($result -> num_rows) {
							data = array();
							$row = $result -> fetch_array();
							echo json_encode($data);
						}
					}
	
}



$conn->close();
*/

?>