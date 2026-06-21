<?php 
    function save($niv)
    {
	switch ($niv) {
	
		case '6ème';
			$affich = exec('python3 ~/cgi-bin/apiact.py 1');
			break;

		case '5ème';
			$affich = exec('python3 ~/cgi-bin/apiact.py 2');
			break;

		case '4ème';
			$affich = exec('python3 ~/cgi-bin/apiact.py 3');
			break;

		case '3ème';
			$affich = exec('python3 ~/cgi-bin/apiact.py 4');
			break;

		default:
			$cl ="AUCUNEMENT";
			break;

	};
	
	$affich.= '<h3>Mise à jour '.$niv.' effectuée.</h3>';
	
	return $affich;
    }
?>
