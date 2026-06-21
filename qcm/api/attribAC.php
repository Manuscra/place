<?php
header("Content-Type: application/json; charset=UTF-8");
require "../id/connect.php";

// Converts it into a PHP object
$data = json_decode($_POST["x"], False);


//Parcours des attributions Niveau<-->Activté existantes	
$nive = $connexion->query("SELECT * FROM Chap order by Name_Chap asc;"); //Niveaux existants
$acti = $connexion->query("SELECT * FROM Activite order by Name_Act asc;"); //Activites existantes

$i = 0;
foreach ($acti as $row) {
	foreach ($nive as $lign) {
		$exist = $connexion->query("SELECT * FROM Attrib_Chap WHERE (No_dChap=".$lign['No_chap']." AND No_dAct=".$row['No_Act'].");");
		if (mysqli_num_rows($exist) > 0) {
			if(!(in_array(strval($i), $data))) {
				$desassoc = $connexion->query("DELETE FROM Attrib_Chap WHERE (No_dChap=".$lign['No_chap']." AND No_dAct=".$row['No_Act'].");");
			};
		} else {
			if(in_array(strval($i), $data)) {
				$assoc = $connexion->query("INSERT INTO Attrib_Chap (No_dChap, No_dAct) VALUES(".$lign['No_chap'].", ".$row['No_Act'].");");
			};
		};
	$i+=1;
	};
};
	
?>
