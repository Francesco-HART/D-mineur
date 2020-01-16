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

function newGame(){
	while(container.hasChildNodes()){
		container.removeChild(container.firstChild);
	}

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
		containerRow.style='display:flex;justify-content:center;align-content:center;padding:0px;'

		tableRow=[]
		for (let j = 0; j < (dim); j++) {
			let cell = document.createElement("button");

			containerRow.appendChild(cell)
			cell.id = i+"|"+j
			cell.className = "hidden"
			cell.setAttribute("onclick", "onDiscovered("+ i + "," + j + ")")
			containerRow.appendChild(cell)

			/*cell.addEventListener('click', function(){
			getValue(this);
			}, 'once');
			cell.onclick=function(event){
				getValue(this)
			}*/



			cell.oncontextmenu=function(event){

				if(cell.className ==="hidden"){
					cell.className = "flag"
				}
				else if ( cell.className  ) {
					cell.className = "hidden"
				}

				getValue(this)
			}

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

		if(tableGrid[randomRow][randomColumn]!==9){
			document.getElementById(randomRow + "|" + randomColumn).style="hidden"
			tableGrid[randomRow][randomColumn]=9
			numCase()
			}
		else{
		i--
		}
	}
}

function onDiscovered(row, col) {
	/*var colr = col;
	var rowr = row;
	var coll = col;
	var rowl = row;
	var colu = col;
	var rowu = row;
	var cold = col;
	var rowd = row;

	for ( let i = 0; i< (tableGrid.length - row) ; i++) {
		while (tableGrid[rowr][colr] == 0 && colr < tableGrid.length && rowr < tableGrid.length) {
			console.log('test 1')
			document.getElementById(rowr + "|" + colr).className = "b" + tableGrid[rowr][colr++]
			if (tableGrid[rowr][colr] != 0 && tableGrid[rowr][colr] != 9 && colr < tableGrid.length && rowr < tableGrid.length)
				document.getElementById(rowr + "|" + colr).className = "b" + tableGrid[rowr][colr++]
		}
		while (tableGrid[rowl][coll] == 0 && coll >= 0 && rowl >= 0) {
			document.getElementById(rowl + "|" + coll).className = "b" + tableGrid[rowl][coll--]
			if (tableGrid[rowl][coll + 1] > 0 && tableGrid[rowr][colr] != 9)
				document.getElementById(rowl + "|" + coll).className = "b" + tableGrid[rowl][coll--]

		}
		while (tableGrid[rowu][colu] == 0 && rowu > 0) {
			document.getElementById(rowu + "|" + colu).className = "b" + tableGrid[rowu--][colu]
			if (tableGrid[rowu + 1][colu] > 0 && tableGrid[rowu][colu] != 9 && rowu > 0)
				document.getElementById(rowu + "|" + colu).className = "b" + tableGrid[rowu--][colu]

		}
		while (tableGrid[rowd][cold] == 0 && rowd < tableGrid.length) {
			document.getElementById(rowd + "|" + cold).className = "b" + tableGrid[rowd++][cold]
			if (tableGrid[rowd - 1][cold] > 0 && tableGrid[rowd][cold] != 9 && rowd < tableGrid.length)
				document.getElementById(rowd + "|" + cold).className = "b" + tableGrid[rowd++][cold]

		}

	}*/

	if ( tableGrid [row][col] === 0 && document.getElementById(row + "|" + col).className === "hidden") {
		if (row - 1>= 0 && col - 1 >= 0 && tableGrid [row-1][col-1] !== 9 && (tableGrid [row-1][col-1] !== undefined)){
			console.log(1)
			console.log(row-1,col-1)
			document.getElementById(row + "|" + col).className = "b" + tableGrid[row][col]
			onDiscovered( row-1, col-1)
		}
		if ( col-1 >= 0 && tableGrid [row][col-1] !== 9 && (tableGrid [row][col-1] !== undefined)){
			console.log(2)
			console.log(row,col-1)
			document.getElementById(row + "|" + col).className = "b" + tableGrid[row][col]
			onDiscovered( row, col-1)
		}
		if ( row < tableGrid.length-1 && col -1 >= 0 && tableGrid [row+1][col-1] !==9 && (tableGrid [row+1][col-1] !== undefined)){
			console.log(3)
			console.log(row+1,col-1)
			document.getElementById(row + "|" + col).className = "b" + tableGrid[row][col]
			onDiscovered( row+1, col-1)
		}
		if ( row -1 >= 0 && tableGrid [row-1][col] !==9 && (tableGrid [row-1][col] !== undefined)){
			console.log(4)
			console.log(row-1,col)
			document.getElementById(row + "|" + col).className = "b" + tableGrid[row][col]
			onDiscovered( row-1, col)
		}
		if (row < tableGrid.length-1 && tableGrid [row+1][col] !==9 && (tableGrid [row+1][col] !== undefined)){
			console.log(5)
			console.log(row+1,col)
			document.getElementById(row + "|" + col).className = "b" + tableGrid[row][col]
			onDiscovered( row+1, col)
		}
		if (row-1 >= 0 && col+1 < tableGrid.length-1 && tableGrid [row-1][col+1] !==9 && (tableGrid [row-1][col+1] !== undefined)){
			console.log(6)
			console.log(row-1,col+1)
			document.getElementById(row + "|" + col).className = "b" + tableGrid[row][col]
			onDiscovered( row-1, col+1)
		}
		if (col+1 < tableGrid.length-1 && tableGrid [row][col+1] !==9 && (tableGrid [row][col+1] !== undefined)){
			console.log(7)
			console.log(row,col+1)
			document.getElementById(row + "|" + col).className = "b" + tableGrid[row][col]
			onDiscovered( row, col+1)
		}
		if ( row+1 < tableGrid.length-1 && col +1 < tableGrid.length && tableGrid [row+1][col+1] !==9 && (tableGrid [row+1][col+1] !== undefined)){
			console.log(8)
			console.log(row+1,col+1)
			document.getElementById(row + "|" + col).className = "b" + tableGrid[row][col]
			onDiscovered( row+1, col+1)
		}
	} else if (tableGrid[row][col] !== 9) {
		document.getElementById(row + "|" + col).className = "b" + tableGrid[row][col]
	} else if (tableGrid[row][col] === 9) {
		gameOver()
		stopChrono()
	}

}

function gameOver(){
	while(container.hasChildNodes()){
		container.removeChild(container.firstChild);
	}
}

function numCase () {
	for(var row=-1; row<=1; row++){
		for( var col=-1; col<=1; col++){
			if(((randomRow+row>=0  && randomRow+row<=tableGrid.length-1) && (randomColumn+col>=0 && randomColumn+col<=tableGrid.length-1)) && (row!==0 || col!==0) && tableGrid[randomRow+row][randomColumn+col]!==9)
			{
				tableGrid[randomRow+row][randomColumn+col]+=1;
			}
		}
	}
}


function gameOver(){
	var bombCell = document.getElementsByClassName('b9')
	for(var i=0; i<bombCell.length; i++){
		bombCell[i].style='background-image:url("/Users/Gwenael/Documents/javascript janvier/D-mineur/assets/sprite/mine.png");width:20px; height:20px;'
	}
}


function getValue(cell){
	console.log(cell)
	if(cell.className==='bomb'){
		gameOver()
	}
}











