<?php 
    function attribActChap()
    {
	require "./id/connect.php";
	
	$larequete = $connexion->query("SELECT * FROM Chap order by Name_Chap asc;");

	$affich= '<h3> Attribution des Activites par Chapitres</h3>';
	
	$affich.= '<form>';
	$affich.= '<table>';

	//LISTE des activites-->
	$affich.= '<tr><th>ACTIVITES</th>';
	foreach ($larequete as $niv) {
		$affich.= '<th>';
		$affich.= $niv['Name_Chap'];
		$affich.= '</th>';
	};
	$affich.= '</tr>';

	$i = 0;
	$total = $connexion->query("SELECT * FROM Activite order by Name_Act asc;");
	foreach ($total as $row) {
		$affich.= '<tr><td>';
		$affich.= $row['Name_Act'];
		$affich.= '</td>';
		foreach ($larequete as $niv) {
			$exist = $connexion->query("SELECT * FROM Attrib_Chap WHERE (No_dChap='".$niv['No_chap']."' AND No_dAct='".$row['No_Act']."');");
			if (mysqli_num_rows($exist) > 0) {$check="checked";} else { $check="";};
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
  	$affich.= 'SendJson(selected, "http://duss.alwaysdata.net/suivi/qcm/back/api/attribAC.php");';
	$affich.= "}";
	$affich.= "</script>";

	return $affich;
    }
?>
