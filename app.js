const Koa = require('koa');
const app = new Koa();
const route = require('koa-route');
const views = require('koa-views');
const monk = require('monk');
const wrap = require('co-monk');
const parse = require('co-body');

var db = monk('localhost/pokedex');
var pokedex = wrap(db.get('pokemons'));

app.use(views('views', {

  map: {
    html: 'swig'
  }

}));

var pokemons = {

  index: function*(){

    yield this.render('index');

  },

  list: function *(){

    var pokemons = yield pokedex.find({});

    yield this.render('list', {'pokemons': pokemons });

  },

  show: function *(name){

    var pokemon = yield pokedex.findOne({name: name});

    yield this.render('show', {'pokemon': pokemon});

  },

  add: function *(){

    if(this.method === 'GET'){

      yield this.render('new');

    }else{

      var post = yield parse(this);
      yield pokedex.insert(post);
      this.redirect('/pokemons/'+ post.name +'/' );
      yield this.render('show', {'pokemon': post});

    }

  },

};

app.use(route.get('/', pokemons.index));
app.use(route.get('/pokemons', pokemons.list));
app.use(route.get('/pokemons/:name', pokemons.show));
app.use(route.get('/new/', pokemons.add));
app.use(route.post('/new/', pokemons.add));


app.listen(3000);
