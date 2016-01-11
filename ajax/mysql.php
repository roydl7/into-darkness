<?php
$mysql_server = "localhost";
$mysql_user = "intodarkness"
$mysql_pass = "intodarkness"
$mysql_db = "teknack"

$conn = new mysqli($mysql_server, $mysql_user, $mysql_pass, $mysql_db);
if ($conn -> connect_error) {
    die("E100");
} 

?>