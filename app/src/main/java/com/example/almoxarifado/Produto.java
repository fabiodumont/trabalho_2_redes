package com.example.almoxarifado;

public class Produto {

    String prod_id;
    String prod_nome;
    String prod_local;
    int prod_qtd;

    public Produto(){}


    public Produto(String prod_id, String prod_nome, String prod_local, int prod_qtd) {
        this.prod_id = prod_id;
        this.prod_nome = prod_nome;
        this.prod_local = prod_local;
        this.prod_qtd = prod_qtd;
    }

    public String getId() {
        return prod_id;
    }

    public String getNome() {
        return prod_nome;
    }

    public String getLocal() {
        return prod_local;
    }

    public int getQtd() {
        return prod_qtd;
    }


}
