import React, {useContext} from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';

import PublicRoute from './Public';

//auth
import Login from '../components/views/auth/Login';
import Register from '../components/views/auth/Register';
import ForgotPassword from '../components/views/auth/ForgotPassword';
import ResetPassword from '../components/views/auth/ResetPassword';
import EmailVerify from '../components/views/auth/EmailVerify';
import AccountVerify from '../components/views/auth/AccountVerify';
//Dashboard
import Dashboard from '../components/views/dashboard/Dashboard';
//profile
import Profile from '../components/views/profile/Profile';

//changepassword
import ChangePassword from '../components/views/profile/ChangePassword';

//context
import AuthContext from '../context/AuthContext';
//admin
//role
import Role from '../components/views/admin/role/Role';

//user
import User from '../components/views/admin/user/User';

//category
import Category from '../components/views/admin/category/Category';

//SubCategory
import SubCategory from '../components/views/admin/subcategory/SubCategory';

//product
import Product from '../components/views/admin/product/Product';
import ProductCreate from '../components/views/admin/product/ProductCreate';
import ProductEdit from '../components/views/admin/product/ProductEdit';
import ProductShow from '../components/views/admin/product/ProductShow';
import ProductVariants from '../components/views/admin/product/ProductVariants';
import ProductDuplicate from '../components/views/admin/product/ProductDuplicate';

//setting
import Setting from '../components/views/admin/setting/Setting';

//Promocode
import Promocode from '../components/views/admin/promocode/Promocode';

//invoice
import Invoice from '../components/views/admin/invoice/Invoice';
import Search from '../components/views/admin/invoice/Search';

import NoMatch from '../components/views/NoMatch';

function Routes() {
    const { loggedIn } = useContext(AuthContext);

    return (
        <BrowserRouter>
            <Switch>
                {loggedIn==true &&
                <>
                  <PublicRoute component={EmailVerify} path="/email-verify/:token" exact />
                  <PublicRoute component={AccountVerify} path="/account-verify/:token" exact />
             	    <PublicRoute component={Dashboard} path="/" exact />
                  <PublicRoute component={Dashboard} path="/dashboard" exact />
                  <PublicRoute component={Profile} path="/profile" exact />
                  <PublicRoute component={ChangePassword} path="/change-password" exact />
                  <PublicRoute component={Role} path="/admin/role" exact />
                  <PublicRoute component={User} path="/admin/user" exact />
                  <PublicRoute component={Category} path="/admin/category" exact />
                  <PublicRoute component={SubCategory} path="/admin/subcategory" exact />
                  <PublicRoute component={Product} path="/admin/product" exact />
                  <PublicRoute component={ProductCreate} path="/admin/product/create" exact />
                  <PublicRoute component={ProductEdit} path="/admin/product/edit/:id" exact />
                  <PublicRoute component={ProductShow} path="/admin/product/show/:id" exact />
                  <PublicRoute component={ProductVariants} path="/admin/product/variant/:id/v/:vid" exact />
                  <PublicRoute component={ProductDuplicate} path="/admin/product/create/duplicate/:id" exact />
                  <PublicRoute component={Setting} path="/admin/setting" exact />
                  <PublicRoute component={Promocode} path="/admin/promocode" exact />
                  <PublicRoute component={Invoice} path="/admin/invoice" exact />
                  <PublicRoute component={Search} path="/admin/search" exact />
                </>
                }

             	{loggedIn==false &&
                    <>
                    <PublicRoute component={Login} path="/" exact />
                 	  <PublicRoute component={Register} path="/register" exact />
                    <PublicRoute component={ForgotPassword} path="/forgot-password" exact />
                    <PublicRoute component={ResetPassword} path="/reset-password/:token" exact />
                    <PublicRoute component={NoMatch} path="/" exact={false}/>
         	        </>
                }
            </Switch>
        </BrowserRouter>
    );
}

export default Routes;
