<?php
    function affiche_accueil()
    {
    $affich= '<section class="container">';
        $affich.= '<p id="parId">';
           $affich.= '<img src="images/questions.png"\>';
        $affich.= '</p>';
    $affich.= '</section>';
    $affich.= '<script>';
	$affich.= 'function fonctionAExecuter()';
	$affich.= '{';
		$affich.= 'document.querySelector("#parId").classList.add("removed");';
	$affich.= '}';

	$affich.= 'setTimeout(fonctionAExecuter, 2000); //On attend 2 secondes avant d\'exécuter la fonction';

	$affich.= 'par.addEventListener("transitionend", () => { par.remove(); })';
    $affich.= '</script>';
    return $affich;
    
    }
?>
