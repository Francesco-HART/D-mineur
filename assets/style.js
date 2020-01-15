/*var b= document.body;
var new_p = document.createElement('p');
new_p.textContent = "coizecozico";
b.prepend(new_p);*/

select = document.getElementById('select')




function getValue(){
}


function newGame(){
	console.log(select.value)
	if (select.value==9) {
		nbBombes=10
	}
	else if(select.value==16){
		nbBombes=40
	}
	else if(select.value==22){
		nbBombes=100
	}
	else if(select.value==30){
		nbBombes=250
	}
	console.log(nbBombes);
}	