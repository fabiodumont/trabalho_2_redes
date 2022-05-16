const express = require("express");
const app = express();
const port = 4000;
const admin = require("firebase-admin");


admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://trabalho-2-redes-default-rtdb.firebaseio.com",
});

// var serviceAccount = require("/Users/devvetline/Redes/web_estoque/trabalho-2-redes-firebase-adminsdk-ffv7z-8ffca671cd.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://trabalho-2-redes-default-rtdb.firebaseio.com"
// });

app.use(express.json());
app.use(express.static("public"));

const database = admin.database();
const prodRefEstoque = database.ref("/produtos_estoque");
const prodRefCaixa = database.ref("/produtos");

// MQTT subscriber ----------------------------


var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://localhost:1234')
var topic = 'ESTOQUE'

client.on('message', (topic, message)=>{
    message = message.toString()
    console.log(message)
})

client.on('connect', ()=>{
    client.subscribe(topic)
})

app.get("/", (req, res) => {
  console.log("get /");
  res.redirect("/test.html");
  app.use(express.static(__dirname + "/public"));
});

/*
quando for fazer o update eu preciso pegar a quantidade que esta no banco
pegar a quantidade que ta no formulario
fazer a conta de quantidade_no_banco - quantidade_no_formulario
e ai sim fazer o update com essa nova_quantidade
*/

app.put("/update", (req, res) => {
  //pegando a quantidade que esta no banco
  //para pegar a quantidade do produto especifico que estou procurando
  //preciso do id que esta no form
  console.log('ESTOQUE UPDATED')

  var idForm = req.body.prod_id;
  var qtdForm = req.body.prod_qtd;
  var qtdBanco;
  var qtdUpdated;

  prodRefEstoque.once("value", function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      var childData = childSnapshot.val();

      //pegando a key para fazer o update
      var childKey = childSnapshot.key;
      
      //com o idForm preciso achar a qtd respectiva
      if (idForm == childData.prod_id) {
        qtdBanco = childData.prod_qtd;

        qtdUpdated = qtdBanco - qtdForm;
        
        prodRefEstoque.child(childKey).update({'prod_qtd': qtdUpdated, 'prod_local': 'estoque'})
        console.log('Quantidade atualizada!\nQuantidade anterior: ' , qtdBanco , '\nQuantidade retirada da gondola: ' , qtdForm, 
        '\nNova quantidade: ', qtdUpdated)

      } else {
        qtdUpdated = 0
      }      
    });
  });

  prodRefCaixa.once("value", function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      var childData = childSnapshot.val();

      //pegando a key para fazer o update
      var childKey = childSnapshot.key;
      
      //com o idForm preciso achar a qtd respectiva
      if (idForm == childData.prod_id) {
        var qtdBancoCaixa = childData.prod_qtd;

        qtdAddCaixa = parseInt(qtdBancoCaixa) + parseInt(qtdForm)
        
        prodRefCaixa.child(childKey).update({'prod_qtd': qtdAddCaixa, 'prod_local': 'estoque'})
        console.log('Quantidade atualizada!\nQuantidade anterior: ' , qtdBancoCaixa , '\nQuantidade na gondola: ' , qtdForm, 
        '\nNova quantidade da gondola: ', qtdAddCaixa)

      } else {
        qtdAddCaixa = 0
      }      
    });
  });



});



app.listen(port, () => {
  console.log(`server ESTOQUE up and listening, port ${port}`);
});