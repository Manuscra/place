<?php 
    function modifact()
    {
	require "./id/connect.php";

	$larequete = $connexion->query("SELECT * FROM Activite order by Name_Act asc;");

	$affich= '<h3> Gestion des Activités</h3>';
	
	$affich.= '<hr>';	
	$affich.= '<br>';	
	$affich.= '<br>';	
	

	$affich.= '<h5>Nom de l\'activité à supprimer</h5>';
	$affich.= '<i><select id="act"></select></i>';
	$affich.= '<button class="warning" onclick="remove(4);" style="font-size: .75em;">Supprimer</button>';

	$affich.= '<br>';	
	$affich.= '<br>';	
	$affich.= '<br>';	
	$affich.= '<br>';	
	

	$affich.= '<h5>Nom de l\'activité à ajouter</h5>';
	$affich.= '<i><input list="fleme" id="saisie" type="text" name="nomniv" placeholder=" Saisir "><datalist id="fleme"></datalist></i>';
	$affich.= '<button class="success" onclick="add(4);" style="font-size: .75em;">Ajouter</button>';

	$affich.= '<script src="./js/ap.js"></script>';
	$affich.= '<script>';
		foreach ($larequete as $activite) {
			$affich.= 'listbox.add(new Option("'. $activite['Name_Act'] .'", "'. $activite['No_Act'] .'"), undefined);';
			$affich.= 'var option = document.createElement("option"); option.value = "'. $activite["Name_Act"] .'"; presaisie.appendChild(option);';
		}
	$affich.= '</script>';
		
	return $affich;
    }
?>
