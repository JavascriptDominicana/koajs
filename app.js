
const Koa = require('koa');
const app = new Koa();
const route = require('koa-route');
const views = require('koa-views');

app.use(views('views', {

  map: {
    html: 'liquid'
  }

}));

var db = [
  { name: 'bulbasaur',  type: 'Grass', id: 1, image: 'http://img.pokemondb.net/artwork/bulbasaur.jpg'},
  { name: 'charmander', type: 'Fire', id: 4, image: 'http://img.pokemondb.net/artwork/charmander.jpg'},
  { name: 'squirtle', type: 'water', id: 7, image: 'http://img.pokemondb.net/artwork/squirtle.jpg'},
  { name: 'pidgey', type: 'flying', id: 16, image: 'http://img.pokemondb.net/artwork/pidgey.jpg'},
]

var pokemons = {

  index: function*(){
    yield this.render('index');
  },

  list: function *(){
    var pokemons = db;
    yield this.render('list', {'pokemons': pokemons });
  },

  show: function *(name){
    var pokemon = get_pokemon(name);

    if(pokemon){
      yield this.render('show', {'pokemon': pokemon});
    }else{
      return this.throw('cannot find that pokemon', 404);
    }
  },

};

function get_pokemon(name){

  var pokedex = db;

  for( var i = 0, length = pokedex.length; i < length; i++){
    if(pokedex[i].name == name){
      return pokedex[i];
    }
  }
  return false;
}

app.use(route.get('/', pokemons.index));
app.use(route.get('/pokemons', pokemons.list));
app.use(route.get('/pokemons/:name', pokemons.show));


app.listen(3000);
