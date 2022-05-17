const express = require("express");
const app = express();
const port = 4000;
const admin = require("firebase-admin");
const LevelUpPersistence = require("mosca/lib/persistence/levelup");


admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://trabalho-2-redes-default-rtdb.firebaseio.com",
});


app.use(express.json());
app.use(express.static("public"));

const database = admin.database();
const prodRefEstoque = database.ref("/produtos_estoque");
const prodRefCaixa = database.ref("/produtos");

// MQTT subscriber ----------------------------
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://192.168.1.134')
client.on('connect', function () {
    client.subscribe('ESTOQUE')
})
client.on('message', function (topic, message) {
context = JSON.parse(message);
console.log(context);
})
// MQTT subscriber ----------------------------

app.get("/", (req, res) => {
  console.log("get /");
  res.redirect("/test.html");
  app.use(express.static(__dirname + "/public"));
});


app.put("/update", (req, res) => {
  //pegando a quantidade que esta no banco
  //para pegar a quantidade do produto especifico que estou procurando
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
      
      //com o idForm preciso achar a quantidade respectiva
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
        
        // Sendo realizada a conta na qual é somado a quantidade de itens no banco de dados, com quantidade de itens que foram retirados
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
