const container = document.getElementById("container");
select = document.getElementById('select');
gameSection = document.getElementById('game');
gameInfo=document.getElementById('gameInfo');
date = 0;
date2 = 0;
dateStop = 0;
chrono = "00";
nbBomb = 0;

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
	NB_FLAG=0

	for (let ruleIndex = 0; ruleIndex < BOARD_CONFIGS.length; ruleIndex++) {
		const rule = BOARD_CONFIGS[ruleIndex]
		if (rule.size === parseInt(select.value)) {
			makeGrid(rule.size);
			makeBomb(rule.bombs);
			startChrono()
			nbBomb = rule.bombs
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
		containerRow.className='containerRow'

		tableRow=[]
		for (let j = 0; j < (dim); j++) {
			let cell = document.createElement("button");

			containerRow.appendChild(cell)
			cell.id = i+"|"+j
			cell.className = "hidden"
			cell.setAttribute("onclick", "onResolve("+ i + "," + j + ")")
			containerRow.appendChild(cell)
			cell.oncontextmenu=function(event){

				if(cell.className ==="hidden" && remainingBomb>0){
					cell.className = "flag"
					cell.onclick=''
					remainingBomb--
					NB_FLAG++
				}
				else if ( cell.className === "flag" ) {
					cell.className = "hidden"
					cell.onclick=function(event){
						onResolve(cell.id[0], cell.id[2])
					}
					remainingBomb++
					NB_FLAG--
				}
				gameInfo.textContent='bombe: ' + (remainingBomb)

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
	remainingBomb = nbBomb;
	gameInfo.textContent='bombe: ' + (nbBomb)

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

function onResolve(i, j){
	discovered(i, j)
	document.getElementById(i + "|" + j).disabled=true
	win()
	if (tableGrid[i][j] === 9){
		loose()
	}
}

function discovered(row, col) {
	if ( document.getElementById(row + "|" + col).className === "flag") {
		gameInfo.textContent='bombe: ' + (remainingBomb)
		return false
	}
	else{
				document.getElementById(row + "|" + col).disabled=true

	}


	if ( tableGrid [row][col] === 0 && document.getElementById(row + "|" + col).className === "hidden") {

		for(var i=-1; i<=1; i++){
			for(var j=-1; j<=1; j++){
				if (row+i>= 0 && col+j >= 0   && row+i < tableGrid.length  &&col+j < tableGrid.length 	&& tableGrid [row+i][col+j] !== 9 && (tableGrid [row+i][col+j] !== undefined) && (i!==0 || j!==0)){
					document.getElementById(row + "|" + col).className = "b" + tableGrid[row][col]
					discovered( row+i, col+j)
				}
			}
		}

	} else if (tableGrid[row][col] !== 9) {
		document.getElementById(row + "|" + col).className = "b" + tableGrid[row][col]
	} else if (tableGrid[row][col] === BOMB_VALUE) {
		gameOver()
		document.getElementById(row + "|" + col).className = "b9_find"
	}

}

function eraseGrid(){
	while(container.hasChildNodes()){
		container.removeChild(container.firstChild);
	}
	var element = document.getElementById("win-loose");
	while (element.firstChild) {
		element.removeChild(element.firstChild);
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
	stopChrono()
}



function win(){

	if (document.getElementsByClassName("hidden").length === nbBomb) {
		gameOver()
		gameInfo.textContent='Bravo, vous avez gagné'
		var img = document.createElement("img")
		img.id = "win"
		document.getElementById("win-loose").appendChild(img)
		var sound = document.createElement("audio")
		sound.src = "http://www.ffmages.com/ffvii/ost/disc-1/11-fanfare.mp3"
		sound.id = "sound-win"
		sound.setAttribute("autoplay", "true")
		document.getElementById("win-loose").appendChild(sound)
		setTimeout(function () {
			with(document.getElementById("win"))
			{
				src = "./assets/image/win.gif"
			}
		},4200)
	}
}

function loose() {
	gameInfo.textContent='Vous avez perdu'
	var img = document.createElement("img")
	img.src = "./assets/image/explosion.gif"
	img.id = "loose"
	document.getElementById("win-loose").appendChild(img)
	var sound = document.createElement("audio")
	sound.src = "http://s1download-universal-soundbank.com/mp3/sounds/1422.mp3"
	sound.id = "sound-loose"
	sound.setAttribute("autoplay", "true")
	document.getElementById("win-loose").appendChild(sound)
	setTimeout(function () {
		with(document.getElementById("loose"))
		{
			src="./assets/image/game-over.gif"
		}
	},1800)
	setTimeout(function () {
		with(document.getElementById("sound-loose"))
		{
			src="https://www.wiizelda.net/mp3/loz/Game%20Over.mp3"
			autoplay=true
		}
	},3000)
}



function getValue(cell){
	if(cell.className==='bomb'){
		gameOver()
	}
}











