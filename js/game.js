
//Global scale. Objects too large or too distant are not rendered in threejs scene. Scaling them down prevents clipping. 
var scale = .25;


//listener for token selection
const tokenListener = () => {
	if (INTERSECTED){
		let fromToken = gameInstance.activePlayer.tokens.find(token=> token.displayMesh == INTERSECTED);
		gameInstance.selectTile(fromToken);
	}
}

//listener for tile selection
const tileListener = () => {
	if (INTERSECTED){
		//if player selects tile that selected token is already on, cancel move and return to previous state
		if (INTERSECTED==gameInstance.selectedToken.tile.socket){
			gameInstance.selectToken();
		}
		//else gameInstance.startNextPlayerTurn();
	}
}





class Game {
	constructor (playerNames) {
		//initialize default values
		this.board = [];
		this.tokens = [];
		this.players = [];
		this.activePlayerIndex = 0;
		this.activePlayer=null;
		this.selectedToken=null;
		this.displayedMoves=[];

		//build players
		for (let i =0; i<playerNames.length; i++){
			let color = null; let direction = null;
			switch (i){
				case 0: color = '#a31f01'; 
						direction = (0,1);
						break;
				case 1: color = '#161616'; 
						direction = (0,-1);
						break;
				case 2: color = '#0145b2';
						direction = (1,0);
						break;
				case 3: color = '#b28e01'; 
						direction = (-1,0);
						break;
			}
			
			this.players.push(new Player(playerNames[i], color, direction));
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

				this.board[i][j] = new Tile(color, new THREE.Vector2(i,j), isBorder);
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
		//set active player
		if ( (!this.activePlayer)  ||  (this.activePlayerIndex>=this.players.length) ){
			this.activePlayer=this.players[0];
			this.activePlayerIndex=0;
		}
		else {
			activePlayerIndex++;
			this.activePlayer=this.players[this.activePlayerIndex];
		}
		//let active player select a token to move
		console.log(`Starting ${this.activePlayer.name}'s turn.`);
		this.selectToken();
	}

	selectToken(){
		//clear existing moves
		this.displayedMoves.forEach(tile=> tile.socketMaterial.opacity=0);
		this.displayedMoves = [];

		//set selectable objects
		selectableObjects = [];
		this.activePlayer.tokens.forEach(token => { selectableObjects.push(token.displayMesh) });

		//set event listeners
		document.removeEventListener('click', tileListener);
		document.addEventListener('click', tokenListener);
	}
	
	selectTile(fromToken){
		document.removeEventListener('click', tokenListener);
		document.addEventListener('click', tileListener);
		this.selectedToken = fromToken;
		selectableObjects = [];
		
		let availableMoves = this.selectedToken.getAvailableMoves()

		if (availableMoves.length===1){
			console.warn(`Can not move this ${fromToken.name}.`)
			this.selectToken();
			return;
		}

		//render available moves and add them to selection queue
		for( let moveOption of availableMoves ){
			moveOption['tile'].socketMaterial.opacity=0.5;
			this.displayedMoves.push(moveOption['tile']);
			selectableObjects.push(moveOption['tile'].socket);
		}
	}
}

class Player {
	constructor(name,color, playerDirection){
		//set default player values
		this.name = name;
		this.color = color;
		this.tokens = [];
		this.playerDirection = playerDirection;
	}

	addToken(token){
		//add a new token to player's inventory
		this.tokens.push(token);
	}
}





class Token {
	constructor(name, player, startingPosition, geometry){
		//set default class values
		this.name = name;
		this.tile = startingPosition;
		this.player = player;
		this.defaultAllowedMovement = [];
		this.allowedMovement = this.defaultAlloweMovement;
		this.position = startingPosition;

		//create parent Group - used for interaction with other functions
		this.mesh = new THREE.Group(); 
		
		//copy loaded geometry from library, create mesh, and add to parent object
		this.displayMaterial = new THREE.MeshStandardMaterial( { color: this.player.color } );
		this.displayMesh = new THREE.Mesh(   geometry.clone() , this.displayMaterial  );
		this.displayMesh.castShadow = true;
		this.displayMesh.receiveShadow = true;
		
		//add display mesh to parent and add parent to scene
		this.mesh.add(this.displayMesh);
		scene.add(this.mesh);
		
		//move to starting tile location
		setTimeout(this.moveTo(this.tile),500);
	}

	moveTo(tile, color = null) {
		//open current tile
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
		this.mesh.remove(scene);
		console.log(`${gameInstance.activePlayer} took ${this.player}'s ${this.name}.`)
	}

/*
	rotateAvailableMovement(){
		let rotations = 0;
		switch(this.player.playerDirection){
			case (0,1): rotations=0; break;
			case (1,0): rotations=1; break;
			case (0,-1): rotations=2; break;
			case (-1,0): rotations=3; break;
		}

		for (let i = 0; i<rotations; i++)
			this.availableMovement = this.rotateAvailableMovementByHalfPi(this.availableMovement);
	}

	rotateAvailableMovementByHalfPi(AvailableMovementArray){
		let fullArray = [];
		AvailableMovementArray.forEach(function (movementArray){
			let subArray = []
			movementArray.forEach(function(move){
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
		return fullArray;
	}
	*/

}





class Tile {
	constructor(color,position,border = false) {
		//set default values for new tile
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
			this.socket = new THREE.Mesh( new THREE.SphereGeometry(.25*scale), this.socketMaterial );
			this.socketMaterial.transparent=true;
			this.socketMaterial.opacity=0.0;
			//add socket to parent Object3D
			this.obj.add(this.socket);
			//raise socket to top of tile
			this.socket.translateZ(.5*scale)
		}

		//add tile to scene
		scene.add(this.obj);

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


