package com.example.almoxarifado;

public class Produto {

    String id;
    String nome;
    int qtd;
    String key;

    public Produto(){}


    public Produto(String id, String nome, int qtd, String key) {
        this.id = id;
        this.nome = nome;
        this.qtd = qtd;
        this.key = key;
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

    public String getKey() {
        return key;
    }


}
