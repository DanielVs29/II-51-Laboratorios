<?php
include 'db.php';
// Obtener datos del formulario
$nombre = trim($_POST['nombre'] ?? '');
$apellido = trim($_POST['apellido'] ?? '');
$fecha_nacimiento = trim($_POST['fecha_nacimiento'] ?? '');
$correo = trim($_POST['correo'] ?? '');
$accion = $_GET['accion'] ?? '';

// CREATE - READ - UPDATE - DELETE

// Acción insertar
if (isset($accion) && $accion === 'insertar') {
  // Validaciones básicas
  $errores = []; // Array para almacenar errores de validación
  if ($nombre === '')  $errores[] = 'El nombre es obligatorio.';
  if ($apellido === '') $errores[] = 'El apellido es obligatorio.';
  if ($fecha_nacimiento === '') $errores[] = 'La fecha de nacimiento es obligatoria.';
  if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) $errores[] = 'Correo inválido.';
  if ($correo === '') $errores[] = 'El correo es obligatorio.';
 
  if (count($errores) > 0) {
    foreach ($errores as $err) {
      echo "<p style='color:red;'>$err</p>";
    }
    echo "<p><a href='index.php'>Volver</a></p>";
    exit;
  }
 
  // Insertar en la base de datos
  $sql  = "INSERT INTO alumnos (nombre, apellido, fecha_nacimiento, correo) VALUES (:nombre, :apellido, :fecha_nacimiento, :correo)";
  $stmt = $pdo->prepare($sql);
  $stmt->execute([
    ':nombre' => $nombre,
    ':apellido' => $apellido,
    ':fecha_nacimiento' => $fecha_nacimiento,
    ':correo' => $correo
    ]);
 
  header('Location: index.php');
  exit;
}
 
 
// Acción actualizar - no se toca no sirve
if (isset($accion) && $accion === 'actualizar' && isset($_GET['id'])) {
  $id = $_GET['id'];
  $sql = "UPDATE alumnos SET nombre=:nombre, correo=:correo WHERE id=:id";
  $stmt = $pdo->prepare($sql);
  $stmt->execute([':nombre' => $nombre, ':correo' => $correo, ':id' => $id]);
  header("Location: index.php");
}
 
// Acción eliminar
if (isset($accion) && $accion === 'eliminar' && isset($_GET['id'])) {
  $id = $_GET['id'];
  $sql = "DELETE FROM alumnos WHERE id = :id";
  $stmt = $pdo->prepare($sql);
  $stmt->execute([':id' => $id]);
  header('Location: index.php');
  exit;
}
?>