const listact = document.querySelector('#act');
const listype = document.querySelector('#typ');
const listbox = document.querySelector('#lnk');
const options = listbox.getElementsByTagName('option');
	
function SendReceiveJson(data) {
	const donnees = JSON.stringify(data);
	//console.log(donnees);
	let xhr = new XMLHttpRequest();
	xhr.open("POST", "./api/assoc.php", true);

	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	xhr.onload = () => {
	    majo(xhr.response);
	};

	xhr.send("x=" +donnees);
}

function majo(id) {
	if (listype.value == 1) {
		for (let i = 0; i < id.length; i++) {
			// creer une entree
			const option = new Option(id[i]['N_Img'], id[i]['No_Img']);
			
			// ajoute l entree a la liste
			listbox.add(option, undefined);
		};
	};

	if (listype.value == 2) {
		for (let i = 0; i < id.length; i++) {
			// creer une entree
			const option = new Option(id[i]['Link'], id[i]['No_Lien']);
			
			// ajoute l entree a la liste
			listbox.add(option, undefined);
		};
	};
	
	//console.log(id[0]);
	//console.log(id.length);
	
	// reinitialisation de la saisie
	listbox.value = 'none';
	listbox.focus();
}

function lnkposs() {
	if (listact.value == 'none') {
		alert('Merci de saisir une activité');
		return;
	}
	else {
		var typeselect =[];
		typeselect[0]=listact.value;
		typeselect[1] = listype.value;
		
		if (listbox.options.length != 0 ) {
			for (let i = listbox.options.length; i--;) {
				listbox.removeChild(options[i]);
			}
		}

		//pre remplissage de la liste
		listbox.add(new Option(' Selectionner ', 'none'), undefined);
		
		SendReceiveJson(typeselect);
	};
};

function cachange() {
	// verifie saisie vide
	if (listact.value == 'none') {
		alert('Merci de saisir une activité');
		return;
	}
	
	if (listype.value == 'none') {
		alert('Merci de saisir un type');
		return;
	}
	
	if (listbox.value == 'none') {
		alert('Merci de saisir l\'association.');
		return;
	}
	
	// ajout dans la base
	var name =[];
	name[0] = listact.value;
	name[1] = listype.value;
	name[2] = listbox.value;
	
	console.log(name);
		
	SendJson(name, "./api/assoctype.php", "d");
};

