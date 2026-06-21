<?php

header("Content-Type: application/json; charset=UTF-8");
require "../id/connect.php";

// Converts it into a PHP object
$data = json_decode($_POST["x"], False);

// Liste les activites
if ($data[0] == 1) {
	$lenum =$connexion->query("SELECT No_Act, Name_Act from Activite WHERE Type_Act ='1' ORDER BY Name_Act ASC;");
	if ($lenum) { 
		$rows = array();
		foreach ($lenum as $row) {
			$rows[]= $row;
		}
		print json_encode($rows);
	}
}

// Liste les reponses
if ($data[0] == 2) {
	$lenum =$connexion->query("SELECT No_Rep, Reponse from Reponses ORDER BY Reponse ASC;");
	if ($lenum) { 
		$rows = array();
		foreach ($lenum as $row) {
			$rows[]= $row;
		}
		print json_encode($rows);
	}
}
?>
