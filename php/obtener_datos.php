<?php
header('Content-Type: application/json');
require 'db_conection.php';

$action = $_GET['action'] ?? '';

try {
    if ($action === 'init') {
        
        // obtenemos las bodegas desde la base de datos
        $stmt = $pdo->query("SELECT id, nombre FROM bodegas ORDER BY nombre ASC");
        $bodegas = $stmt->fetchAll();

        // obtenemos las monedas desde la base de datos
        $stmt = $pdo->query("SELECT id, nombre FROM monedas ORDER BY nombre ASC");
        $monedas = $stmt->fetchAll();

        echo json_encode([
            'bodegas' => $bodegas,
            'monedas' => $monedas
        ]);

    } elseif ($action === 'get_sucursales' && isset($_GET['bodega_id'])) {
        
        $bodega_id = $_GET['bodega_id'];
        
        $stmt = $pdo->prepare("SELECT id, nombre FROM sucursales WHERE bodega_id = ? ORDER BY nombre ASC");
        $stmt->execute([$bodega_id]);
        $sucursales = $stmt->fetchAll();

        echo json_encode($sucursales);

    } else {
        echo json_encode(['error' => 'Acción no válida']);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>