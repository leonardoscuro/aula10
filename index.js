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

const mensagens = [
{Carro:"Fusca",Placa:"CMG3164",Cor:"Prata"},
{Carro:"Corsa",Placa:"FRD4486",Cor:"Preto"},
{Carro:"Vectra",Placa:"BCV3G50",Cor:"Branco"}
];

app.get('/mensagens',
    function(req, res){
        // res.send(mensagens);
        res.send(mensagens.filter(Boolean));
    }
);

app.get('/mensagens/:id',
    function(req, res){
        const id = req.params.id - 1;
        const mensagem = mensagens[id];

        if (!mensagem){
            res.send("Mensagem não encontrada");
        } else {
            res.send(mensagem);
        }
    }
)

app.post('/mensagens', 
    (req, res) => {
        console.log(req.body);
        const mensagem = req.body;
        mensagens.push(mensagem);
        res.send("criar uma mensagem.")
    }
);

app.put('/mensagens/:id',
    (req, res) => {
        const id = req.params.id - 1;
        const mensagem = req.body;
        mensagens[id] = mensagem;        
        res.send("Mensagem atualizada com sucesso.")
    }
)

app.delete('/mensagens/:id', 
    (req, res) => {
        const id = req.params.id - 1;
        delete mensagens[id];

        res.send("Mensagem removida com sucesso");
    }
);

const mongodb = require('mongodb')
const password = process.env.PASSWORD || "asdf";
console.log(password);

const connectionString = `mongodb+srv://admin:${password}@cluster0.fhdc2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const options = { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
};

(async()=>{
    const client = await mongodb.MongoClient.connect(connectionString, options);
    const db = client.db('myFirstDatabase');
    const mensagens = db.collection('mensagens');
    console.log(await mensagens.find({}).toArray());

    app.get('/database',
        async function(req, res){
        // res.send(mensagens);
        res.send(await mensagens.find({}).toArray());
    }
);

app.get('/database/:id',
    async function(req, res){
        const id = req.params.id;
        const mensagem = await mensagens.findOne(
            {_id : mongodb.ObjectID(id)}
        );
        console.log(mensagem);
        if (!mensagem){
            res.send("Mensagem não encontrada");
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

        mensagens.insertOne(mensagem);        
        res.send("criar uma mensagem.");
    }
);

app.put('/database/:id',
    async (req, res) => {
        const id = req.params.id;
        const mensagem = req.body;

        console.log(mensagem);

        delete mensagem["_id"];

        const num_mensagens = await mensagens.countDocuments({_id : mongodb.ObjectID(id)});

        if (num_mensagens !== 1) {
            res.send('Ocorreu um erro por conta do número de mensagens');
            return;
        }

        await mensagens.updateOne(
            {_id : mongodb.ObjectID(id)},
            {$set : mensagem}
        );
        
        res.send("Mensagem atualizada com sucesso.")
    }
)

app.delete('/database/:id', 
    async (req, res) => {
        const id = req.params.id;
        
        await mensagens.deleteOne({_id : mongodb.ObjectID(id)});

        res.send("Mensagem removida com sucesso");
    }
);

})();

/* jXjuGydX4MKa9BCq
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:<password>@cluster0.j7dky.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
*/