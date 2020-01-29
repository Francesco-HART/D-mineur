const gridcontainer = document.getElementById("container");
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

//Liste of grid dimension associated to the numbers of bombs 
const BOARD_CONFIGS = [
	{ size: 9, bombs: 10 },
	{ size: 16, bombs: 40 },
	{ size: 22, bombs: 100 },
	{ size: 30, bombs: 250 }
]


/**
*	This function start a new Game, we erase the Grid (if there is one), reset the chrono (if already start), 
*	we initialised the number of flag at 0;
*	Then we can explore the config's list to generate the grid corresponding to the selected difficulty.
*/
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


/**
*	This function start the chrono, that will display how much second and minute the game is running
*/
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


/**
*	This function stop the chrono, used for game over
*/
function stopChrono()
{
	clearTimeout(date2);
	dateStop = date;
}


/**
*	This function is used to reset the chrono, used when starting a new game
*/
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



/**
*	This function only generate the grid
*/
function makeGrid(dim) {
	tableGrid =[]	//	tableGrid is an array that will contain each array corresponding to a row

	for (let i = 0; i < (dim ); i++) {	//	the first loop will generate each row of the grid depending of the dimension selected

		//	containerRow will contain each cell for one row
		containerRow = document.createElement('div')
		containerRow.id =''+i
		containerRow.className='containerRow'

		tableRow=[]		//	tableRow is an array used to contain values for one row
		for (let j = 0; j < (dim); j++) {	//the second loop will generate each cell of the row depending of the dimension selected

			let cell = document.createElement("button");
			containerRow.appendChild(cell)

			//	the cell's id is used as coordinates to related himself to tableGrid
			cell.id = i+"|"+j
			cell.className = "hidden"
			cell.setAttribute("onclick", "onResolve("+ i + "," + j + ")")
			containerRow.appendChild(cell)

			//	this will allow to set or removed a flag on a cell on right-click , and calcul how much bombs should left
			cell.oncontextmenu=function(event){

				//	if cell is an hidden one, it will became a flag and we can't use left-click on it
				if(cell.className ==="hidden" && remainingBomb>0){
					cell.className = "flag"
					cell.onclick=''
					remainingBomb--
					NB_FLAG++
				}
				//	if it's a flag, we allow left-click 
				else if ( cell.className === "flag" ) {
					cell.className = "hidden"
					cell.className = "hidden"
					cell.setAttribute("onclick", "onResolve("+ i + "," + j + ")")
					remainingBomb++
					NB_FLAG--
				}

				//	this is the place where we display the number of bombs left
				gameInfo.textContent = 'bombe: ' + (remainingBomb)
			}

			tableRow.push(DEFAULTCELL_VALUE)
		}
		gridcontainer.appendChild(containerRow)
		tableGrid.push(tableRow)
	};
	//console.log(tableGrid)
};


/**
*	This function disposed the bombs in the grid we have created
*/
function makeBomb (nbBomb) {
	remainingBomb = nbBomb;
	gameInfo.textContent='bombe: ' + (nbBomb)

	let i = 0;
	//	at each loop, we will try to add a bomb in the grid in a random row and column
	while(i < nbBomb) {
		randomRow = Math.floor(Math.random() * tableRow.length)
		randomColumn = Math.floor(Math.random() * tableGrid.length )

		// if the cell isn't already a bomb, the corresponding element in tableGrid became a bomb (defined by a value=9)
		// we think it's the better way to do it, because someone who try to watch the html code won't see obviously if cells are bombs
		if(tableGrid[randomRow][randomColumn]!==BOMB_VALUE){
			document.getElementById(randomRow + "|" + randomColumn).style="hidden"
			tableGrid[randomRow][randomColumn]= BOMB_VALUE
			numCase()
			 i++
		}
	}
}



/**
*	This method discovered the selected cell, disabled it, verify if we have win, and if we have click on a bomb run the lose function
*/
function onResolve(i, j){
	discovered(i, j)
	document.getElementById(i + "|" + j).disabled=true
	win()
	if (tableGrid[i][j] === 9){
		lose()
	}
}


