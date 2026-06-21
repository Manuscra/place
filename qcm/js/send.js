function SendJson(data, api, mode) {
	const donnees = JSON.stringify(data);
	let xhr = new XMLHttpRequest();
	xhr.open("POST", api, true);

	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
	
	/*Affichage Console*/
	//console.log(donnees);
	//xhr.onload = () => console.log(xhr.responseText);
	
	if (mode == 'w') {
		xhr.onload = () => {maj(xhr.responseText, data[1]);}
	}

	xhr.send("x=" +donnees);
}

