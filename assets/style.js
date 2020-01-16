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

const BOMB_VALUE = 9

const BOARD_CONFIGS = [
	{ size: 9, bombs: 10 },
	{ size: 16, bombs: 40 },
	{ size: 22, bombs: 100 },
	{ size: 30, bombs: 250 }
]

function newGame() {
	for (let ruleIndex = 0; ruleIndex < BOARD_CONFIGS.length; ruleIndex++) {
		const rule = BOARD_CONFIGS[ruleIndex]
		if (rule.size === parseInt(select.value)) {
			startChrono()
			makeGrid(rule.size);
			makeBomb(rule.bombs);
			return;
		}
	}
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

		if(tableGrid[randomRow][randomColumn]!=9){
			document.getElementById(randomRow + "|" + randomColumn).className = "bomb"
			document.getElementById(randomRow + "|" + randomColumn).style='background:green;'
			tableGrid[randomRow][randomColumn]= BOMB_VALUE

			updateNeighbors();

			console.log("bomb")
			}
			else{
			i--
			}
		}
}

function updateNeighbors() {
	// Définition des indexes de départ
	const START_ROW_INDEX = randomRow - 1;
	const END_ROW_INDEX = randomRow + 1;
	const START_COL_INDEX = randomColumn - 1;
	const END_COL_INDEX = randomColumn + 1;

	for (let row = START_ROW_INDEX; row <= END_ROW_INDEX; ++row) { // Pour chaque ligne
		for (let col = START_COL_INDEX; col <= END_COL_INDEX; ++col) { // Pour chaque colonne
			if (tableGrid[row] !== undefined && tableGrid[row][col] !== undefined && tableGrid[row][col] !== BOMB_VALUE) { // Check si la case existe
				if ((row !== randomRow || col !== randomColumn)) { // Check si on est  pas sur la case de la bombe
					tableGrid[row][col]++ // Update de l'état du tableau
				}
			}
		}
	}
}
