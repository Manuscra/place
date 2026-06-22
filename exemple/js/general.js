//Affichage de la div gen
let r = document.querySelector(':root');

//Le menu des activites et autres liens
function menu() {
    for (let i=0; i<chapitres.length; i++) 
    {
        document.write(`<li><a href="#">${chapitres[i].Chap_Name}</a><ul>`);
        for (let j=0; j<chapitres[i].Activites.length; j++) 
            {
                if (chapitres[i].Activites[j].Type_Act == "quizz")
                    {
                        document.write(`<li><a href="index.html?chap=${i}&exo=${j}">${chapitres[i].Activites[j].Act_Name}</a></li>`);
                    };
                    if (chapitres[i].Activites[j].Type_Act == "video")
                    {
                        document.write(`<li><a href="index.html?chap=${i}&mv=${j}">${chapitres[i].Activites[j].Act_Name}</a></li>`);
                    };
                    if (chapitres[i].Activites[j].Type_Act == "lien")
                    {
                        document.write(`<li><a href="${chapitres[i].Activites[j].Lnk_Act}"target="_blank">${chapitres[i].Activites[j].Act_Name}</a></li>`);
                    };
            };
        document.write('</ul></li>');
    };
}

//Action a mener en fonction du menu
function action() {
    let url = new URL(window.location.href);

    let Chap_i = url.searchParams.get("chap");
    let Exo_j = url.searchParams.get("exo");
    let Mv_j = url.searchParams.get("mv");

    if(!!Chap_i) {
        if (!! Exo_j) {          
            // Affichage de l image de fond
            document.write(`<div id="sh2"><img src="http://duss.alwaysdata.net/qcm/image.php/?img=${chapitres[Chap_i].Activites[Exo_j].N_Img}" id="chap_img" /></div>`);
            
            // Affichage des etiquettes
            selecteurs(Chap_i,Exo_j);

            // Affichage du bouton pour controle des reponses
            document.write(`<div id="cons-sh2"><p class="what">Trouvez les bons mots de vocabulaire<br>puis ... <br><br><input style="font-size: 14px;"value=" Vérifier " onclick="teste(${chapitres[Chap_i].Activites[Exo_j].Etiquettes.length})" type="button" class="check"></p></div>`);
        }
        else if (!! Mv_j) {
            // Affichage de la video 
            document.write(`<div class="player" id="sh1"><video controls><source src="http://duss.alwaysdata.net/qcm/video.php/?vid=${chapitres[Chap_i].Activites[Mv_j].Lnk_Act}" id="chap_vid"><p>Votre navigateur ne supporte pas la vidéo HTML5.</p></video></div>`);          
        }
        document.write('<div id="shclose"><input value=" X " onclick=\'window.location.href="index.html"\' type="button" class="close"></div>'); // Ferme la fenetre
    }
    else {
        r.style.setProperty('--div-gen-visi', 'none'); //Fait disparaitre la div generale
    }
 }
