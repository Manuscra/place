<?php

header("Content-Type: application/json; charset=UTF-8");
require "../id/connect.php";//ok

// Converts it into a PHP object
$data = json_decode($_POST["x"], False);//ok



	// Recupere le num de l'activite
	$No_Act = $data->Nact; //ok

	// Recupere le num en cours pour la nouvelle liste
	$encours =$connexion->query("SELECT Num_Liste_Base from Listes ORDER BY Num_Liste_Base DESC LIMIT 1;");
	if ($encours) { $Num_Liste_D = ($encours->fetch_row()[0]) + 1; }//ok

	//on garde juste les reponses
	unset($data->Nact);
	unset($data->Name);//ok
	
	//recupere les listes de reponses
	$j = 0; //Compteur de liste
	$k = 0; //Compteur des etiquettes
	
	foreach ($data as $key=> $laliste) {
		for ($i=0; $i<count($laliste); $i++) {
			$NumlistB = $Num_Liste_D+$j;
			$Numrep = $laliste[$i]->xrep;
			//->Enregistrement ds la base : Listes
			$enplus =$connexion->query("INSERT INTO Listes (Act_liste, Num_Liste_Base, Num_Liste_Act, Num_Rep) VALUES('".$No_Act."', '".$NumlistB."', '".$j."', '".$Numrep."');");
			
			$xetic = $laliste[$i]->xetiq;
			
			if ( $xetic >= 1 ) {
				
				//->Recupere dernier No_Liste dans Listes
				$encours =$connexion->query("SELECT No_Liste from Listes ORDER BY No_Liste DESC LIMIT 1;");
				if ($encours) {
					$No_Liste_D = ($encours->fetch_row()[0]);
					while ( $xetic >= 1 ) {
						$ley = $k*30;
						//->Enregistrement ds la Base : Etiquettes
						$enplus =$connexion->query("INSERT INTO Etiquettes (x, y, No_liste) VALUES('50', '".$ley."', '".$No_Liste_D."');");
						$k+=1;
						$xetic--;
					}
				}
			}
		}
		$j+=1;
	}//ok

?>
