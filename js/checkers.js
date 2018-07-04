
//load geometry for game pieces	
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
	constructor(name, player, startingTile, geometry) {
		super(name, player, startingTile, geometry);
	}
	getAvailableMoves(){//find available moves in present state for this token. This has to be in child class, because behavior is different for each game.
		let canMoveTo = [];
		canMoveTo.push({'tile' : this.tile});

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
			else if (   (result['tile'].token.player != this.player)   &&   (result['tile'][move[move.length-1]].isOpen)   ){
				result['captured'].push(result['tile'].token);
				result['tile']=result['tile'][move[move.length-1]];
				canMoveTo.push(result);
			}
		}
		return canMoveTo;
	}

}


class Checker extends CheckerPiece {//Define specific token. In checkers, this extra sub-class is not necessary since all game pieces carry the same behavior. 
	//In more complex games, this child class will be used to define each type of game piece.
	constructor(player, startingTile, geometry) {
		super("checker", player, startingTile, geometry);

		this.defaultAllowedMovement = [
			['nw'],
			['ne']
		];
		this.allowedMovement=this.defaultAllowedMovement;
	}
}


//define behavior specific to this game
class Checkers extends Game {
	constructor(players){
		super(players);
		//name game
		this.game = "Checkers";

		//build board
		this.buildBoard(8,8);


		//build pieces
		for (let i =1; i<=3; i++){
			let s = 1;
			if (i%2==1)
				s = 2;
			for(let j = s; j<10; j+=2){
				loadedMeshes[0].rotateZ( Math.random() * 2 * Math.PI );
				let newToken = new Checker(this.players[0], this.board[i][j], loadedMeshes[0]);
				this.players[0].addToken(newToken);
			}
		}
	this.players[0].tokens[0].displayMesh.material.emissive.setHex(0x1f52a5);
	this.players[0].tokens[0].tile.mesh.material.emissive.setHex(0x1f52a5);
	//this.players[0].tokens[0].tile.e.mesh.material.emissive.setHex(0xd409ef);


	this.players[0].tokens[0].moveTo(this.players[0].tokens[0].tile.e, 0xd409ef);
	this.startNextPlayerTurn();
	}
}