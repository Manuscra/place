<?php
header("Content-Type: application/json; charset=UTF-8");
require "../id/connect.php";

// Converts it into a PHP object
$data = json_decode($_POST["x"], False);


forEach($data as $etiq) {
	$maj =$connexion->query("UPDATE Etiquettes set x=".$etiq->x.", y=".$etiq->y." WHERE No_Etiqu=".$etiq->id.";");
}

?>
