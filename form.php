<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/error.log');

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$response = array('success' => false, 'message' => '', 'debug' => '');

// Database configuration
define('DB_SERVER', 'sql10.freesqldatabase.com');
define('DB_USERNAME', 'sql10742828');
define('DB_PASSWORD', 'gRQGPkxdJf');
define('DB_NAME', 'sql10742828');
define('DB_PORT', 3306);

try {
    // Log received data
    error_log("Received POST data: " . print_r($_POST, true));

    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        throw new Exception("Método de requisição inválido");
    }

    if (empty($_POST)) {
        $response['debug'] = "POST data is empty. Raw input: " . file_get_contents("php://input");
        throw new Exception("Nenhum dado recebido");
    }

    // Create connection with error handling
    $conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME, DB_PORT);
    
    if ($conn->connect_errno) {
        $response['debug'] = "Connection error number: " . $conn->connect_errno;
        throw new Exception("Falha na conexão: " . $conn->connect_error);
    }

    $conn->options(MYSQLI_OPT_CONNECT_TIMEOUT, 5);
    $conn->set_charset("utf8mb4");

    // Data sanitization with logging
    $nome = htmlspecialchars(trim($_POST['nome'] ?? ''), ENT_QUOTES, 'UTF-8');
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $celular = preg_replace("/[^0-9\-\(\)\/\+\s]/", "", $_POST['celular'] ?? '');
    $mensagem = htmlspecialchars(trim($_POST['mensagem'] ?? ''), ENT_QUOTES, 'UTF-8');

    error_log("Sanitized data - Nome: $nome, Email: $email, Celular: $celular");

    // Validation with detailed errors
    if (empty($nome) || strlen($nome) < 2) {
        $response['debug'] = "Nome recebido: " . $_POST['nome'] ?? 'não fornecido';
        throw new Exception("Nome inválido (mínimo 2 caracteres)");
    }
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['debug'] = "Email recebido: " . $_POST['email'] ?? 'não fornecido';
        throw new Exception("Email inválido");
    }
    if (empty($celular) || strlen($celular) < 8) {
        $response['debug'] = "Celular recebido: " . $_POST['celular'] ?? 'não fornecido';
        throw new Exception("Celular inválido (mínimo 8 dígitos)");
    }

    // Prepare and execute query with error checking
    $stmt = $conn->prepare("INSERT INTO clientes (nome, email, celular, mensagem) VALUES (?, ?, ?, ?)");
    if (!$stmt) {
        $response['debug'] = "MySQL Error: " . $conn->error;
        throw new Exception("Erro na preparação da query");
    }

    $stmt->bind_param("ssss", $nome, $email, $celular, $mensagem);
    
    if (!$stmt->execute()) {
        $response['debug'] = "Execute Error: " . $stmt->error;
        throw new Exception("Erro ao salvar os dados");
    }

    $response['success'] = true;
    $response['message'] = "Mensagem enviada com sucesso!";
    
    $stmt->close();

} catch (Exception $e) {
    $response['message'] = "Erro: " . $e->getMessage();
    error_log("Form error: " . $e->getMessage() . " | Debug: " . ($response['debug'] ?? 'No debug info'));
} finally {
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
}
