<?php
	// initialise la variable
	$img ="";
	
	// on recupere l image a afficher
	if(isset($_GET["img"])){
		$img = $_GET["img"];
		
		//on securise en precisant le type de retour
		header("content-type:images/png");
		
		echo file_get_contents("../suivi/navigation/fichiers/QCM/img/sh".$img.".png");
	}
?>
