<?php
    function affiche_menu()
    {
	echo '<div id="menup1">';
	echo '<ul>';
	  echo '<li><a class="button" href="index.php">Accueil</a></li>';
	  echo '<li><a class="button" href="#"> + / - </a>';
	    echo '<ul>';
	      echo '<li><a class="button" href="index.php?cal=1">Activité</a></li>';
	      echo '<li><a class="button" href="index.php?cal=2">Image</a></li>';
	      echo '<li><a class="button" href="index.php?cal=10">Lien</a></li>';
	      echo '<li><a class="button" href="index.php?cal=9">Réponse</a></li>';
	      echo '<li><a class="button" href="index.php?cal=3">Chapitre</a></li>';
	      echo '<li><a class="button" href="index.php?cal=4">Niveau</a></li>';
	    echo '</ul>';
	  echo '</li>';
	  echo '<li><a class="button" href="#">Attribuer</a>';
	    echo '<ul>';
	      echo '<li><a class="button" href="index.php?cal=5">Activité /Chapitre</a></li>';
	      echo '<li><a class="button" href="index.php?cal=6">Activité /Niveau</a></li>';
	      echo '<li><a class="button" href="index.php?cal=7">Chapitre /Niveau</a></li>';
	      echo '<li><a class="button" href="index.php?cal=8">Activité /Type</a></li>';
	      echo '<li><a class="button" href="index.php?cal=11">Activité /Réponses</a></li>';
	    echo '</ul>';
	  echo '</li>';
	  echo '<li><a class="button" href="etiqtomove.php" target="_blank">Positionner</a></li>';
	  echo '<li><a class="button success" href="index.php?cal=12">Rafraichir</a>';
	    echo '<ul>';
	      echo '<li><a class="button success" href="index.php?cal=12&niv=6ème">6ème</a></li>';
	      echo '<li><a class="button success" href="index.php?cal=12&niv=5ème">5ème</a></li>';
	      echo '<li><a class="button success" href="index.php?cal=12&niv=4ème">4ème</a></li>';
	      echo '<li><a class="button success" href="index.php?cal=12&niv=3ème">3ème</a></li>';
	    echo '</ul>';
	  echo '</li>';
	echo '</ul>';
	echo '</div>';
    }
?>
