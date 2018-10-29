import { Pokemon } from './pokemon.js';

var tipos = {
    'grass': '#78C850',
    'flying': '#A890F0',
    'poison': '#A040A0',
    'normal': '#A8A878',
    'fighting': '#C03028',
    'ground': '#E0C068',
    'rock': '#B8A038',
    'bug': '#A8B820',
    'ghost': '#705898',
    'steel': '#B8B8D0',
    'fire': '#F08030',
    'water': '#6890f0',
    'electric': '#F8D030',
    'psychic': '#F85888',
    'ice': '#98D8D8',
    'dragon': '#7038F8',
    'dark': '#705848',
    'fairy': '#EE99AC',
    'unknown': '#68A090',
    'shadow': '#68A090'
}

var color = `background: color_tipo1;
background: -moz-linear-gradient(45deg, color_tipo1 40%, color_tipo2 60%);
background: -webkit-linear-gradient(45deg, color_tipo1 40%,color_tipo2 60%);
background: linear-gradient(45deg, color_tipo1 40%,color_tipo2 60%);
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='color_tipo1', endColorstr='color_tipo2',GradientType=1 );`;

window.onload = function () {
    var listaPokemon = [];
    var xmlhttp = new XMLHttpRequest();
    var url = "https://pokeapi.co/api/v2/pokemon/";
    var selectType = document.getElementsByClassName("type");
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null);
    var content = this.document.getElementById("contenido");
    var pokemons = 0;

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            pokemons = JSON.parse(this.response).results;
            cargarPokemons("0-151", "g1");
            // listaPokemon.sort(ordenarPK)
            // fullList["g1"] = listaPokemon;
            // mostrarPokemon(listaPokemon);


        }

    }

    function cargarPokemons(rango, g) {
        if (fullList[g] == undefined) {
            var r = rango.split("-");
            var datos;
            if (r[1] == undefined) {
                datos = pokemons.slice(parseInt(r[0]));
            } else {
                datos = pokemons.slice(parseInt(r[0]), parseInt(r[1]));
            }
            console.log(datos)
            var lista = [];
            datos.forEach(pokemon => {

                var xmlhttp2 = new XMLHttpRequest();
                var url2 = pokemon.url;
                xmlhttp2.open("GET", url2, true);
                xmlhttp2.send(null);
                xmlhttp2.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {

                        var infoPokemon = JSON.parse(this.response)
                        var imgpokemon = infoPokemon.sprites.front_default;
                        var idpk = infoPokemon.id;

                        var pk = new Pokemon(pokemon.name, imgpokemon, idpk);
                        infoPokemon.types.forEach(element => {
                            pk.types.unshift(element.type.name);
                        })

                        infoPokemon.stats.forEach(element => {
                            pk.stats[element.stat.name] = element.base_stat;
                        })

                        lista.push(pk);
                        if (datos.length == lista.length) {
                            fullList[g] = lista;
                            filtrar()
                        }

                    }
                }




            });
        } else {
            filtrar()
        }

    };

    function modalPokemon(ev) {
        document.getElementById("nombrePokemon").innerHTML = ev.currentTarget.id;
        document.getElementById('id01').style.display = 'block';
    }

    function mostrarPokemon(listaPokemon) {


        content.innerHTML = "";
        listaPokemon.forEach(pokemon => {

            var card = document.createElement("article");
            card.className = "tooltip";
            var img = document.createElement("img");
            var a = document.createElement("a");
            var span = document.createElement("span");
            span.className = "tooltiptext";
            span.innerHTML = "Nombre: " + pokemon.name + "Nº" + pokemon.id + "<br>" + pokemon.getTypes() + "<br>" + pokemon.getStats();


            img.src = pokemon.img;
            a.href = pokemon.url;
            a.innerText = pokemon.name;

            card.appendChild(img);  //meto la imagen en la carta
            card.appendChild(a);    //meto el link en la carta
            card.appendChild(span);
            card.id = pokemon.id;
            card.addEventListener("click", modalPokemon);

            //Añadimos el color de fondo

            var colorpk = color;
            if (pokemon.types[1] == undefined) {
                colorpk = colorpk.split("color_tipo1").join(tipos[pokemon.types[0]]);
                colorpk = colorpk.split("color_tipo2").join(tipos[pokemon.types[0]]);
            } else {
                colorpk = colorpk.split("color_tipo1").join(tipos[pokemon.types[0]]);
                colorpk = colorpk.split("color_tipo2").join(tipos[pokemon.types[1]]);
            }

            card.style = colorpk;
            content.appendChild(card);  //meto la carta en el section "content"


        });
    }

    function ordenarPK(a, b) {
        if (a.id < b.id) {
            return -1
        }
        if (a.id > b.id) {
            return 1
        }
        return 0;
    }


    //Hacer la lista de tipos para filtrar
    for (let select of selectType) {
        var opt = document.createElement("option");

        for (let element in tipos) {
            opt = document.createElement("option");
            opt.value = element;
            opt.innerText = element;
            select.appendChild(opt);
        };
        opt.value = "";
        opt.innerText = "Mostrar todos";
        opt.selected = true;
        select.appendChild(opt);

        //cada vez que cambia el select de tipo1 o tipo2
        select.addEventListener("change", filtrar);





    }
    //funcion para buscar pokemon por nombre
    var search = document.getElementById("search");
    search.addEventListener("keyup", filtrar);


    //filtar por nombre, tipo1 y tipo2
    function filtrar() {
        listaPokemon = [];
        for (const check of checkbox) {
            if (check.checked == true) {
                listaPokemon = listaPokemon.concat(fullList[check.id]);
            }
        }
        mostrarPokemon(listaPokemon.filter(pk => {                     //para cada pokemon que en su nombre tenga las letras que tengo en la caja de busqueda
            if (pk.name.indexOf(search.value) == 0) {   // empezando por el principio del nombre,le doy true y la función filter lo mete en un array
                return true;                            //llamo a la función de mostrar pokemon y le paso el array filtrado por nombre.
            }
        }).filter(pokemon => {
            var tipo1 = document.getElementById("type1").value;
            var tipo2 = document.getElementById("type2").value;

            if (tipo1 == "" && tipo2 == "") {
                return true;
            } else if (tipo1 != "" && tipo2 != "") {
                if (pokemon.types[0] == tipo1 && pokemon.types[1] == tipo2) {
                    return true;
                }
            } else {
                if ((tipo1 == "" && tipo2 == pokemon.types[1]) || (tipo1 == pokemon.types[0] && tipo2 == "")) {
                    return true;
                }
            }
        }).sort(ordenarPokemons)
        )
    }

    var ordenar = "";
    var selectOrdenar = document.getElementById("ordenar");
    selectOrdenar.addEventListener("change", ev => {
        ordenar = ev.currentTarget.value;
        filtrar();
    })

    var orden = 0;

    function ordenarPokemons(a, b) {
        if (orden == 0) {
            if (ordenar == "") {

                if (a.id < b.id) {
                    return -1
                }
                if (a.id > b.id) {
                    return 1
                }
                return 0;

            } else {

                if (a.stats[ordenar] > b.stats[ordenar]) {
                    return -1;
                }
                if (a.stats[ordenar] < b.stats[ordenar]) {
                    return 1;
                }
                return 0;

            }
        } else {
            if (ordenar == "") {

                if (a.id < b.id) {
                    return 1
                }
                if (a.id > b.id) {
                    return -1
                }
                return 0;

            } else {

                if (a.stats[ordenar] > b.stats[ordenar]) {
                    return 1;
                }
                if (a.stats[ordenar] < b.stats[ordenar]) {
                    return -1;
                }
                return 0;

            }
        }
    }

    var cambiaOrden = document.getElementById("orden");

    cambiaOrden.addEventListener("click", function () {
        if (orden == 0) {
            orden = 1;
            cambiaOrden.innerHTML = "&uarr;";
        } else {
            orden = 0;
            cambiaOrden.innerHTML = "&darr;";
        }
        filtrar();
    })



    var checkbox = document.getElementsByClassName("generacion");
    for (let e of checkbox) {
        e.addEventListener("change", (ev) => {
            cargarPokemons(ev.currentTarget.value, ev.currentTarget.id);
        })
    }



    var fullList = {};

}