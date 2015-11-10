
const Koa = require('koa');
const app = new Koa();
const route = require('koa-route');
const views = require('koa-views');
//const mongo = require('koa-mongo');
const monk = require('monk');
const wrap = require('co-monk');

var db = monk('localhost/pokedex');
var pokedex = wrap(db.get('pokemons'));

app.use(views('views', {

  map: {
    html: 'liquid'
  }

}));

var pokemons = {

  index: function*(){
    yield this.render('index');
  },

  list: function *(){
    var pokemons = yield pokedex.find({});// db;  //this.mongo.collection('pokemons').find();
    console.log(pokemons);
    yield this.render('list', {'pokemons': pokemons });
  },

  show: function *(name){
    var pokemon = yield pokedex.findOne({name: name});

    if(pokemon){
      yield this.render('show', {'pokemon': pokemon});
    }else{
      return this.throw('cannot find that pokemon', 404);
    }
  },

};

app.use(route.get('/', pokemons.index));
app.use(route.get('/pokemons', pokemons.list));
app.use(route.get('/pokemons/:name', pokemons.show));


app.listen(3000);
