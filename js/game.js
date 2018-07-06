
//Global scale. Objects too large or too distant are not rendered in threejs scene. Scaling them down prevents clipping. 
var scale = .25;

//listener for token selection by touch
const touchToken = (event) => {
	event.preventDefault();
	let rI = gameInstance.renderInstance;

	if (event.touches[0]){
		rI.mouse.x = ( event.touches[0].clientX / window.innerWidth ) * 2 - 1;
		rI.mouse.y = - ( event.touches[0].clientY / window.innerHeight ) * 2 + 1;
		rI.rayCast(rI.mouse, rI.selectableObjects);
	} else return;
	tokenListener();
}

//listener for tile selection by touch
const touchTile = (event) => {
	event.preventDefault();
	let rI = gameInstance.renderInstance;

	if (event.touches[0]){
		rI.mouse.x = ( event.touches[0].clientX / window.innerWidth ) * 2 - 1;
		rI.mouse.y = - ( event.touches[0].clientY / window.innerHeight ) * 2 + 1;
		rI.rayCast(rI.mouse, rI.selectableObjects);
	} else return;
	tileListener();
}

//listener for token selection
const tokenListener = () => {
	let rI = gameInstance.renderInstance;
	rI.rayCast(rI.mouse, rI.selectableObjects);

	if (rI.intersected){
		let fromToken = gameInstance.activePlayer.tokens.find(token=> token.displayMesh == rI.intersected);
		gameInstance.selectTile(fromToken,false,true);
	}
}

//listener for tile selection
const tileListener = () => {
	//console.log(gameInstance)
	let intersected = gameInstance.renderInstance.intersected;
	if (intersected){
		//if player selects tile that selected token is already on, cancel move and return to previous state
		if (intersected==gameInstance.selectedToken.tile.socket){
			gameInstance.selectToken(true);
		}
		else{
		//else find parent tile and process move
			let toTile = null;
			for (let row of gameInstance.board){
				let searchResult = row.find(tile=> tile.socket == intersected);
				if (searchResult)
					toTile = searchResult;
			}
			gameInstance.processMove(toTile);
		}
	}
}





class Game {
	constructor (playerNames, colorArray) {
		//initialize renderer
		this.renderInstance = new RenderInstance()
		//initialize default values
		this.board = []; //multidimensional array of Tile objects
		//this.tokens = [];
		this.players = []; //array of Player objects
		this.activePlayerIndex = 0;
		this.activePlayer=null; //object of class Player
		this.selectedToken=null; //object of class Token
		this.availableMoves=null; //array of move result objects with 'tile' property and 
		this.displayedMoves=[]; //array of Tile objects highlighted after a Token is selected to move
		this.continuedMove = false; //continuing existing move;


		this.currentPlayerHTML = document.createElement('div');
		this.currentPlayerHTML.style.padding='30px';
		this.currentPlayerHTML.style.zIndex='99';
		this.currentPlayerHTML.style.position='relative';
		this.currentPlayerHTML.style.display='inline-block';
		this.currentPlayerHTML.style.borderStyle="solid";
		this.currentPlayerHTML.style.borderRadius="20px";
		this.currentPlayerHTML.style.borderColor='white';
		this.currentPlayerHTML.style.backgroundColor='white';
		this.currentPlayerHTML.style.margin='auto';
		this.currentPlayerHTML.style.top="0px;"

		this.currentPlayerTag = document.createElement('span');
		this.currentPlayerHTML.append(this.currentPlayerTag);
		this.currentPlayerTag.style.backgroundColor='white';
		this.currentPlayerTag.style.borderRadius='5px';
		this.currentPlayerTag.style.padding="2px";
		
		document.body.append(this.currentPlayerHTML);

		//build players
		for (let i =0; i<playerNames.length; i++){
			let direction = null;
			switch (i){
				case 0: direction = 'n';		break;
				case 1: direction = 's';		break;
				case 2: direction = 'e';		break;
				case 3: direction = 'w';		break;
			}
			//console.log(`building ${playerNames[i]} with ${colorArray[i]} color and ${direction} direction`)
			this.players.push(new Player(playerNames[i], colorArray[i], direction));
		}
	}

