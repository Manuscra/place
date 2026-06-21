const listbox = document.querySelector('#act');
const saisie = document.querySelector('#saisie');
const presaisie = document.getElementById('fleme');
var valide = "";
	
//pre remplissage de la liste
listbox.add(new Option(' Selectionner ', 'none'), undefined);

function maj(id, nom) {
	// creer une entree
	const option = new Option(nom, id);
	
	// ajoute l entree a la liste
	listbox.add(option, undefined);

	// reinitialisation de la saisie
	saisie.value = '';
	saisie.focus();
}

function add(a) {
	// verifie saisie vide
	if (saisie.value == '') {
		alert('Merci de saisir un nom');
		return;
	}
	
	// ajout dans la base
	var name =[];
	name[0]= a;
	name[1] = saisie.value;
	
	//console.log(name[0]);
	//console.log(name[1]);
	
	SendJson(name, "./api/plus.php", "w");
};

// supprime l entre selectionee
function remove(b) {
	// sauve les options existantes
	let selected = [];
	for (let i = 1; i < listbox.options.length; i++) {
		selected[i] = listbox.options[i].selected;
	}
	
	// supprime dans la base
	var name = [];
	name[0] = b;
	
	// supprime l entre selectionnee de la liste
	let index = listbox.options.length;
	while (index--) {
		if (selected[index]) {
			name[1] = listbox[index].value;
			//console.log(name[1]);
			listbox.remove(index);
		}
	}

  	SendJson(name, "./api/moins.php", "d");
};

