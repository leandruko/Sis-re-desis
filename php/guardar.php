<?php
header('Content-Type: application/json');
require 'db_conection.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Método no permitido");
    }

    // Recoger datos del cormulario
    $codigo = $_POST['codigo'] ?? '';
    $nombre = $_POST['nombre'] ?? '';
    $bodega_id = $_POST['bodega_id'] ?? '';
    $sucursal_id = $_POST['sucursal_id'] ?? '';
    $moneda_id = $_POST['moneda_id'] ?? '';
    $precio = $_POST['precio'] ?? '';
    $materiales = $_POST['materiales_texto'] ?? '';
    $descripcion = $_POST['descripcion'] ?? '';

    //Validacion del codigo no esta repetido dentro de la base de datos
    $stmtCheck = $pdo->prepare("SELECT COUNT(*) FROM productos WHERE codigo = ?");
    $stmtCheck->execute([$codigo]);
    $existe = $stmtCheck->fetchColumn();

    if ($existe > 0) {
        // enviamos un mensaje si es que existe el codigo ya
        echo json_encode(['status' => 'error_codigo']);
        exit;
    }

    // Insertamos los datos a la base de datos 
    $sql = "INSERT INTO productos (codigo, nombre, bodega_id, sucursal_id, moneda_id, precio, materiales, descripcion) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmtInsert = $pdo->prepare($sql);
    $stmtInsert->execute([
        $codigo, 
        $nombre, 
        $bodega_id, 
        $sucursal_id, 
        $moneda_id, 
        $precio, 
        $materiales, 
        $descripcion
    ]);

    echo json_encode(['status' => 'success']);

} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>