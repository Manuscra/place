<?php 
    function modifassoc()
    {
	require "./id/connect.php";
	
	//Parcours des tables : recuperation des donnees	
	$type = $connexion->query("SELECT * FROM Type order by No_Type asc;"); //Types existants
	$acti = $connexion->query("SELECT * FROM Activite order by Name_Act asc;"); //Activites existantes

	$affich= '<h3> Association des attributs de l\'activité</h3>';
	
	$affich.= '<hr>';	
	$affich.= '<br>';	
	$affich.= '<br>';	
	
	$affich.= '<h5>Nom de l\'activité :</h5>';
	$affich.= '<i><select id="act" name="act">';
	$affich.= '<option value="none" selected disabled hidden> ... à sélectionner dans la liste !</option>';
		foreach ($acti as $row) {
			$affich.= '<option value="'. $row['No_Act'] .'">'. $row['Name_Act'].'</option>';
		}
	$affich.= '</select></i>';

	$affich.= '<br>';	
	$affich.= '<br>';	

	$affich.= '<h5>Type de l\'activité :</h5>';
	$affich.= '<i><select id="typ" name="typ" onchange="lnkposs()">';
	$affich.= '<option value="none" selected disabled hidden> ... à sélectionner dans la liste !</option>';
		foreach ($type as $ro) {
			$affich.= '<option value="'. $ro['No_Type'] .'">'. $ro['Name_Type'].'</option>';
		}
	$affich.= '</select></i>';

	$affich.= '<br>';	
	$affich.= '<br>';
	
	$affich.= '<h5>Activité associéz à :</h5>';
	$affich.= '<i><select id="lnk" name="lnk"></select></i>';
	$affich.= '<button class="success" onclick="cachange()" style="font-size: .75em;">Ajouter</button>';

	$affich.= '<script src="./js/assoc.js"></script>';

	return $affich;
    }
?>