	buildBoard(sizeX, sizeY, center = new THREE.Vector3(0,0,0)){
		
		//intialize board array
		for (let j = 0; j<=sizeY+1; j++)
			this.board.push([]);

		//build board
		for (var i = 0; i <= sizeX+1; i++){
			for (var j = 0; j <= sizeY+1; j++){
				let color = null;
				let isBorder = false;
				if ( (i==0)  ||  (j==-0)  ||  (i==sizeX+1)  ||  (j==sizeY+1) ){
					color = 'border'; 
					isBorder = true;
				}
				else
				if ((i+j)%2==0)
					color = 'white';
				else 
					color = 'black';

				this.board[i][j] = new Tile(this, color, new THREE.Vector2(i,j), isBorder);
				}
			}

		//assign neighbors by reference to object, excluding border tiles
		for (var i = 1; i <= sizeX; i++){
				for (var j = 1; j <= sizeY; j++){
					if (i>1){
						this.board[i][j].w=this.board[i-1][j];
							if (j>1)
								this.board[i][j].sw=this.board[i-1][j-1];
							if (j<sizeY)
								this.board[i][j].nw=this.board[i-1][j+1];
					}
					if (i<sizeX){
						this.board[i][j].e=this.board[i+1][j];
						if (j>1)
							this.board[i][j].se=this.board[i+1][j-1];
						if (j<sizeY)
							this.board[i][j].ne=this.board[i+1][j+1];
					}
					if (j>1)
						this.board[i][j].s=this.board[i][j-1];
					if (j<sizeY)
						this.board[i][j].n=this.board[i][j+1];
				}
			}					
		
		//move tiles into position and rotate to add randomness to tile texture
		this.board.forEach(function(row){
			row.forEach(function(tile){
				tile.translate(new THREE.Vector3(center.x-(sizeX+2)/2, center.y-(sizeY+2)/2, center.z*scale));
				tile.mesh.rotateZ((Math.PI/2)*(Math.floor(Math.random() * 4)+1));
			});
		});
	}

	startNextPlayerTurn(){
		this.continuedMove = false;
		//set active player
		if ( (!this.activePlayer)  ||  (this.activePlayerIndex==this.players.length-1) ||  (this.activePlayerIndex==undefined) ){
			this.activePlayerIndex=0;
		}
		else {
			this.activePlayerIndex++;
		}
		this.activePlayer=this.players[this.activePlayerIndex];

		//if active player is out of tokens, skip to next player
		if (!this.activePlayer.tokens.length){
			this.startNextPlayerTurn();
			return;
		}

		this.currentPlayerTag.innerText=`${this.activePlayer.name}'s turn.`
		this.currentPlayerHTML.style.backgroundColor=this.activePlayer.color;


		//let active player select a token to move
		//camera.rotateZ(Math.PI);
		//camera.rotateOnWorldAxis(new THREE.Vector3(0,0,1), Math.PI);
		//camera.moveTo(this.activePlayer.cameraPosition, this.activePlayer.cameraRotation);
		//controls.update();
		this.renderInstance.camera = this.activePlayer.camera;

		this.selectToken(true);
	}

	selectToken(forceCapture=false){
		//clear existing moves
		this.displayedMoves.forEach(tile=> tile.socketMaterial.opacity=0);
		this.displayedMoves = [];

		//get all player tokens, find their available moves, and filter out tokens that have no moves
		let playerTokens = this.activePlayer.tokens;
		playerTokens.forEach(token=> token.availableMoves=token.getAvailableMoves());
		playerTokens = playerTokens.filter(token=> token.availableMoves.length>1);

		//if forceCapture and capture available, filter out non-capture moves
		if (forceCapture){
			let captureAvailable = false;
			playerTokens.forEach(token=> {token.availableMoves.forEach(move=>{
				if (move['captured'].length)
					captureAvailable = true;
				});
			});
			if (captureAvailable){
				playerTokens.forEach(token=> {
					token.availableMoves=token.availableMoves.filter(move=>move['captured'].length);
				});
				playerTokens=playerTokens.filter(token=>token.availableMoves.length);
			}
		}

		
		//set selectable objects
		this.renderInstance.selectableObjects = [];
		playerTokens.forEach(token => { this.renderInstance.selectableObjects.push(token.displayMesh) });

		//handle event listeners
		document.removeEventListener('click', tileListener);
		document.addEventListener('click', tokenListener);

		document.removeEventListener('touchstart', touchTile);
		document.removeEventListener('touchend', touchTile);
		document.addEventListener('touchstart',touchToken);
		document.addEventListener('touchend',touchToken);
	}
	
