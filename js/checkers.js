
//load simple geometry for game pieces	
let loader = new THREE.STLLoader();
loader.load( './mesh/CheckerSmall.stl', function ( geometry ) {
		//load checker geometry from file and store to global cache
		let checkerGeometry = new THREE.Geometry().fromBufferGeometry(geometry);
		checkerGeometry.rotateX( Math.PI );
		checkerGeometry.scale( .25/6, .25/6, .25/6 );
		loadedMeshes.push(checkerGeometry);
	} );

//Define child class for game tokens. Behavior defined here applies to all tokens in game
class CheckerPiece extends Token {

	constructor(name, player, gameInstance, startingTile, geometry) {
		super(name, player, gameInstance, startingTile, geometry);
	}

	getAvailableMoves(){//find available moves in present state for this token. This has to be in child class, because behavior is different for each game.
		let canMoveTo = [];
		canMoveTo.push({'tile' : this.tile, 'captured' : []});

		for (let move of this.allowedMovement){

			let result = {};
			result['captured'] = [];
			result['tile'] = this.tile;

			//follow the movement path
			for (let stepDirection of move){
				//if tile does not have a neighbor matching movement command assign result to null and break for loop entirely
				if (!result['tile'][stepDirection]){
					result = null;
					break;
				}
				result['tile'] = result['tile'][stepDirection];
			}

			//if result was set to null, end execution of this iteration and proceed to next item in for loop
			if (!result)
				continue;

			//if the end tile is open, add it to possible moves
			if (result['tile'].isOpen)
				canMoveTo.push(result);
			
			//if the tile contains an opponent's token and the space opposite the token is empty, the active player can 'jump' the token to capture it
			//add to possible moves and add captured token to object
			else if (   (result['tile'].token.player != this.player)   &&   (result['tile'][move[move.length-1]])  &&  (result['tile'][move[move.length-1]].isOpen)   ){
				result['captured'].push(result['tile'].token);
				result['tile']=result['tile'][move[move.length-1]];
				canMoveTo.push(result);
			}
		}
		return canMoveTo;
	}


}


class Checker extends CheckerPiece {//Define specific token. In checkers, this extra sub-class is not necessary since all game pieces carry the same behavior. Behavior could be defined in parent 'CheckerPiece' class.
	//In more complex games, this child class will be used to define each type of game piece.
	constructor(player, gameInstance, startingTile, geometry) {
		super("checker", player, gameInstance, startingTile, geometry);
		this.isKing = false;

		this.defaultAllowedMovement = [
			['nw'],
			['ne']
		];
		this.allowedMovement=this.defaultAllowedMovement;
		//rotate piece and available movement to match player direction
		this.rotateToPlayerDirection();
	}
	
	checkPromotion(){
		if(!this.isKing){
			if (!this.tile[this.player.playerDirection]) 
				this.promote();
		}
	}

	promote(){
		this.isKing=true;
		this.defaultAllowedMovement.push(['sw']);
		this.defaultAllowedMovement.push(['se']);
		this.rotateToPlayerDirection();
		let newMesh = this.displayMesh.clone();
		newMesh.translateZ(.125/4);
		this.mesh.add(newMesh);
	}
}


//define behavior specific to this game
class Checkers extends Game {
	constructor(players){
		let playerColorArray = ['#a31f01', '#161616', '#0145b2', '#b28e01'];
		super(players, playerColorArray);
		//name game
		this.name = "Checkers";

		//build board
		let offset = null;
		if (this.players.length==2){
			this.buildBoard(8,8);
			offset = 0;
		}
		else {
			this.buildBoard(14,14);
			offset = 3;
		}

		//build pieces for each player
		for (let playerIndex = 0; playerIndex<players.length; playerIndex++){
			switch (playerIndex){
				case 0: 
					for (let y = 1; y <= 3; y++){
						let s = 1;
						if (y%2==1)
							s=2;
						for (let x = s; x<9; x+=2){
							loadedMeshes[0].rotateZ( Math.random() * 2 * Math.PI );
							let newToken = new Checker(this.players[playerIndex], this, this.board[x+offset][y], loadedMeshes[0]);
							this.players[playerIndex].addToken(newToken);
						}
					}
					break;
				case 1:
					for (let y = this.board[0].length-1; y >= this.board[0].length-4; y--){
						let s = 1;
						if (y%2==1)
							s=2;
						for (let x = s; x<9; x+=2){
							loadedMeshes[0].rotateZ( Math.random() * 2 * Math.PI );
							let newToken = new Checker(this.players[playerIndex], this, this.board[x+offset][y], loadedMeshes[0]);
							this.players[playerIndex].addToken(newToken);
						}
					}
					break;
				case 2: 
					for (let x = 1; x <= 3; x++){
						let s = 1;
						if (x%2==1)
							s=2;
						for (let y = s; y<9; y+=2){
							loadedMeshes[0].rotateZ( Math.random() * 2 * Math.PI );
							let newToken = new Checker(this.players[playerIndex], this, this.board[x][y+offset], loadedMeshes[0]);
							this.players[playerIndex].addToken(newToken);
						}
					}
					break;
				case 3:
					for (let x = this.board[0].length-1; x >= this.board[0].length-4; x--){
						let s = 1;
						if (x%2==1)
							s=2;
						for (let y = s; y<9; y+=2){
							loadedMeshes[0].rotateZ( Math.random() * 2 * Math.PI );
							let newToken = new Checker(this.players[playerIndex], this, this.board[x][y+offset], loadedMeshes[0]);
							this.players[playerIndex].addToken(newToken);
						}
					}
					break;
				
			}
		}


	this.startNextPlayerTurn();
	}

	checkVictory(){
		let numPlayersOut = 0;
		let winner = null;
		this.players.forEach(player=>{
			if (!player.tokens.length){
				numPlayersOut++;
			}
			else winner=player;
		});
		if (numPlayersOut==this.players.length-1)
			alert(`${winner.name} has won the game!`);
	}
}