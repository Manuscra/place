<?php 
    function attribNivChap()
    {
	require "./id/connect.php";
	
	$larequete = $connexion->query("SELECT * FROM Niveau order by No_Niv asc;");

	$affich= '<h3> Attribution des Chapitres par Niveau</h3>';
	
	$affich.= '<form>';
	$affich.= '<table>';

	//LISTE des chapitres-->
	$affich.= '<tr><th>CHAPITRES</th>';
	foreach ($larequete as $niv) {
		$affich.= '<th>';
		$affich.=$niv['Name_Niv'];
		$affich.= '</th>';
	};
	$affich.= '</tr>';

	$i = 0;
	$total = $connexion->query("SELECT * FROM Chap order by Name_Chap asc;");
	foreach ($total as $row) {
		$affich.= '<tr><td>';
		$affich.= $row['Name_Chap'];
		$affich.= '</td>';
		foreach ($larequete as $niv) {
			$exi = $connexion->query("SELECT * FROM Attrib_Niv WHERE (No_dNiv='".$niv['No_Niv']."' AND No_dChap='".$row['No_chap']."');");
			if (mysqli_num_rows($exi) > 0) {$check="checked";} else { $check="";};
			$affich.= '<td><label><input type="checkbox" value="'.$i.'" '.$check.'><span class="checkable"></span></label></td>';
			$i+=1;
		};
		$affich.= '</tr>';
	};
	
	$affich.= '</table>';
	$affich.= '<button class="myCoolButton">Enregister</button>';
	$affich.= '</form>';

	$affich.= "<script>";
	$affich.= "document.querySelector('form').onsubmit = function(e){";
		$affich.= "e.preventDefault();";
		$affich.= "checkboxes=document.querySelectorAll(':checked');";
		$affich.= "var selected = [];";
		$affich.= "for (var i=0; i<checkboxes.length; i++) {";
			$affich.= "selected.push(checkboxes[i].value);";
		$affich.= "}";
  	$affich.= 'SendJson(selected, "http://duss.alwaysdata.net/suivi/qcm/back/api/attribCN.php");';
	$affich.= "}";
	$affich.= "</script>";

	return $affich;
    }
?>
