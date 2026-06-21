<?php 
    function assocrepact()
    {
	$affich= '<h3> Association des attributs de l\'activité</h3>
	<hr>
	<br>
	<h4>Nom de l\'activité :</h4>
		<div class="flex two">
			<div class=" third">
				<i><select id="act" name="act" onchange="raz()">
					<option value="none" selected disabled hidden> ... à sélectionner dans la liste !</option>
				</select></i>
			</div>
			<div class="half">
				<button class="success" onclick="envoyer()" style="margin: 0;">Enregistrer</button>
			</div>
		</div>
	<br>
	

	<div class="flex two">
		<div class="sixth"><span><h4> ---- Listes ---- </h4></span></div>
		<div class="full sixth"><span><button class="success" onclick="addliste()" style="font-size: .75em;">Ajouter</button></span></div>

	<div  id="mylist"></div>

	
	<div class="modal">
	  <input id="modal_1" type="checkbox" />
	  <label for="modal_1" class="overlay"></label>
	  <article>
	    <header>
	      <h3>Attention,</h3>
	      <label for="modal_1" class="close">&times;</label>
	    </header>
	    <section class="content">
	      Vous devez faire une sélection de l\'activité au préalable !
	    </section>
	   <footer>
	   </footer>
	  </article>
	</div>
	
        <script src="./js/app.js"></script>';
        
	return $affich;
    }
?>
