import { Routes } from "@angular/router";
import { AppComponent } from "./app.component";

export const adminRoutes: Routes = [
    {
        path: '',
        component: AppComponent,
        children: [

        ]
    }
];