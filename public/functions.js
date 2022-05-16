const prodId = document.getElementById("prodId");
const prodName = '';
const prodQtd = document.getElementById("prodQtd");
const btnUpdate = document.getElementById("btnUpdate");
const prodLocal = 'Prateleira'


btnUpdate.addEventListener("click", (e) => {
  e.preventDefault();
  axios({
    method: "put",
    url: "/update",
    //aqui tem que ter todo o json
    data: {
      prod_id: prodId.value,
      prod_nome: prodName.value,
      prod_local: prodLocal,
      prod_qtd: prodQtd.value,
    },
  });
  prodId.value = ''
  prodQtd.value = ''
});