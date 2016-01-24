<?php

require "mysql.php";
$action = $_POST['action'];
$email = $_POST['a_email'];
$fname = $_POST['a_fname'];
$score = $_POST['score'];
$alive = $_POST['alive'];

$query = "SELECT * FROM `into_darkness_data` WHERE `tek_emailid` = '$email'";
$result = $conn -> query($query);


switch($action) {
	case "save": 	if($result) {
						if ($result -> num_rows > 0) {
							$query = "UPDATE `into_darkness_data` SET `score` = $score, `time` = $alive, `lastplayed` = " . time() . ";";
						} else {
							$query = "INSERT INTO `into_darkness_data` VALUES ('$email', '$fname', $score, $alive, 0, " . time() . ")";
						}
					} else {
						echo $conn -> error;
					}
					if($conn -> query($query) === TRUE) {
							echo "SAVE001";				
					} else echo $conn->error;
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