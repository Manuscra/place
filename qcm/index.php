<!DOCTYPE HTML>
<html>

<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="robots" content="noindex, disallow, nofollow, noarchive">
<TITLE>My e-Space - QCM</TITLE>
<link rel="shortcut icon" href="favicon.ico" />
<link rel="stylesheet" type="text/css" href="css/picnic.css">
<link rel="stylesheet" type="text/css" href="css/pres.css">
<link rel="stylesheet" type="text/css" href="css/menu.css">
<script type="text/javascript" src="js/send.js"></script>

<?php
	// initialiser les variables
	$cal ="";
	
	// on recupere la page a afficher
	if(isset($_GET["cal"])){
		$cal = $_GET["cal"];
		
		//on switch selon la demande
		switch ($cal) {
			
			case 1:
				require("script/Modif_Act.php");
				$page = modifact();
				break;

			case 2:
				require("script/Modif_Img.php");
				$page = modifimg();
				break;

			case 3:
				require("script/Modif_Chap.php");
				$page = modifchap();
				break;

			case 4:
				require("script/Modif_Niv.php");
				$page = modifniv();
				break;

			case 5:
				require("attrib/actchapatri.php");
				$page = attribActChap();
				break;

			case 6:
				require("attrib/nivactatri.php");
				$page = attribNivAct();
				break;
				
			case 7:
				require("attrib/nivchapatri.php");
				$page = attribNivChap();
				break;
			case 8:
				require("attrib/Modif_Assoc.php");
				$page = modifassoc();
				break;
	
			case 9:
				require("script/Modif_Rep.php");
				$page = modifrep();
				break;
	
			case 10:
				require("script/Modif_Lien.php");
				$page = modiflien();
				break;

			case 11:
				require("script/Assoc_rep-act.php");
				$page = assocrepact();
				break;

			case 12:
				require("script/save.php");
				if(isset($_GET["niv"])){
					$niv = $_GET["niv"];
					$page = save($niv);
					}
				break;

			default:
				break;
		}
	}
	else {
		require("script/accueil.php");
		$page = affiche_accueil();
	}
?>

</head>

<body>

<div id="gen">
<?php
  require("id/connect.php");
  require("script/menu.php");
  affiche_menu();
    
  echo '<div id="pag" class="page">';
  echo $page;
  echo "</div>";
?>
</div>

</body>
</html>
