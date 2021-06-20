const express = require("express");
const app = express();
app.use(express.json());

// Permissões
var cors = require('cors');
app.use(cors());

// Porta que eu estou ouvindo
app.listen(process.env.PORT || 3000);

app.get('/', 
    function (req, res){    
        res.send("Hello World");
    }
);

app.get('/hello',
function (req, res){    
    res.send("Hello de novo");
    }
)

const carros = [
{Modelo:"Fusca",Placa:"CMG3164",Cor:"Prata"},
{Modelo:"Corsa",Placa:"FRD4486",Cor:"Preto"},
{Modelo:"Vectra",Placa:"BCV3G50",Cor:"Branco"}
];

app.get('/carros',
    function(req, res){
        // res.send(carros);
        res.send(carros.filter(Boolean));
    }
);

app.get('/carros/:id',
    function(req, res){
        const id = req.params.id - 1;
        const mensagem = carros[id];

        if (!mensagem){
            res.send("Informação não encontrada");
        } else {
            res.send(mensagem);
        }
    }
)

app.post('/carros', 
    (req, res) => {
        console.log(req.body);
        const mensagem = req.body;
        carros.push(mensagem);
        res.send("criar uma mensagem.")
    }
);

app.put('/carros/:id',
    (req, res) => {
        const id = req.params.id - 1;
        const mensagem = req.body;
        carros[id] = mensagem;        
        res.send("Informação atualizada com sucesso.")
    }
)

app.delete('/carros/:id', 
    (req, res) => {
        const id = req.params.id - 1;
        delete carros[id];

        res.send("Informação removida com sucesso");
    }
);

//

const mongodb = require('mongodb')
const password = process.env['PASSWORD']='iw1gqSreZ2NZuWVe';
console.log(password);

const connectionString = `mongodb+srv://admin2:${password}@cluster0.j7dky.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const options = { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
};

(async()=>{
    const client = await mongodb.MongoClient.connect(connectionString, options);
    const db = client.db('myFirstDatabase');
    const carros = db.collection('carros');
    console.log(await carros.find({}).toArray());

    app.get('/database',
        async function(req, res){
        // res.send(carros);
        res.send(await carros.find({}).toArray());
    }
);

app.get('/database/:id',
    async function(req, res){
        const id = req.params.id;
        const mensagem = await carros.findOne(
            {_id : mongodb.ObjectID(id)}
        );
        console.log(mensagem);
        if (!mensagem){
            res.send("Informação não encontrada");
        } else {
            res.send(mensagem);
        }
    }
);

app.post('/database', 
    async (req, res) => {
        console.log(req.body);
        const mensagem = req.body;
        
        delete mensagem["_id"];

        carros.insertOne(mensagem);        
        res.send("criar uma informação.");
    }
);

app.put('/database/:id',
    async (req, res) => {
        const id = req.params.id;
        const mensagem = req.body;

        console.log(mensagem);

        delete mensagem["_id"];

        const num_carros = await carros.countDocuments({_id : mongodb.ObjectID(id)});

        if (num_carros !== 1) {
            res.send('Ocorreu um erro por conta do número de informações');
            return;
        }

        await carros.updateOne(
            {_id : mongodb.ObjectID(id)},
            {$set : mensagem}
        );
        
        res.send("Informação atualizada com sucesso.")
    }
)

app.delete('/database/:id', 
    async (req, res) => {
        const id = req.params.id;
        
        await carros.deleteOne({_id : mongodb.ObjectID(id)});

        res.send("Informação removida com sucesso");
    }
);

})();

/* iw1gqSreZ2NZuWVe
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:<password>@cluster0.j7dky.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
*/