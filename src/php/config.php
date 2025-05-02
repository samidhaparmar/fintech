<?php
$host = "mysql";
$username = "fin_app";
$password = "S3cureP@ssw0rd"; 
$dbname = "fintech";


// ─── PDO Connection for Prepared Statements ───────────────────────────
$dsn      = "mysql:host={$host};dbname={$dbname};charset=utf8mb4";
$pdoOpts  = [
  PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  PDO::ATTR_EMULATE_PREPARES   => false,
];
try {
    $pdo = new PDO($dsn, $username, $password, $pdoOpts);
} catch (PDOException $e) {
    die("DB (PDO) init failed: " . $e->getMessage());
}
//

$conn = mysqli_connect($host, $username, $password, $dbname);
if (!$conn) {
    die("NOT ABLE TO CONNECT WITH DATABASE");
}
// Do not echo anything here!
?>