	selectTile(fromToken, continueExistingMove=false, forceCapture=false){
		//clear any existing moves
		this.displayedMoves.forEach(tile=> tile.socketMaterial.opacity=0.0);
		this.displayedMoves = [];
		//handle event listeners
		document.removeEventListener('click', tokenListener);
		document.addEventListener('click', tileListener);

		document.removeEventListener('touchstart', touchToken);
		document.removeEventListener('touchend', touchToken);
		document.addEventListener('touchstart', touchTile);
		document.addEventListener('touchend', touchTile);

		//store selected token and clear existing selectable objects
		this.selectedToken = fromToken;
		this.renderInstance.selectableObjects = [];
		
		//use getAvailableMoves function defined in child class to determine where the selected tile can move
		let availableMoves = this.selectedToken.getAvailableMoves()

		//if turn is continued, disable canceling move
		if (continueExistingMove)
			availableMoves.shift();

		//if forceCapture is enabled and captures are available, filter out moves that don't capture
		let movesThatCapture = availableMoves.filter(move=> move['captured'].length);
		if ( (forceCapture)  &&  (movesThatCapture.length) ){
			availableMoves = movesThatCapture;
		}

		this.availableMoves = availableMoves;

		if ( (availableMoves.length<=1)  &&  (availableMoves[0]['tile']==this.tile) ){
			console.warn(`Can not move this ${fromToken.name}.`)
			this.selectToken(true);
			return;
		}

		//render available moves and add them to selection queue
		for( let moveOption of availableMoves ){
			moveOption['tile'].socketMaterial.opacity=0.5;
			this.displayedMoves.push(moveOption['tile']);
			this.renderInstance.selectableObjects.push(moveOption['tile'].socket);
		}

		if (!this.availableMoves.length)
			this.startNextPlayerTurn();
	}

	processMove(toTile){
		//find the matching move result
		let moveResult = this.availableMoves.find(move=> toTile==move['tile']);
		//if move resulted in captured tokens, remove them from the game
		moveResult['captured'].forEach(token=> token.remove());
		//move the token to new tile
		this.selectedToken.moveTo(toTile);
		//if a token was captured, check for additional captures. continue move if any are available.
		if  (moveResult['captured'].length)  {
			let checkMoves = this.selectedToken.getAvailableMoves();
			checkMoves = checkMoves.filter(move=> move['captured'].length);
			if  (checkMoves.length) {
				this.selectTile(this.selectedToken,true,true);
				return;
			}	
		}

		//check special conditions
		this.selectedToken.checkPromotion();

		//check to see if game is over
		this.checkVictory();

		//proceed to next turn
		this.startNextPlayerTurn();
	}
}

class Player {
	constructor(name, color, playerDirection){
		//set default player values
		this.name = name;
		this.color = color;
		this.tokens = [];
		this.playerDirection = playerDirection;

		this.camera =  new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
		this.camera.position.z = 2;
		//console.log(this.playerDirection)
		switch (this.playerDirection){
			case 'n': this.camera.position.y=-9*scale;
						this.camera.rotation.x=(Math.PI/4); 
						//this.cameraPosition = new THREE.Vector3(0.0, -8*scale, 2);
						//this.cameraRotation = new THREE.Vector3(Math.PI/4, 0.0, 0.0);
						break;
			case 's': this.camera.position.y=9*scale; 
						this.camera.rotation.x=(-Math.PI/4); 
						this.camera.rotation.z=(Math.PI);
						//this.cameraPosition = new THREE.Vector3(0.0, 8*scale, 2);
						//this.cameraRotation = new THREE.Vector3( Math.PI/4, 0.0, Math.PI/2 );
						break;
			case 'e': this.camera.position.x=-9*scale; 
						this.camera.rotation.y=(-Math.PI/4); 
						this.camera.rotation.z=(-Math.PI/2);
						break;
			case 'w': this.camera.position.x=9*scale; 
						this.camera.rotation.y=(Math.PI/4); 
						this.camera.rotation.z=(Math.PI/2);
						break;
		}

		
	}

	addToken(token){
		//add a new token to player's inventory
		this.tokens.push(token);
	}
}





class Token {
	constructor(name, player, gameInstance, startingPosition, geometry){
		//set default class values
		this.name = name;
		this.tile = startingPosition;
		this.player = player;
		this.gameInstance=gameInstance;
		this.defaultAllowedMovement = [];
		this.allowedMovement = this.defaultAlloweMovement;
		this.position = startingPosition;

		//create parent Group - used for interaction with other functions
		this.mesh = new THREE.Group(); 
		
		//copy loaded geometry from library, create mesh, and add to parent object
		//console.log(`constructing token for ${this.player.name} in ${this.player.color}`)
		this.displayMaterial = new THREE.MeshStandardMaterial( { color: this.player.color } );
		this.constructMesh(geometry);
		
		//add display mesh to parent and add parent to scene
		this.mesh.add(this.displayMesh);
		this.gameInstance.renderInstance.scene.add(this.mesh);
		
		//move to starting tile location
		this.moveTo(this.tile);
	}
	constructMesh(geometry){
		this.displayMesh = new THREE.Mesh(   geometry.clone() , this.displayMaterial  );
		this.displayMesh.castShadow = true;
		this.displayMesh.receiveShadow = true;
	}

