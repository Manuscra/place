<?php
header("Content-Type: application/json; charset=UTF-8");
require "../id/connect.php";

// Converts it into a PHP object
$data = json_decode($_POST["x"], False);

// Supprime un niveau
if ($data[0] == 1) {
	$enmoins= $connexion->query("DELETE FROM Niveau WHERE (No_Niv =".$data[1].");");
}

// Supprime un chapitre
if ($data[0] == 2) {
	$enmoins= $connexion->query("DELETE FROM Chap WHERE (No_chap =".$data[1].");");
}

// Supprime une image
if ($data[0] == 3) {
	$enmoins= $connexion->query("DELETE FROM Img WHERE (No_Img =".$data[1].");");
}

// Supprime une activité
if ($data[0] == 4) {
	$enmoins= $connexion->query("DELETE FROM Activite WHERE (No_Act =".$data[1].");");
	$update =$connexion->query("UPDATE Liens set No_dAct='0' WHERE No_dAct='".$data[1]."';");
}

// Supprime un lien
if ($data[0] == 5) {
	$enmoins= $connexion->query("DELETE FROM Liens WHERE (No_Lien =".$data[1].");");
}

// Supprime une reponse
if ($data[0] == 6) {
	$enmoins= $connexion->query("DELETE FROM Reponses WHERE (No_Rep =".$data[1].");");
}

?>
