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

	tableGrid =[]
	for (let i = 0; i < (dim ); i++) {
		containerRow = document.createElement('div')
		containerRow.id =''+i
		containerRow.style='display:flex;justify-content:center;align-content:center;'

		tableRow=[]
		for (let j = 0; j < (dim); j++) {
			let cell = document.createElement("button");

			containerRow.appendChild(cell)
			cell.id = i+"|"+j
			cell.className = "safe"
			cell.style='background:red;width:20px; height:20px;'
			containerRow.appendChild(cell)

			tableRow.push(0)
		}
		container.appendChild(containerRow)
		tableGrid.push(tableRow)
	};
	console.log(tableGrid)

};


function makeBomb (nbBomb) {
	for(i = 0; i < nbBomb; i++) {
		randomRow = Math.floor(Math.random() * tableRow.length)
		randomColumn = Math.floor(Math.random() * tableGrid.length )

		if(tableGrid[randomRow][randomColumn]===0){
			document.getElementById(randomRow + "|" + randomColumn).className = "bomb"
			document.getElementById(randomRow + "|" + randomColumn).style='background:green;'
			tableGrid[randomRow][randomColumn]=9


			if(randomRow-1>=0 && randomColumn-1>=0)
			{
				tableGrid[randomRow-1][randomColumn-1]+=1;
			}
			if (randomRow-1>=0 && randomColumn>=0) {
				tableGrid[randomRow-1][randomColumn]+=1;
			}
			if (randomRow-1>=0 && randomColumn+1<=tableGrid.length-1) {
				tableGrid[randomRow-1][randomColumn+1]+=1;
			}

			if (randomColumn-1>=0) {
				tableGrid[randomRow][randomColumn-1]+=1;
			}
			
		 	if (randomColumn+1<=tableGrid.length-1) {
				tableGrid[randomRow][randomColumn+1]+=1;
			}

			if (randomRow+1<=tableGrid.length-1&& randomColumn-1>=0) {
				tableGrid[randomRow+1][randomColumn-1]+=1;
			}
			if (randomRow+1<=tableGrid.length-1 && randomColumn>=0) {
				tableGrid[randomRow+1][randomColumn]+=1;
			}
			if (randomRow+1<=tableGrid.length-1 && randomColumn+1<=tableGrid.length-1) {
				tableGrid[randomRow+1][randomColumn+1]+=1;
			}


			console.log("bomb")
			}
			else{
			i--
			}

		}

}

