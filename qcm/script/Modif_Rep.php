<?php 
    function modifrep()
    {
	require "./id/connect.php";

	$larequete = $connexion->query("SELECT * FROM Reponses order by Reponse asc;");

	$affich= '<h3> Gestion des Réponses</h3>';
	
	$affich.= '<hr>';	
	$affich.= '<br>';	
	$affich.= '<br>';	
	

	$affich.= '<h5>Nom de la réponse à supprimer</h5>';
	$affich.= '<i><select id="act"></select></i>';
	$affich.= '<button class="warning" onclick="remove(6);" style="font-size: .75em;">Supprimer</button>';

	$affich.= '<br>';	
	$affich.= '<br>';	
	$affich.= '<br>';	
	$affich.= '<br>';	
	

	$affich.= '<h5>Nom de la réponse à ajouter</h5>';
	$affich.= '<i><input list="fleme" id="saisie" type="text" name="nomniv" placeholder=" Saisir "><datalist id="fleme"></datalist></i>';
	$affich.= '<button class="success" onclick="add(6);" style="font-size: .75em;">Ajouter</button>';

	$affich.= '<script src="./js/ap.js"></script>';
	$affich.= '<script>';
		foreach ($larequete as $activite) {
			$affich.= 'listbox.add(new Option("'. $activite['Reponse'] .'", "'. $activite['No_Rep'] .'"), undefined);';
			$affich.= 'var option = document.createElement("option"); option.value = "'. $activite["Reponse"] .'"; presaisie.appendChild(option);';
		}
	$affich.= '</script>';
		
	return $affich;
    }
?>
