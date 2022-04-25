package com.example.almoxarifado;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.budiyev.android.codescanner.CodeScanner;
import com.budiyev.android.codescanner.CodeScannerView;
import com.budiyev.android.codescanner.DecodeCallback;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.mlkit.vision.barcode.BarcodeScannerOptions;
import com.google.mlkit.vision.barcode.common.Barcode;
import com.google.zxing.Result;


@SuppressWarnings("ALL")
public class MainActivity extends AppCompatActivity {
    private CodeScanner mCodeScanner;
    private static final int MY_CAMERA_PERMISSION_CODE = 100;
    private static final int CAMERA_REQUEST = 1888;
    TextView tvResult;

    DatabaseReference databaseProdutos;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        getPermissoes();

        tvResult = findViewById(R.id.tvResultProd);

        databaseProdutos = FirebaseDatabase.getInstance().getReference("produto");

        CodeScannerView scannerView = findViewById(R.id.scanner_view);
        mCodeScanner = new CodeScanner(this, scannerView);
        mCodeScanner.setDecodeCallback(new DecodeCallback() {
            @Override
            public void onDecoded(@NonNull final Result result) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        //dado do codigo de barra sao pegos aqui em result
                        Toast.makeText(MainActivity.this, result.getText(), Toast.LENGTH_SHORT).show();
                        //chamar a funcao para escrever no banco do estoque
                        //conexao com a API

                        tvResult.setText(result.getText().toString());
                        addProduto(result.getText().toString());


                    }
                });
            }
        });
        scannerView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                mCodeScanner.startPreview();
            }
        });
    }


    private void addProduto(String s){
        String nome = s;

        //fazer os codigos de produtos minimamente realistas

        int quantidade = 1; //fazer um dialog pedindo a quantidade dps

        if(!TextUtils.isEmpty(nome)){

            String id = databaseProdutos.push().getKey();
            
            Produto produto = new Produto(id, nome, quantidade);

            databaseProdutos.child(id).setValue(produto);

            Toast.makeText(this, "Leitura de produto executada com sucesso!", Toast.LENGTH_LONG).show();

        }else{
            Toast.makeText(this, "Erro na leitura!", Toast.LENGTH_SHORT).show();
        }

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