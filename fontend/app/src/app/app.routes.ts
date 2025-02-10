import { Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { FoodtypeComponent } from './foodtype/foodtype.component';
import { FoodsizeComponent } from './foodsize/foodsize.component';
import { TasteComponent } from './taste/taste.component';
import { FoodComponent } from './food/food.component';
import { SaleComponent } from './sale/sale.component';



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
},
{
    path: 'taste',
    component:TasteComponent
},{
    path:'food',
    component:FoodComponent

},
{
    path:'sale',
    component:SaleComponent
}
  
];
