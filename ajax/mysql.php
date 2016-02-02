<?php
$mysql_server = "localhost";
$mysql_user = "root";
$mysql_pass = "";
$mysql_db = "teknack";

$conn = new mysqli($mysql_server, $mysql_user, $mysql_pass, $mysql_db);
if ($conn -> connect_error) {
    die("CONN_ERROR" . $conn -> connect_error);
} 

?>