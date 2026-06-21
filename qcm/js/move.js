var mouse_down = false;
var whatId = '';

function on_mouse_up(event){
 mouse_down=false;
}

function on_mouse_move(event) {
  if (mouse_down === true) {
    document.getElementById(whatId).style.left = (parseInt(event.clientX)-40).toString()+'px'; //decalage a cause de la position de la div
    document.getElementById(whatId).style.top = (parseInt(event.clientY)-80).toString()+'px';  //event.clientY est une methode du javascript
  }
}

function position() {
	const contents = document.getElementsByClassName('mydiv');
	var x;
	var y;
	var tab =[];
		
	for (var j = 0; j < contents.length; j++) {
		if (contents[j].style.top =="") { y = "0";}
			else {	y = contents[j].style.top;
				y = y.substring(0, y.length - 2)}
		if (contents[j].style.left =="") { x = "0";}
			else {	x = contents[j].style.left;
				x = x.substring(0, x.length - 2)}
		tab[j] = {"id":contents[j].id, "x":x, "y":y};
	}
	return(tab);
}
