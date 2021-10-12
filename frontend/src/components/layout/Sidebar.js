import React, { useState, useEffect }from "react";
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { useHistory   } from 'react-router-dom';
import axios from 'axios';

export default() => {
	const history = useHistory();
	const pathname = history.location.pathname.split('/');	
	//mainLogo
	const mainLogo = localStorage.getItem("main_logo");
	
	const LoginAuth = localStorage.getItem("loginUser");	 
	let user = JSON.parse(LoginAuth);
	//error
	const [error, setError] = useState({});

	const [authRole, setAuthRole] = useState({});

	useEffect(() => {
		getPermission();
 	}, []);

 	const getPermission = () => {
 		try{
 			//let roleName = JSON.parse(LoginAuth);
 			axios.get('/api/role/'+user.role).then((res) => {
				if(res.data && res.data.data && res.data.data.permission){
					let rolePer = JSON.parse(res.data.data.permission);
					setAuthRole(rolePer);
				}
			});

		}catch(err) {
	  		err.response.data.errors && setError(err.response.data.errors);
	    }
	}

	const filtered = pathname.filter(function (el) {
			if(el !== ""){
				return el;
			}
		});
		
		let path = '/';

		if(filtered.length>=3){
			path += filtered[0]+"/"+filtered[1]+"/"+filtered[2];
		}
		else {
			path += filtered[0]+"/"+filtered[1] ?? '';
		}
		
 	return (
	  	<aside className="main-sidebar sidebar-dark-primary elevation-4">
		    <span className="brand-link">
				<img src="/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" />
				<span className="brand-text font-weight-light">{mainLogo ? mainLogo : 'AdminLTE 3'}</span>
			</span>
			
		    <div className="sidebar">
				<nav className="mt-2">
					<ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
						<li className="nav-item">
							<Link to="/dashboard" className={classNames("nav-link", {'active' : (path==='/dashboard')})}>
								<i className="nav-icon fas fa-tachometer-alt"></i>
								<p>
									Dashboard
								</p>
							</Link>
						</li>

						{user.role=='super_admin' &&
						<>
							<li className="nav-item">
								<Link to="/admin/role" className={classNames("nav-link", {'active' : (path==='/admin/role')})}>
									<i className="nav-icon fa fa-tasks" aria-hidden="true"></i>
									<p>
										Role
									</p>
								</Link>
							</li>
							<li className="nav-item">
								<Link to="/admin/user" className={classNames("nav-link", {'active' : (path==='/admin/user')})}>
									<i className="nav-icon fa fa-users" aria-hidden="true"></i>
									<p>
										Users
									</p>
								</Link>
							</li>
							<li className="nav-item">
								<Link to="/admin/category" className={classNames("nav-link", {'active' : (path==='/admin/category')})}>
									<i className="nav-icon fas fa-th"></i>
									<p>
										Category
									</p>
								</Link>
							</li>
							<li className="nav-item">
								<Link to="/admin/subcategory" className={classNames("nav-link", {'active' : (path==='/admin/subcategory')})}>
									<i className="nav-icon fas fa-th"></i>
									<p>
										SubCategory
									</p>
								</Link>
							</li>
							<li className="nav-item">
								<Link to="/admin/product" className={classNames("nav-link", {'active' : (path==='/admin/product' || path==='/admin/product/create' || path==='/admin/product/edit' || path==='/admin/product/show' || path==='/admin/product/variant')})}>
									<i className="nav-icon fa fa-list"></i>
									<p>
										Product
									</p>
								</Link>
							</li>
							<li className="nav-item">
								<Link to="/admin/setting" className={classNames("nav-link", {'active' : (path==='/admin/setting')})}>
									<i className="nav-icon fa fa-cog" aria-hidden="true"></i>
									<p>
										Setting
									</p>
								</Link>
							</li>
							<li className="nav-item">
								<Link to="/admin/promocode" className={classNames("nav-link", {'active' : (path==='/admin/promocode')})}>
									<i className="nav-icon fa fa-tag" aria-hidden="true"></i>
									<p>
										Promocode
									</p>
								</Link>
							</li>
							<li className="nav-item">
								<Link to="/admin/invoice" className={classNames("nav-link", {'active' : (path==='/admin/invoice')})}>
									<i className="nav-icon fa fa-list" aria-hidden="true"></i>
									<p>
										PO
									</p>
								</Link>
							</li>
						</>
						}

						{authRole.length>0 &&
							<>
							{authRole.includes('user') &&
								<li className="nav-item">
									<Link to="/admin/user" className={classNames("nav-link", {'active' : (path==='/admin/user')})}>
										<i className="nav-icon fa fa-user" aria-hidden="true"></i>
										<p>
											User
										</p>
									</Link>
								</li>
							}
							{authRole.includes('category') &&
								<li className="nav-item">
									<Link to="/admin/category" className={classNames("nav-link", {'active' : (path==='/admin/category')})}>
										<i className="nav-icon fas fa-th"></i>
										<p>
											Category
										</p>
									</Link>
								</li>
							}

							{authRole.includes('subcategory') &&
								<li className="nav-item">
									<Link to="/admin/subcategory" className={classNames("nav-link", {'active' : (path==='/admin/subcategory')})}>
										<i className="nav-icon fas fa-th"></i>
										<p>
											SubCategory
										</p>
									</Link>
								</li>
							}
							{authRole.includes('product') &&
								<li className="nav-item">
									<Link to="/admin/product" className={classNames("nav-link", {'active' : (path==='/admin/product' || path==='/admin/product/create' || path==='/admin/product/edit' || path==='/admin/product/show' || path==='/admin/product/variant')})}>
										<i className="nav-icon fas fa-th"></i>
										<p>
											Product
										</p>
									</Link>
								</li>
							}
							</>
						}
					
						
					</ul>
				</nav>
			</div>
		</aside>
 	);
}
