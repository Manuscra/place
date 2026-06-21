<?php
header("Content-Type: application/json; charset=UTF-8");
require "../id/connect.php";

// Converts it into a PHP object
$data = json_decode($_POST["x"], False);


//Parcours des attributions Niveau<-->Activté existantes	
$nive = $connexion->query("SELECT * FROM Niveau order by No_Niv asc;"); //Niveaux existants
$acti = $connexion->query("SELECT * FROM Activite order by Name_Act asc;"); //Activites existantes

$i = 0;
foreach ($acti as $row) {
	foreach ($nive as $lign) {
		$exist = $connexion->query("SELECT * FROM Act_Attrib WHERE (No_Niv_Attrib=".$lign['No_Niv']." AND No_Act_Attrib=".$row['No_Act'].");");
		if (mysqli_num_rows($exist) > 0) {
			if(!(in_array(strval($i), $data))) {
				$desassoc = $connexion->query("DELETE FROM Act_Attrib WHERE (No_Niv_Attrib =".$lign['No_Niv']." AND No_Act_Attrib=".$row['No_Act'].");");
			};
		} else {
			if(in_array(strval($i), $data)) {
				$assoc = $connexion->query("INSERT INTO Act_Attrib (No_Niv_Attrib, No_Act_Attrib) VALUES(".$lign['No_Niv'].", ".$row['No_Act'].");");
			};
		};
	$i+=1;
	};
};
	
?>
