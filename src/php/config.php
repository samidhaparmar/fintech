<?php
$host = "mysql";
$username = "samidha";
$password = "311003"; 
$dbname = "fintech";

$conn = mysqli_connect($host, $username, $password, $dbname);
if (!$conn) {
    die("NOT ABLE TO CONNECT WITH DATABASE");
}
// Do not echo anything here!
?>