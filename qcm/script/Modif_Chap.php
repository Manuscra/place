<?php 
    function modifchap()
    {
	require "./id/connect.php";

	$larequete = $connexion->query("SELECT * FROM Chap order by Name_Chap asc;");

	$affich= '<h3> Gestion des Chapitres</h3>';
	
	$affich.= '<hr>';	
	$affich.= '<br>';	
	$affich.= '<br>';	
	

	$affich.= '<h5>Nom du chapitre à supprimer</h5>';
	$affich.= '<i><select id="act"></select></i>';
	$affich.= '<button class="warning" onclick="remove(2);" style="font-size: .75em;">Supprimer</button>';

	$affich.= '<br>';	
	$affich.= '<br>';	
	$affich.= '<br>';	
	$affich.= '<br>';	
	

	$affich.= '<h5>Nom du chapitre à ajouter</h5>';
	$affich.= '<i><input list="fleme" id="saisie" type="text" name="nomniv" placeholder=" Saisir "><datalist id="fleme"></datalist></i>';
	$affich.= '<button class="success" onclick="add(2);" style="font-size: .75em;">Ajouter</button>';

	$affich.= '<script src="./js/ap.js"></script>';
	$affich.= '<script>';
		foreach ($larequete as $activite) {
			$affich.= 'listbox.add(new Option("'. $activite['Name_Chap'] .'", "'. $activite['No_chap'] .'"), undefined);';
			$affich.= 'var option = document.createElement("option"); option.value = "'. $activite["Name_Chap"] .'"; presaisie.appendChild(option);';
		}
	$affich.= '</script>';
	
	return $affich;
    }
?>
