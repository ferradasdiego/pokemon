export class Pokemon {
    constructor(name, img, id) {
        this.name = name;
        this.img = img;
        this.id = id;
        this.types = [];
        this.stats = {};
    }
    getTypes() {
        if (this.types[1] == undefined) {
            return "Tipo 1: " + this.types[0];
        } else {
            return "Tipo 1: " + this.types[0] + "<br>Tipo 2: " + this.types[1];
        }

    }

    getStats(){
        var texto="";

        for(let stat in this.stats){
            texto+=stat+":"+this.stats[stat]+"<br>";
        }
        return texto;
    }
}