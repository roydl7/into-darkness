<?php
session_start();
sleep(1);

require "mysql.php";
$action = $_POST['action'];

$lookupQuery = "SELECT * FROM `into_darkness_data` WHERE `tek_emailid` = '" . $_SESSION['tek_emailid'] . "'";
$lookupResult = $conn -> query($lookupQuery);
if ($lookupResult -> num_rows < 1) {
	$query = "INSERT INTO `into_darkness_data` VALUES ('" . $_SESSION['tek_emailid'] . "', '" . $_SESSION['tek_fname'] . "', 0, 0, 0, " . time() . ")";
	if($conn -> query($query) === TRUE) {
		echo "USER_CREATE";				
	} else echo $conn->error;
} else {
	$query = "UPDATE `into_darkness_data` SET `lastping` = " . time() . " WHERE `tek_emailid` = '" . $_SESSION['tek_emailid'] . "';";
	$conn -> query($query);
}
						

switch($action) {
	case "save": 	if ($lookupResult -> num_rows > 0) {
						$score = $_SESSION['asteroids_destroyed'] + $_SESSION['meteors_destroyed'] * 2;
						$alive = time() - $_SESSION['gameplay_session_start_time'];
						$query = "UPDATE `into_darkness_data` SET `score` = $score, `alive` = $alive, `lastping` = " . time() . " WHERE `tek_emailid` = '" . $_SESSION['tek_emailid'] . "';";
					}
					
					if($conn -> query($query) === TRUE) {
							echo "USER_UPDATE";				
					} else echo $conn->error;
					
					break;
	
	case "asteroid_update": 
					$_SESSION['asteroids_destroyed'] += $_POST['destroy_count'];
					break;
					
	case "start_gameplay_session": 
					$_SESSION['player_deaths'] = 3;
					$_SESSION['gameplay_session_start_time'] = time();
					break;
					
	case "on_death": 
					$_SESSION['player_deaths']--;
					
					$_SESSION['meteors_destroyed'] = $_SESSION['asteroids_destroyed'] = 0;
					
					if(isset($_POST['destroyed_uids'])) {
						$_SESSION['asteroids_destroyed'] = count(array_intersect($_SESSION['asteroids_generated'], $_POST['destroyed_uids']));
					}
					
					if(isset($_POST['destroyed_muids'])) {
						$_SESSION['meteors_destroyed'] = count(array_intersect($_SESSION['meteors_generated'], $_POST['destroyed_muids']));
					}
					
					$gamedata = array(
						'd' => $_SESSION['player_deaths'], 
						's' => $_SESSION['asteroids_destroyed'] + $_SESSION['meteors_destroyed'] * 2,
						'a' => time() - $_SESSION['gameplay_session_start_time'],
						'f' => ceil(( time() - $_SESSION['gameplay_session_start_time'] ) * $_SESSION['asteroids_destroyed'])
					);
					echo json_encode($gamedata);
					break;					
					
	case "generate_asteroids":
					
					$asteroids = array();
					for($i = 0; $i < 10; $i++) {
						$asteroids[$i] = uniqid(); 
						$_SESSION['asteroids_generated'][] = $asteroids[$i];
					}
					echo json_encode($asteroids);
					break;	
					
	case "generate_meteor":
					
					$meteor = uniqid(); 
					$_SESSION['meteors_generated'][] = $meteor;
					
					echo json_encode(array("meteor" => $meteor));
					break;	
					
	case "get_stats":
					$onlineUsers = 0;
					$query = "SELECT COUNT(*) FROM `into_darkness_data` WHERE `lastping` > " . (time() - 30);
					$result = $conn -> query($query);
					if ($result -> num_rows > 0) {
						$result = $result -> fetch_array(MYSQLI_NUM);
						$onlineUsers = $result[0];
					}
					
					$userRank = 1;
					$query = "SELECT FIND_IN_SET(score, (SELECT GROUP_CONCAT(`score` ORDER BY `score` DESC) FROM `into_darkness_data`)) FROM `into_darkness_data` WHERE `tek_emailid` = '" . $_SESSION['tek_emailid'] . "';";
					$result = $conn -> query($query);
					 echo $conn->error;
					if ($result -> num_rows > 0) {
						$result = $result -> fetch_array(MYSQLI_NUM);
						$userRank = $result[0];
					}
					
					$query = "SELECT `tek_fname`, `score` FROM `into_darkness_data` ORDER BY `score` DESC";
					$result = $conn -> query($query);
					$data = array();
					while($row = $result -> fetch_assoc()) {
						$data[] = array('n' => $row['tek_fname'], 's' => $row['score']);
					}
					
					$jsonString = array(
						"online_users" => $onlineUsers,
						"user_rank" => $userRank,
						"leaderboard_data" => $data
					);
					
					echo json_encode($jsonString);
					
					break;					
}
					
	

$conn->close();
die;






?>