<?php
header("Content-Type: application/json; charset=UTF-8");
require "../id/connect.php";

// Converts it into a PHP object
$data = json_decode($_POST["x"], False);


//Parcours des attributions Niveau<-->Activté existantes	
$nive = $connexion->query("SELECT * FROM Niveau order by No_Niv asc;"); //Niveaux existants
$acti = $connexion->query("SELECT * FROM Chap order by Name_Chap asc;"); //Activites existantes

$i = 0;
foreach ($acti as $row) {
	foreach ($nive as $lign) {
		$exist = $connexion->query("SELECT * FROM Attrib_Niv WHERE (No_dNiv=".$lign['No_Niv']." AND No_dChap=".$row['No_chap'].");");
		if (mysqli_num_rows($exist) > 0) {
			if(!(in_array(strval($i), $data))) {
				$desassoc = $connexion->query("DELETE FROM Attrib_Niv WHERE (No_dNiv =".$lign['No_Niv']." AND No_dChap=".$row['No_chap'].");");
			};
		} else {
			if(in_array(strval($i), $data)) {
				$assoc = $connexion->query("INSERT INTO Attrib_Niv (No_dNiv, No_dChap) VALUES(".$lign['No_Niv'].", ".$row['No_chap'].");");
			};
		};
	$i+=1;
	};
};
	
?>
