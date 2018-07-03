alert("game js reporting in");

var scale = .25;
const tokenListener = () => {
	if (INTERSECTED){
		gameInstance.selectTile(INTERSECTED);
		gameInstance.selectedToken = INTERSECTED;
	}

}
const tileListener = () => {
	if (INTERSECTED){
		if (INTERSECTED==gameInstance.selectToken.tile.socket)
			gameInstance.selectToken();
		else gameInstance.startNextPlayerTurn();
	}
}

class Game {
	constructor (playerNames) {
		this.board = [];
		this.tokens = [];
		this.players = [];
		this.activePlayerIndex = 0;
		this.activePlayer=null;
		this.selectedToken=null;

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
		
		//build array
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
		console.log(`Starting ${this.activePlayer.name}'s turn.`);
		this.selectToken();
	}

	selectToken(){
		//set selectable objects
		selectableObjects = [];
		this.activePlayer.tokens.forEach(token => { selectableObjects.push(token.mesh) });
		//set event listeners
		document.removeEventListener('click', tileListener);
		document.addEventListener('click', tokenListener);
	}
	
	selectTile(fromTile){
		document.removeEventListener('click', tokenListener);
		this.removeLine = fromTile;
	}
}

class Player {
	constructor(name,color, playerDirection){
		this.name = name;
		this.color = color;
		this.tokens = [];
		this.playerDirection = playerDirection;
	}

	addToken(token){
		this.tokens.push(token);
	}

	rotateAvailableMovementByHalfPi(AvailableMovementArray){
		let fullArray = [];
		AvailableMovementArray.forEach(function (movementArray){
			let subArray = []
			movementArray.forEach(function(move){
				switch (move){
					case 'n':  subArray.push('e'); break;
					case 'ne':  subArray.push('se'); break;
					case 'e':  subArray.push('s'); break;
					case 'se':  subArray.push('sw'); break;
					case 's':  subArray.push('w'); break;
					case 'sw':  subArray.push('nw'); break;
					case 'w':  subArray.push('n'); break;
					case 'nw':  subArray.push('ne'); break;
				}
			});
			fullArray.push(subArray);
		});
	}
}

class Token {
	constructor(name, player, startingPosition, mesh){
		this.name = name;
		this.tile = startingPosition;
		this.player = player;
		this.defaultAllowedMovement = [];
		this.allowedMovement = this.defaultAlloweMovement;
		this.position = startingPosition;

		this.mesh = new THREE.Object3D();
		let displayMesh = mesh.clone();
		this.mesh.material = new THREE.MeshLambertMaterial( { color: this.player.color, map: checkerbumpmap } );
		this.mesh.add(displayMesh);
		scene.add(this.mesh);
		setTimeout(this.moveTo(this.tile),500);
	}

	moveTo(tile, color = null) {
		let tilePos = new THREE.Vector3(tile.obj.position.x,tile.obj.position.y,tile.obj.position.z);
		let socketPos = new THREE.Vector3(tile.socket.position.x,tile.socket.position.y,tile.socket.position.z);
		let tokenPos = new THREE.Vector3(this.mesh.position.x,this.mesh.position.y,this.mesh.position.z);
		let placementPos = tilePos.add(socketPos);
		let deltaPos = placementPos.add(tokenPos.negate());
		this.mesh.translateX(deltaPos.x);
		this.mesh.translateY(deltaPos.y);
		this.mesh.translateZ(deltaPos.z);
		/*console.log('moving from');
		console.log(this.mesh.position);
		console.log('moving to');
		console.log(tile.obj.position);
		console.log('moving by');
		console.log(deltaPos);*/

		this.tile=tile;
		if (color)
			this.tile.mesh.material.emissive.setHex(color);

		/*console.log('result: tile, token');
		console.log(this.tile.obj.position);
		console.log(this.mesh.position)*/
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
	getAvailableMoves(){
		let tiles = [];

	}

}

class Tile {
	constructor(color,position,border = false) {
		this.color = color;
		this.position = position;
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
		this.isOpen = !border;
		
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
			//this.material = checkermaterial;
			//new THREE.MeshLambertMaterial( { map: texture } );
			}
		this.obj = new THREE.Object3D();
		this.mesh = new THREE.Mesh( this.geometry, this.material.clone() );
		this.obj.add(this.mesh);
		if (!this.isBorder){
			this.socket = new THREE.Mesh( new THREE.SphereGeometry(.25*scale), );
			this.obj.add(this.socket);
			this.socket.translateZ(.5*scale)
		}

		scene.add(this.obj);

		this.obj.translateX(this.position.x*scale);
		this.obj.translateY(this.position.y*scale);
	}
	
	translate(vector3){
		this.obj.translateX(vector3.x*scale);
		this.obj.translateY(vector3.y*scale);
		this.obj.translateZ(vector3.z*scale);
	}
}


