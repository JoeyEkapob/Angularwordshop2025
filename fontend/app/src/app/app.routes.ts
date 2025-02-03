import { Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { FoodtypeComponent } from './foodtype/foodtype.component';
import { FoodsizeComponent } from './foodsize/foodsize.component';



export const routes: Routes = [{
    path:'',
    component: SigninComponent,
},
{
    path:'foodtype',
    component:FoodtypeComponent
},
{
    path:'foodsize',
    component:FoodsizeComponent
}
];
