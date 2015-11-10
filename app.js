
const Koa = require('koa');
const app = new Koa();
const route = require('koa-route');

var db = {
  'bulbasaur': { type: 'Grass', id: 1, image: 'http://img.pokemondb.net/artwork/bulbasaur.jpg'},
  'charmander': { type: 'Fire', id: 4, image: 'http://img.pokemondb.net/artwork/charmander.jpg'},
  'squirtle': { type: 'water', id: 7, image: 'http://img.pokemondb.net/artwork/squirtle.jpg'},
  'pidgey': { type: 'flying', id: 16, image: 'http://img.pokemondb.net/artwork/pidgey.jpg'},
}

var pokemons = {
  list: function *(){
    var names = Object.keys(db);
    this.body = 'pokemons: ' + names.join(', ');
  },
  show: function *(name){
    var pokemon = db[name];
    if (!pokemon) return this.throw('cannot find that pokemon', 404);
    this.body = '<html><head><title>'+ name + '</title></head><body><p>'+  name + ' is a type ' + pokemon.type + '</p><br/><img src="'+ pokemon.image+'"></body>';
  }
};

app.use(route.get('/pokemons', pokemons.list));
app.use(route.get('/pokemons/:name', pokemons.show));

app.listen(3000);
