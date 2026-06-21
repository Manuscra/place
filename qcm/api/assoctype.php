<?php
header("Content-Type: application/json; charset=UTF-8");
require "../id/connect.php";

// Converts it into a PHP object
$data = json_decode($_POST["x"], False);

$maj1 =$connexion->query("UPDATE Activite set Type_Act='".$data[1]."' WHERE No_Act='".$data[0]."';");
			
if ($data[1] == 1) {
	$maj2 =$connexion->query("UPDATE Activite set No_dImg='".$data[2]."' WHERE No_Act='".$data[0]."';");
	$maj3 =$connexion->query("UPDATE Liens set No_dAct='0' WHERE No_dAct='".$data[0]."';");
}

if ($data[1] == 2) {
	$maj4 =$connexion->query("UPDATE Liens set No_dAct='".$data[0]."' WHERE No_Lien='".$data[2]."';");
	$maj1 =$connexion->query("UPDATE Activite set No_dImg='0' WHERE No_Act='".$data[0]."';");
}

?>
