<?php 
    function modifimg()
    {
	require "./id/connect.php";

	$larequete = $connexion->query("SELECT * FROM Img order by N_Img asc;");

	$affich= '<h3> Gestion des Images</h3>';
	
	$affich.= '<hr>';	
	$affich.= '<br>';	
	$affich.= '<br>';	
	

	$affich.= "<h5>Nom de l'image à supprimer</h5>";
	$affich.= '<i><select id="act"></select></i>';
	$affich.= '<button class="warning" onclick="remove(3);" style="font-size: .75em;">Supprimer</button>';

	$affich.= '<br>';	
	$affich.= '<br>';	
	$affich.= '<br>';	
	$affich.= '<br>';	
	

	$affich.= "<h5>Nom de l'image à ajouter</h5>";
	$affich.= '<i><input list="fleme" id="saisie" type="text" name="nomniv" placeholder=" Saisir "><datalist id="fleme"></datalist></i>';
	$affich.= '<button class="success" onclick="add(3);" style="font-size: .75em;">Ajouter</button>';

	$affich.= '<script src="./js/ap.js"></script>';
	$affich.= '<script>';
		foreach ($larequete as $activite) {
			$affich.= 'listbox.add(new Option("'. $activite['N_Img'] .'", "'. $activite['No_Img'] .'"), undefined);';
			$affich.= 'var option = document.createElement("option"); option.value = "'. $activite["N_Img"] .'"; presaisie.appendChild(option);';
		}
	$affich.= '</script>';
	
	return $affich;
    }
?>
