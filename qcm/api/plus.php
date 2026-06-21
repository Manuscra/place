<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

header("Content-Type: application/json; charset=UTF-8");
require "../id/connect.php";

// Converts it into a PHP object
$data = json_decode($_POST["x"], False);

// Ajout d'un niveau
if ($data[0] == 1) {
	$enplus =$connexion->query("INSERT INTO Niveau (Name_Niv) VALUES('".$data[1]."');");
	$lenum =$connexion->query("SELECT No_Niv from Niveau ORDER BY No_Niv DESC LIMIT 1");
	if ($lenum) { echo($lenum->fetch_row()[0]); }
}

// Ajout d'un chapitre
if ($data[0] == 2) {
	$enplus =$connexion->query("INSERT INTO Chap (Name_Chap) VALUES('".$data[1]."');");
	$lenum =$connexion->query("SELECT No_chap from Chap ORDER BY No_chap DESC LIMIT 1");
	if ($lenum) { echo($lenum->fetch_row()[0]); }
}

// Ajout d'une image
if ($data[0] == 3) {
	$enplus =$connexion->query("INSERT INTO Img (N_Img) VALUES('".$data[1]."');");
	$lenum =$connexion->query("SELECT No_Img from Img ORDER BY No_Img DESC LIMIT 1");
	if ($lenum) { echo($lenum->fetch_row()[0]); }
}

// Ajout d'une activité
if ($data[0] == 4) {
	$enplus =$connexion->query("INSERT INTO Activite (Name_Act) VALUES('".$data[1]."');");
	//$lenum =$connexion->query("SELECT No_Act from Activite ORDER BY No_Act DESC LIMIT 1");
	//if ($lenum) { echo($lenum->fetch_row()[0]); }
}

// Ajout d'un lien
if ($data[0] == 5) {
	$enplus =$connexion->query("INSERT INTO Liens (Link) VALUES('".$data[1]."');");
	$lenum =$connexion->query("SELECT No_Lien from Liens ORDER BY No_Lien DESC LIMIT 1");
	if ($lenum) { echo($lenum->fetch_row()[0]); }
}

// Ajout d'une reponse
if ($data[0] == 6) {
	$enplus =$connexion->query("INSERT INTO Reponses (Reponse) VALUES('".$data[1]."');");
	$lenum =$connexion->query("SELECT No_Rep from Reponses ORDER BY No_Rep DESC LIMIT 1");
	if ($lenum) { echo($lenum->fetch_row()[0]); }
}
?>
