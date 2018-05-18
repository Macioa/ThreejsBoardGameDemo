alert("game js reporting in");

var scale = .25;

class Game {
	constructor () {
		this.board = [];
		this.pieces = [];
	}
	buildBoard(sizeX,sizeY, center = new THREE.Vector3(0,0,0)){
		this.board = [];
		var size = 8;
		
		//build board
		for (var i = 0; i <= sizeX+1; i++){
			for (var j = 0; j <= sizeY+1; j++){
				if ((i==0)||(j==-0)||(i==sizeX+1)||(j==sizeY+1))
					this.board.push(new Tile(bordercolor, new THREE.Vector2(i,j), true));
				else
				if ((i+j)%2==0)
					this.board.push(new Tile(whitetilecolor, new THREE.Vector2(i,j)));
				else 
					this.board.push(new Tile(blacktilecolor, new THREE.Vector2(i,j)));
			}
		}
		
		this.board.forEach(function(tile){
			tile.translate(new THREE.Vector3(center.x-(sizeX+2)/2, center.y-(sizeY+2)/2, center.z*scale));
		});
	}
	
}

class Player {
	constructor(name,color){
		this.name = name;
		this.color = color;
	}
}

class Token {
	constructor(startingPosition){
		this.name = name;
		this.allowedMovement = allowedMovement;
		this.position = startingPosition;
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
				case 'black': texture = blacktiletexture; break;
				case 'white': texture = whitetiletexture; break;
				case 'border': texture = bordertexture; break;
				}
			this.material = new THREE.MeshLambertMaterial( { map: texture } );
			}
		this.mesh = new THREE.Mesh( this.geometry, this.material );
		
		scene.add(this.mesh);
		
		this.mesh.translateX(this.position.x*scale);
		this.mesh.translateY(this.position.y*scale);
	}
	
	translate(vector3){
		this.mesh.translateX(vector3.x*scale);
		this.mesh.translateY(vector3.y*scale);
		this.mesh.translateZ(vector3.z*scale);
	}
}


function orderWeight(strng) {
    var arry = strng.split(" ");
    arry.sort(function (a, b) {
      var at=0, bt=0, length = a.length;
      if (b.length>length)
        length = b.length; 
      for(i = 0; i < length; i++){
        if (a[i])
          at+=a[i];
        if (b[i])
          bt+=b[i];
        }
      });
      return at > bt;
}