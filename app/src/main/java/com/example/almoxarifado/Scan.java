package com.example.almoxarifado;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.widget.TextView;
import android.widget.Toast;

import com.budiyev.android.codescanner.CodeScanner;
import com.budiyev.android.codescanner.CodeScannerView;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

import java.util.HashMap;

public class Scan extends AppCompatActivity {
    private CodeScanner mCodeScanner;
    private static final int MY_CAMERA_PERMISSION_CODE = 100;
    private static final int CAMERA_REQUEST = 1888;
    TextView tvResult;
    DatabaseReference databaseProdutos;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_scan);

        getPermissoes();

        tvResult = findViewById(R.id.tvResultProd);

        databaseProdutos = FirebaseDatabase.getInstance().getReference("produto");

        CodeScannerView scannerView = findViewById(R.id.scanner_view);
        mCodeScanner = new CodeScanner(this, scannerView);
        mCodeScanner.setDecodeCallback(result -> runOnUiThread(() -> {
            //dado do codigo de barra sao pegos aqui em result
            Toast.makeText(Scan.this, result.getText(), Toast.LENGTH_SHORT).show();
            //chamar a funcao para escrever no banco do estoque
            //conexao com a API

            tvResult.setText(result.getText());
            addProduto(result.getText());


        }));
        scannerView.setOnClickListener(view -> mCodeScanner.startPreview());
    }


    private void addProduto(String s){
        String nome = s.substring(5);
        String id = s.substring(0,5);

        //fazer os codigos de produtos minimamente realistas

        int quantidade = pegarIntent(); //fazer um dialog pedindo a quantidade dps

        HashMap<String, Object> UpdateProduto = new HashMap<>();
        UpdateProduto.put("id", id);
        UpdateProduto.put("nome", nome);
        UpdateProduto.put("qtd", quantidade);

        databaseProdutos = FirebaseDatabase.getInstance().getReference("produtos");

        databaseProdutos.child(id).updateChildren(UpdateProduto).addOnCompleteListener(task -> {
            if(task.isSuccessful()){
                Toast.makeText(Scan.this, "Estoque atualizado!", Toast.LENGTH_SHORT).show();

            } else {
                Toast.makeText(Scan.this, "Erro ao atualizar estoque!", Toast.LENGTH_SHORT).show();
            }
        });


    }

    private int pegarIntent() {
        String strQuantidade = "0";

        Intent intent = getIntent();
        if (intent != null) {
            Bundle params = intent.getExtras();
            if (params != null) {
                //aqui pegar as infos vindos do login
                strQuantidade = params.getString("intent_qtd");
            }
        }
        int quantidade = Integer.parseInt(strQuantidade);

        return Math.max(quantidade, 0); //retorna o maior entre os valores

    }

    //funcao para pegar as permissoes de camera
    private void getPermissoes() {
        if (ContextCompat.checkSelfPermission(this,
                android.Manifest.permission.CAMERA) !=
                PackageManager.PERMISSION_GRANTED
        ) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                requestPermissions(
                        new String[]{android.Manifest.permission.CAMERA},
                        5
                );
            }
        }
    }

    //assim que aceitar as permissoes
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == MY_CAMERA_PERMISSION_CODE) {
            if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(this, "Permissão para uso da Câmera concedida", Toast.LENGTH_LONG).show();
                Intent cameraIntent = new Intent(android.provider.MediaStore.ACTION_IMAGE_CAPTURE);
                startActivityForResult(cameraIntent, CAMERA_REQUEST);
            } else {
                Toast.makeText(this, "Permissão para uso da Câmera não foi concedida", Toast.LENGTH_LONG).show();
            }
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        mCodeScanner.startPreview();
    }

    @Override
    protected void onPause() {
        mCodeScanner.releaseResources();
        super.onPause();
    }
}