const express = require("express");
const app = express();
const port = 3000;
const admin = require("firebase-admin");


admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://trabalho-2-redes-default-rtdb.firebaseio.com",
});

// necessário realizar o comando export GOOGLE_APPLICATION_CREDENTIALS="{local onde está o arquivo trabalho-2-redes-firebase-adminsdk-ffv7z-8ffca671cd.json}"

app.use(express.json());
app.use(express.static("public"));

const database = admin.database();
const prodRef = database.ref("/produtos");

app.get("/", (req, res) => {
  console.log("get /");
  res.redirect("/test.html");
  app.use(express.static(__dirname + "/public"));
});

app.put("/update", (req, res) => {
  //pegando a quantidade que esta no banco
  //para pegar a quantidade do produto especifico que está sendo procurado
  console.clear();
  console.log("CLICKED UPDATE BUTTON");
  
  var idForm = req.body.prod_id;
  var qtdForm = req.body.prod_qtd;
  var qtdBanco;
  var qtdUpdated;

  prodRef.once("value", function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      var childData = childSnapshot.val();

      //pegando a key para fazer o update
      var childKey = childSnapshot.key;

      //com o idForm é achado a quantidaade respectiva
      if (idForm == childData.prod_id) {
        qtdBanco = childData.prod_qtd;
        
        // Sendo realizada a conta na qual e subtraído a quantidade de itens no banco de dados, pela quantidade de iten que foram comprados
        qtdUpdated = qtdBanco - qtdForm; 
        
        // MQTT Publisher ----------------------------
        var mensageria =  [{'ID Produto': idForm}, {'Quantidade do Produto': qtdForm}];
        const mensagem = JSON.stringify(mensageria)
        var mqtt = require('mqtt');
        var client  = mqtt.connect('mqtt://192.168.1.134');
        client.on('connect', function () {
          client.publish('ESTOQUE', mensagem);
          console.log('Message Sent');
        });
       // MQTT Publisher ----------------------------
        
       prodRef
          .child(childKey)
          .update({ prod_qtd: qtdUpdated, prod_local: "prateleira" });
        console.log(
          "Quantidade atualizada!\nQuantidade anterior: ",
          qtdBanco,
          "\nQuantidade no caixa: ",
          qtdForm,
          "\nNova quantidade: ",
          qtdUpdated
        );

      } else {
        qtdUpdated = 0;
      }
    });
  });

  
});

app.listen(port, () => {
  console.log(`server CAIXA up and listening, port ${port}`);
});
