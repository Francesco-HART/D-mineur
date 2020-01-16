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
const DEFAULTCELL_VALUE = 0

const BOARD_CONFIGS = [
	{ size: 9, bombs: 10 },
	{ size: 16, bombs: 40 },
	{ size: 22, bombs: 100 },
	{ size: 30, bombs: 250 }
]

function newGame(){
	eraseGrid()
	resetChrono()

	for (let ruleIndex = 0; ruleIndex < BOARD_CONFIGS.length; ruleIndex++) {
		const rule = BOARD_CONFIGS[ruleIndex]
		if (rule.size === parseInt(select.value)) {
			makeGrid(rule.size);
			makeBomb(rule.bombs);
			startChrono()

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
	document.getElementById("time").innerHTML = "00:00";
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
				else if ( cell.className === "flag" ) {
					cell.className = "hidden"
				}

				getValue(this)
			}

			tableRow.push(DEFAULTCELL_VALUE)
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

		if(tableGrid[randomRow][randomColumn]!==BOMB_VALUE){
			document.getElementById(randomRow + "|" + randomColumn).style="hidden"
			tableGrid[randomRow][randomColumn]= BOMB_VALUE
			numCase()
			}
		else{
		i--
		}
	}
}

function onDiscovered(row, col) {
	console.log('test')
	if (tableGrid[row][col] !== BOMB_VALUE) {

		document.getElementById(row + "|" + col).className = "b" + tableGrid[row][col]
	} else if (tableGrid[row][col] === BOMB_VALUE) {
		gameOver()
		stopChrono()
	}
}

function eraseGrid(){
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
	for(var i=0; i<tableGrid.length; i++){
		for (var j=0; j<tableGrid.length; j++){
			if(tableGrid[i][j] === BOMB_VALUE) {
				document.getElementById(i + "|" + j).className = "b" + tableGrid[i][j]
			}
			var allValues = document.getElementById(i + "|" + j)
			allValues.disabled = true
		}
	}
}
function getValue(cell){
	console.log(cell)
	if(cell.className==='bomb'){
		gameOver()
	}
}