/**
*	This function display the number of bomb arround the selected cell. 
*	If there is any, we check for all the cells arround and discovered each since we found all the cells not in contact of bomb
*/	
function discovered(row, col) {

	//	if the cell is a flag, we won't discover it, else we can disabled it
	if ( document.getElementById(row + "|" + col).className === "flag") {
		gameInfo.textContent='bombe: ' + (remainingBomb)
		return false
	}
	else{
		document.getElementById(row + "|" + col).disabled=true
	}

	// here we display all the cell that are hidden and have any bomb arround, and extand to all the cell's like this
	if ( tableGrid [row][col] === 0 && document.getElementById(row + "|" + col).className === "hidden") {
		for(var i=-1; i<=1; i++){
			for(var j=-1; j<=1; j++){
				if (row+i>= 0 && col+j >= 0   && row+i < tableGrid.length  &&col+j < tableGrid.length 	&& tableGrid [row+i][col+j] !== 9 && (tableGrid [row+i][col+j] !== undefined) && (i!==0 || j!==0)){
					document.getElementById(row + "|" + col).className = "b" + tableGrid[row][col]
					discovered( row+i, col+j)
				}
			}
		}
	} 
	else if (tableGrid[row][col] !== 9) {	//	here we display a cell depending of the number of bomb arround it
		document.getElementById(row + "|" + col).className = "b" + tableGrid[row][col]
	} 
	else if (tableGrid[row][col] === BOMB_VALUE) {	//	here we display the cell where we click on a bomb with a red background and run gameOver
		gameOver()
		document.getElementById(row + "|" + col).className = "b9_find"
	}
}


/**
*	This method erase the content of the html gridcontainer, and the element win-lose content(if there is already a game over)
*/
function eraseGrid(){
	while(gridcontainer.hasChildNodes()){
		gridcontainer.removeChild(gridcontainer.firstChild);
	}
	var element = document.getElementById("win-lose");
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
}


/**
*	This function calculated the number of bomb arround each cell
*/
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



/**
*	This function display all bomb, disabled all grid's cells, and stop the chrono
*/
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


/**
*	This function check if the player win the game or not, and if yes charge a music and display a gif
*/
function win(){

	if (document.getElementsByClassName("hidden").length + document.getElementsByClassName("flag").length  === nbBomb) {
		gameOver()
		gameInfo.textContent='Bravo, vous avez gagné'
		var img = document.createElement("img")
		img.id = "win"
		document.getElementById("win-lose").appendChild(img)
		var sound = document.createElement("audio")
		sound.src = "http://www.ffmages.com/ffvii/ost/disc-1/11-fanfare.mp3"
		sound.id = "sound-win"
		sound.setAttribute("autoplay", "true")
		document.getElementById("win-lose").appendChild(sound)
		setTimeout(function () {
			with(document.getElementById("win"))
			{
				src = "./assets/image/win.gif"
			}
		},4200)
	}
}


/**
*	This function is used if the player lose the game by displaying an explosion, charging a music and displaying a gif
*/
function lose() {
	gameInfo.textContent='Vous avez perdu'
	var img = document.createElement("img")
	img.src = "./assets/image/explosion.gif"
	img.id = "lose"
	document.getElementById("win-lose").appendChild(img)
	var sound = document.createElement("audio")
	sound.src = "http://s1download-universal-soundbank.com/mp3/sounds/1422.mp3"
	sound.id = "sound-lose"
	sound.setAttribute("autoplay", "true")
	document.getElementById("win-lose").appendChild(sound)
	setTimeout(function () {
		with(document.getElementById("lose"))
		{
			src=""
		}
	},1800)
	setTimeout(function () {
		with(document.getElementById("sound-lose"))
		{
			src="https://www.wiizelda.net/mp3/loz/Game%20Over.mp3"
			autoplay=true
		}
		with(document.getElementById("lose"))
		{
			src="./assets/image/game-over.gif"
		}
	},3000)
}













