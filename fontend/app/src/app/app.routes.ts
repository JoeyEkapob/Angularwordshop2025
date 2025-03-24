import { Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { FoodtypeComponent } from './foodtype/foodtype.component';
import { FoodsizeComponent } from './foodsize/foodsize.component';
import { TasteComponent } from './taste/taste.component';
import { FoodComponent } from './food/food.component';
import { SaleComponent } from './sale/sale.component';
import { OrganuzationComponent } from './organuzation/organuzation.component';
import { BillsaleComponent } from './billsale/billsale.component';
import { ReportsumperdayComponent } from './reportsumperday/reportsumperday.component';
import { ReportsumpermonthComponent } from './reportsumpermonth/reportsumpermonth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { FoodPaginateComponent } from './food-paginate/food-paginate.component';



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
},
{
    path:'organization',
    component: OrganuzationComponent,
},
{
    path:'billsale',
    component:BillsaleComponent
}
,
{
    path:'reportsumperday',
    component:ReportsumperdayComponent,
}
,
{
    path:'reportsumpermonth',
    component:ReportsumpermonthComponent
}
,
{
    path:'dashboard',
    component:DashboardComponent,
}
,{
    path:'user',
    component:UserComponent
}  
,
{
    path:'food-paginate',
    component:FoodPaginateComponent
}
];
