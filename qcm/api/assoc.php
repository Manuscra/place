<?php 
header("Content-Type: application/json; charset=UTF-8");
require "http://127.0.0.1/site/qcm/back/id/connect.php";

// Converts it into a PHP object
$data = $_get['x']

// Mise à jour de la liste
if ($data == 4) {
	$lenum =$connexion->query("SELECT * from Img ORDER BY N_Img ASC;");
	$rows = array();
	foreach ($lenum as $row) {
		$rows[]= $row;
	}
	print json_encode($rows);
}

if ($data == '5') {
	$lenum =$connexion->query("SELECT * from Liens ORDER BY Link ASC;");
	$rows = array();
	foreach ($lenum as $row) {
		$rows[]= $row;
	}
	print json_encode($rows);
}

print json_encode($data);
?>
