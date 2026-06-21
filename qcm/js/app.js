var sel = 0;
var meslistes = document.getElementById('mylist');
var i =1;		//compteur de liste
var r =1;		//compteur de reponses
var toutesrep ={};	//dic de toutes les listes et de reponses selectionnees

ReceiveList_1_Json();

function ReceiveList_1_Json() {
	var data =[];
	data[0] = "1";
	var prop = []; //dic de toutes les activites possibles de la base
	const donnees = JSON.stringify(data);
	let xhr = new XMLHttpRequest();
	xhr.open("POST", "./api/liste.php");

	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	// specify response format
	xhr.responseType = 'json';
	xhr.onload = () => {
		prop =  xhr.response;
		const listact = document.getElementById("act");
		for (let j = 0; j < prop.length; j++) {
			listact.add(new Option(prop[j].Name_Act, prop[j].No_Act), undefined);
		};	
	}

	xhr.send("x=" +donnees);
}


var proprep = []; //dic de toutes les reponses possibles de la base
ReceiveList_2_Json();

function ReceiveList_2_Json() {
	var data =[];
	data[0] = "2";
	const donnees = JSON.stringify(data);
	let xhr = new XMLHttpRequest();
	xhr.open("POST", "./api/liste.php");

	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	// specify response format
	xhr.responseType = 'json';
	xhr.onload = () => {
		proprep =  xhr.response;
	}

	xhr.send("x=" +donnees);
}

function raz() {
	toutesrep ={};
	sel = 1;
	var lasel = document.getElementById("act")
	toutesrep["Nact"] = lasel.value ;
	toutesrep["Name"] = lasel.options[lasel.selectedIndex].innerHTML;

	var supall =document.getElementById('mylist');	//supprime la div des listes ds le DOM
	supall.remove();
	
	i=1;

	//creation de la div de travail
	var gen = document.getElementById('pag');
	var ladiv = document.createElement("div")
	ladiv.id = 'mylist';
	gen.appendChild(ladiv);
	meslistes = document.getElementById('mylist');
}

function remove (ref) {	//suppression d une liste
	delete toutesrep.ref;	//supprime les donnees du dic JS
	var suplist =document.getElementById(ref.slice(0, -1));	//supprime la div associee ds le DOM (apres modif de ref pour obtenir ID correcte = lid)
	suplist.remove();
}

function decheck (fer, num) {	//modif d un check
	var lenb = document.getElementById('check'+String(fer.id)+String(num))
	toutesrep[fer.id][num]["xetiq"] = lenb.value;
	//console.log(toutesrep);
}

function supr (fer, num) {	//suppression d une reponse
	toutesrep[fer.id].splice(num,1);	//supprime les donnees du dic JS
	var suplist =document.getElementById(fer.id+num);	//supprime la div associee ds le DOM 
	suplist.remove();
	//console.log(toutesrep);
}


function rempli(idselect) {	//remplissage aleatoire -- A MODIFIER
	var listbox = document.getElementById(idselect);

	listbox.add(new Option(' Selectionner ', 'none'), undefined);
	//pre remplissage de la liste
	for (let j = 0; j < proprep.length; j++) {
	    listbox.add(new Option(proprep[j].Reponse, proprep[j].No_Rep), undefined);
	}
}

function rep(ou) {
	const oup= "s"+ou.slice(1, -1);
	var larepo ={};
	var laselect = document.getElementById(oup)
	larepo["xrep"] = laselect.value;
	larepo["xetiq"] = "1";
	larepo["xname"] = laselect.options[laselect.selectedIndex].innerHTML;
	
	toutesrep[ou].push(larepo);

	//console.log(toutesrep);
		
	var affich ="";
	for (let k = 0; k < toutesrep[ou].length; k++) {
		affich+= "<div class='flex three' id = '"+String(ou)+String(k)+"'>";
		affich+= "<div class='third sixth'><span>";
		affich+= String(toutesrep[ou][k]["xname"]);
		affich+= "</span></div>";
		affich+= "<div class='third sixth'><span><label for='check"+ou+String(k)+"'>Nb Etiquette </label><input class='nbe' type='number' id='check"+ou+String(k)+"' min='1' max='25' value='"+String(toutesrep[ou][k]["xetiq"])+"' onchange='decheck("+ou+","+String(k)+")'> ";
		affich+= "</span></div>";
		affich+= "<div class='full sixth'><span><button class='warning' onclick='supr("+ou+","+String(k)+")' style='font-size: .75em;'> -</button></span></div>";
		affich+= "</div>";
	}
	document.getElementById(ou).innerHTML = affich;
}

function addliste() {
	if (sel == 1) {
		//initialisation des ID pour les differents elts
		var lid ="x"+String(i);
		var sid ="s"+String(i);
		var idrep = lid +String(i);

		//creation de la div de travail
		var uneliste = document.createElement("div")
		uneliste.id = lid;
		meslistes.appendChild(uneliste);
			
		toutesrep[idrep]=[];
		
		//recuperation du ptr de la div de travail
		var laliste = document.getElementById(lid);
		
		//ajout des elements de deco ds la div
		laliste.appendChild(document.createElement("br"));
		var enonc = document.createElement("div");
		enonc.className= "flex two";
		laliste.appendChild(enonc);
		var labele = document.createElement("div");
		labele.className= "sixth";
		enonc.appendChild(labele);

		labele.appendChild(document.createTextNode(" ----> Liste No : "+String(i)));

		var unerep = document.createElement("div");
		unerep.className= "full sixth";

		//ajout du bouton supprimer
		var bout = document.createElement("button");
		bout.setAttribute( "onclick", "remove('"+idrep+"');");	//passage de ID pour suppression
		bout.className= "warning";
		bout.innerHTML =  "Supprimer";
		bout.style= "font-size : .75em";
		unerep.appendChild(bout);

		enonc.appendChild(unerep);
		
		//ajout du bouton select a la div dans le DOM	
		var select = document.createElement("select");
		select.id = sid;
		select.setAttribute( "onchange", "rep('"+idrep+"');" );
		laliste.appendChild(select);
		rempli(sid);	//remplissage du bouton select
		
		//ajout d une div qui contiendra les reponses selectionnees
		var reponses = document.createElement("div")
		reponses.id = idrep;
		laliste.appendChild(reponses);
			
		//ajout des elements de deco ds la div	
		laliste.appendChild(document.createElement("br"));
		
		i+=1;	//incrementation du compteur de liste
	} else document.getElementById('modal_1').checked = true; // open modal
};

function envoyer() {
	const donnees = JSON.stringify(toutesrep);
	let xhr = new XMLHttpRequest();
	xhr.open("POST", "./api/lesrep.php");

	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	// specify response format
	xhr.responseType = 'json';
	xhr.onload = () => {console.log(xhr.response);}

	xhr.send("x=" +donnees);

};

