package com.planet.app;

import android.os.Bundle;
import android.view.View;

import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        WindowInsetsControllerCompat controller =
                new WindowInsetsControllerCompat(getWindow(), getWindow().getDecorView());
        controller.setSystemBarsBehavior(
                WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        );

        View rootView = getWindow().getDecorView();

        ViewCompat.setOnApplyWindowInsetsListener(rootView, (v, insets) -> {

            Insets systemBars =
                    insets.getInsets(WindowInsetsCompat.Type.systemBars());
            Insets ime =
                    insets.getInsets(WindowInsetsCompat.Type.ime());

            int bottomInset = Math.max(systemBars.bottom, ime.bottom);

            v.setPadding(
                    systemBars.left,
                    systemBars.top,
                    systemBars.right,
                    bottomInset
            );

            return insets;
        });
    }
}
