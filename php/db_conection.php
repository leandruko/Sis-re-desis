<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$host = 'localhost';
$dbname = 'pruebadatabase2'; //<-- agregar nombre base de datos 
$user = 'postgres'; //<-- agregar usuario de base de datos
$password = 'leandro2001'; // <-- aqui agregar la clave de base de datos, no lo coloque en .env ya que en el documento no lo especifica

try {
    $dsn = "pgsql:host=$host;port=5432;dbname=$dbname;";
    
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];

    $pdo = new PDO($dsn, $user, $password, $options);

} catch (PDOException $e) {

    die($e->getMessage());
}
?>
