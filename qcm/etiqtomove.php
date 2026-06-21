<?php
function move_act($act)
{
	$affich = exec('python3 ~/cgi-bin/act.py ' . $act);
	return $affich;
}
?>

<!DOCTYPE html>
<html>

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta name="robots" content="noindex, disallow, nofollow, noarchive">
	<TITLE>My e-Space - QCM</TITLE>
	<link rel="shortcut icon" href="https//duss.alwaysdata.net/suivi/qcm/back/favicon.ico" />

	<script language="JavaScript" src="js/send.js"></script>
	<script language="JavaScript" src="js/move.js"></script>
	<link href="css/move.css" rel="stylesheet" type="text/css" />

	<?php
	// initialiser les variables
	$act = "";

	// on recupere l activite a afficher
	if (isset($_POST["act"])) {
		$act = $_POST["act"];
	}
	?>
</head>

<body>
	<?php
	require "./id/connect.php";
	$larequete = $connexion->query("SELECT * FROM Activite WHERE Type_Act='1' order by Name_Act asc;");

	// Init attribut selected de la liste déroulante
	$selected = '';

	echo '<div id="column1">';
	// Parcours des resultats
	echo '<form action="etiqtomove.php" method="post">';
	echo '<select name="act" onchange="this.form.submit();">';
	echo '<option selected> Activités </option>', "\n";
	foreach ($larequete as $activite) {
		echo "\t", '<option value="', $activite['No_Act'], '"', $selected, '>', $activite['Name_Act'], '</option>', "\n";
	}
	echo '</select>';
	echo '</form>';
	echo '</div>';

	echo '<div id="column2">';
	echo "activite n°: ", $act;
	echo '</div>';
	?>

	<div class="gen">
		<?php
		echo move_act($act);
		?>

		<button class="myCoolButton"
			onclick="SendJson(position(), 'https://duss.alwaysdata.net/suivi/qcm/back/api/movation.php')">Enregister</button>

	</div>
</body>

</html>

<script>
	document.onmousemove = on_mouse_move;
	document.onmouseup = on_mouse_up;
</script>