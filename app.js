const express = require("express");
const app = express();
const port = 3000;
const admin = require("firebase-admin");

//CAIXA PUB 

var mqtt = require("mqtt");
var client = mqtt.connect("mqtt://localhost:1234");
var topic = "CAIXA INICIADO";
var message = "CAIXA!";

client.on("connect", () => {
  client.publish(topic, message);
  console.log("Message sent!", message);
});

//CAIXA PUB 


admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://trabalho-2-redes-default-rtdb.firebaseio.com",
});

// export GOOGLE_APPLICATION_CREDENTIALS="/Users/devvetline/Redes/caixa/trabalho-2-redes-firebase-adminsdk-ffv7z-8ffca671cd.json"

app.use(express.json());
app.use(express.static("public"));

const database = admin.database();
const prodRef = database.ref("/produtos");

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

      //com o idForm preciso achar a qtd respectiva
      if (idForm == childData.prod_id) {
        qtdBanco = childData.prod_qtd;

        qtdUpdated = qtdBanco - qtdForm;

        client.on("connect", () => {
          client.publish(topic, message);
          console.log("Message sent!", message);
        });

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
