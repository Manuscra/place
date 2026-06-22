//Initialisation des variables
let etiquettes = new Array(); //Tableau de definition des etiquettes reponses
let ctrl_check = new Array(); //Tableau de verification des reponses donnees

//Definnition de objet etiquette
class une_etiquette {
    constructor(good, xpix, ypix, propos) {
        this.Bonne = good;
        this.X = xpix;
        this.Y = ypix;
        this.Alors = propos;
    }
}

//Remise a zero du tableau de verification
function raz(n) {
	for (i=0; i<n; i++){  
		ctrl_check[i] = 0; 
	}
}

//Tri aleatoire d un tableau
function randomateur(tab) {
    let i, j, tmp;
    for (i = tab.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        tmp = tab[i];
        tab[i] = tab[j];
        tab[j] = tmp;
    }
    return tab;
}

// Codage des options du selecteur
function Code_Rep(Tab) {
	let txt ="";
	for (let m=0; m < Tab.length; m++) {
            txt += '<option value="'+(m+1).toString()+'">' + Tab[m]+'</option>';
        }
	return txt;
}

//Fonction de verification de l ensemble des reponses
function teste(nb_quest) {
	var z =0;
	for (i=0;i < nb_quest;i++){  
		z += ctrl_check[i];  
	}
	console.log(nb_quest);
	console.log(z);

	if (z == nb_quest) {
		alert("BRAVO ! \nVous avez touvez toutes les réponses");
		}
	else alert("Ce n'est pas juste.\nEssayez encore !");
}

//Fonction de verification a chaque reponse donnee
function check(val, num_Etiqu) {
	if (etiquettes[num_Etiqu].Alors[val-1] == etiquettes[num_Etiqu].Bonne) ctrl_check[num_Etiqu] = 1;
	else ctrl_check[num_Etiqu] = 0;
}

// Les selecteurs du quizz
function selecteurs(Chap_i,Exo_j) {
    let Reponses_alea = new Array;

    // Preparation des listes de réponses possibles selon les etiquettes
    for (let n=0; n < chapitres[Chap_i].Activites[Exo_j].Listes.length; n++) {
        Reponses_alea[n] = [].concat(chapitres[Chap_i].Activites[Exo_j].Listes[n].Reponses); //Copie du tableau en profondeur
        Reponses_alea[n] = randomateur(Reponses_alea[n]); //Tri aleatoire des reponses
    }
	
	// Instanciation des etiquettes
    for (let k=0; k < chapitres[Chap_i].Activites[Exo_j].Etiquettes.length; k++) {
		const GoodRep = chapitres[Chap_i].Activites[Exo_j].Listes[chapitres[Chap_i].Activites[Exo_j].Etiquettes[k].Liste_Num].Reponses[chapitres[Chap_i].Activites[Exo_j].Etiquettes[k].Rep_good];
		let PosX = chapitres[Chap_i].Activites[Exo_j].Etiquettes[k].X;
		let PosY = chapitres[Chap_i].Activites[Exo_j].Etiquettes[k].Y;
		let Possible = Reponses_alea[chapitres[Chap_i].Activites[Exo_j].Etiquettes[k].Liste_Num];
		etiquettes[k] = new une_etiquette(GoodRep, PosX, PosY, Possible);
		//console.log(k, etiquettes[k]);
	}
	
    //Edition du style pour la posistion des etiquettes
	document.write('<style type="text/css">');
	for (let i=0; i < etiquettes.length; i++ ) {
		document.write(`#case${i.toString()} { position:absolute;left:${etiquettes[i].X}px;top:${etiquettes[i].Y}px;}\n`)
	}
	document.write('</style>');

	// Ecriture des etiquettes
    for (let k=0; k < etiquettes.length; k++) {
		document.write(`<div id="case${k.toString()}"><select name="ch${k.toString()}"  onclick="check(this.options[this.selectedIndex].value,${k})"><option value="???" selected="selected">Votre choix...</option>${Code_Rep(etiquettes[k].Alors)}</select></div>`);
	}
 
}