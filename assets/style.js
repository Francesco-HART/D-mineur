/*var b= document.body;
var new_p = document.createElement('p');
new_p.textContent = "coizecozico";
b.prepend(new_p);*/

const container = document.getElementById("container");
select = document.getElementById('select');
gameSection = document.getElementById('game');
date = 0;
date2 = 0;
dateStop = 0;
chrono = "00"




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

	startChrono()
	makeGrid(select.value);
	makeBomb(nbBombes);
}




function startChrono()
{
	date1 = Date.now();
	date2 = setInterval(function()
	{
		if (date2 == 0)
			date = Date.now() - date1;
		else
			date = Date.now() + dateStop - date1;
		dateDisplay= new Date(date)
		ms = dateDisplay.getMilliseconds();
		sec = dateDisplay.getSeconds();
		min = dateDisplay.getMinutes();
		if (ms < 100)
			ms = "00" + ms;
		else if (ms < 10)
			ms = "0" + ms;
		if (sec < 10)
			sec = "0" + sec;
		if (min < 10)
			min = "0" + min;
		chrono = min+":"+sec;
		var chronoP = document.getElementById("time")
		chronoP.textContent = chrono
	}, 50);

}




function stopChrono()
{
	clearTimeout(date2);
	dateStop = date;
}

function resetChrono()
{
	date = 0;
	clearTimeout(date2);
	dateStop = 0;
	date1 = 0;
	var i = 0;
	document.getElementById("chronotime").innerHTML = "00:00";
	var t = document.getElementById("listasupprimer");
	for(var liste in t){
		t.parentElement.lastChild.remove();
	}
}


function makeGrid(dim) {
	container.style.setProperty('--grid-dim', dim);
	container.style.setProperty('--grid-dim', dim);
	for (i = 0; i < (dim * dim); i++) {
		let cell = document.createElement("div");
		setTimeout(2)
		cell.id = ""+i
		cell.className = "safe"
		container.appendChild(cell)
	};
};


function makeBomb (nbBomb) {
	for(i = 0; i < nbBomb; i++) {
		placeBomb = Math.floor(Math.random() * (Math.pow(select.value, 2)))
		if (document.getElementById(placeBomb).className === "bomb") {
			i--
		} else	{
			document.getElementById(placeBomb).className = "bomb"
			console.log("bomb")
		}
	}

}