	moveTo(tile, color = null) {
		//open current tile
		if (this.tile)
			this.tile.isOpen=true;
		
		//duplicate positions
		let tilePos = new THREE.Vector3(tile.obj.position.x,tile.obj.position.y,tile.obj.position.z);
		let socketPos = new THREE.Vector3(tile.socket.position.x,tile.socket.position.y,tile.socket.position.z);
		let tokenPos = new THREE.Vector3(this.mesh.position.x,this.mesh.position.y,this.mesh.position.z);
		
		//calculate delta between current position and targit position
		let placementPos = tilePos.add(socketPos);
		let deltaPos = placementPos.add(tokenPos.negate());
		
		//move to target position
		this.mesh.translateX(deltaPos.x);
		this.mesh.translateY(deltaPos.y);
		this.mesh.translateZ(deltaPos.z);


		//assign new tile, 
		this.tile=tile;
		this.tile.isOpen=false;
		this.tile.token=this;

		//optional- highlight target tile, used for debugging
		if (color)
			this.tile.mesh.material.emissive.setHex(color);

	}

	remove(){
		//remove this token from player's inventory and game board
		this.player.tokens = this.player.tokens.filter(token=> token!=this);
		this.tile.isOpen=true;
		this.gameInstance.renderInstance.scene.remove(this.mesh);
		console.log(`${gameInstance.activePlayer.name} took ${this.player.name}'s ${this.name}.`)
	}


	rotateToPlayerDirection(){
		let rotations = 0;
		switch(this.player.playerDirection){
			case 'n': rotations=0; break;
			case 'e': rotations=1; break;
			case 's': rotations=2; break;
			case 'w': rotations=3; break;
		}

		this.allowedMovement = this.defaultAllowedMovement
		for (let i = 0; i<rotations; i++)
			this.allowedMovement = this.rotateAvailableMovementByHalfPi(this.allowedMovement);
	}

	rotateAvailableMovementByHalfPi(AvailableMovementArray){
		let fullArray = [];
		AvailableMovementArray.forEach(movementArray=> {
			let subArray = []
			movementArray.forEach(move=> {
				switch (move){
					case 'n':   subArray.push('e'); break;
					case 'ne':  subArray.push('se'); break;
					case 'e':   subArray.push('s'); break;
					case 'se':  subArray.push('sw'); break;
					case 's':   subArray.push('w'); break;
					case 'sw':  subArray.push('nw'); break;
					case 'w':   subArray.push('n'); break;
					case 'nw':  subArray.push('ne'); break;
				}
			});
			fullArray.push(subArray);
		});
		//this.displayMesh.rotateZ(-Math.PI/2);
		return fullArray;
	}

	updateModel(geometry){
		this.mesh.remove(this.displayMesh);
		this.constructMesh(geometry);
	}
	

}





class Tile {
	constructor(gameInstance, color,position,border = false) {
		//set default values for new tile
		this.gameInstance=gameInstance;
		this.color = color;
		this.position = position;

		//default neighbors to null
		this.n = null;
		this.ne = null;
		this.e = null;
		this.se = null;
		this.s = null;
		this.sw = null;
		this.w = null;
		this.nw = null;
		this.u = null;
		this.d = null;

		//non-border tiles start open, until a token is placed on them
		this.isOpen = !border;
		this.token = null;
		
		//construct tile geometry and determine appropriate material
		if (!border)
			this.geometry = new THREE.BoxGeometry( 1*scale,1*scale,1*scale );
		else 
			this.geometry = new THREE.BoxGeometry( 1*scale,1*scale,1.25*scale );
		if (typeof(color) !='string')
			this.material = new THREE.MeshLambertMaterial( { color: color } );
		else {
			switch (color) {
				case 'black': this.material = blacktilematerial; break;
				case 'white': this.material = whitetilematerial; break;
				case 'border': this.material = bordermaterial; break;
				}
			}

		//create parent object for tile - used to interact with other functions
		this.obj = new THREE.Group();
		this.mesh = new THREE.Mesh( this.geometry, this.material.clone() );
		this.obj.add(this.mesh);

		//add a socket for tokens to attach to. also used to highlight available moves
		if (!this.isBorder){
			//create sphere mesh for socket
			this.socketMaterial = new THREE.MeshLambertMaterial({color: 0xe5ef2b});
			this.socket = new THREE.Mesh( new THREE.SphereGeometry(.5*scale), this.socketMaterial );
			this.socketMaterial.transparent=true;
			this.socketMaterial.opacity=0.0;
			//add socket to parent Object3D
			this.obj.add(this.socket);
			//raise socket to top of tile
			this.socket.translateZ(.5*scale)
		}

		//add tile to scene
		this.gameInstance.renderInstance.scene.add(this.obj);

		//move tile into position
		this.obj.translateX(this.position.x*scale);
		this.obj.translateY(this.position.y*scale);
	}
	
	translate(vector3){
		this.obj.translateX(vector3.x*scale);
		this.obj.translateY(vector3.y*scale);
		this.obj.translateZ(vector3.z*scale);
	}
}


