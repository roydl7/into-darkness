<?php

require "mysql_config.php";

$action = $_POST['action'];
$userid = $_POST['userid'];


switch($action) {
	case "update": 	$query = "INSERT INTO `scores` VALUES (" . time() . ", '$userid', " . $_POST['value'] . ")";
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


?>