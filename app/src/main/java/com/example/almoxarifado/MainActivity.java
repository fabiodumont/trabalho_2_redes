package com.example.almoxarifado;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import android.app.AlertDialog;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.text.InputType;
import android.text.TextUtils;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.budiyev.android.codescanner.CodeScanner;
import com.budiyev.android.codescanner.CodeScannerView;
import com.budiyev.android.codescanner.DecodeCallback;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.zxing.Result;


@SuppressWarnings("ALL")
public class MainActivity extends AppCompatActivity {

    Button btnScannear;
    EditText etQuantidade;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        etQuantidade = findViewById(R.id.etQtd);
        btnScannear = findViewById(R.id.btnScan);

        btnScannear.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(etQuantidade.getText().toString().isEmpty()){
                    Toast.makeText(MainActivity.this, "Insira uma quantidade!", Toast.LENGTH_SHORT).show();
                } else {
                    Intent i = new Intent(MainActivity.this, Scan.class);
                    i.putExtra("intent_qtd", etQuantidade.getText().toString());
                    if(Integer.parseInt(etQuantidade.getText().toString()) > 0){
                        startActivity(i);
                    } else {
                        Toast.makeText(MainActivity.this, "Insira uma quantidade!", Toast.LENGTH_SHORT).show();
                    }
                }
                
            }
        });
    }


}
