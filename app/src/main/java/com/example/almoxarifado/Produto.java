package com.example.almoxarifado;

public class Produto {

    String id;
    String nome;
    int qtd;

    public Produto(){}


    public Produto(String id, String nome, int qtd) {
        this.id = id;
        this.nome = nome;
        this.qtd = qtd;
    }

    public String getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public int getQtd() {
        return qtd;
    }
}
