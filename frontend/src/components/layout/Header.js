import React, {useContext} from "react";
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { useHistory   } from 'react-router-dom';
import axios from 'axios';

export default() => {
	const history = useHistory();
	const { getLoggedIn } = useContext(AuthContext);
	
	async function logOut(){
		await axios.get('/api/auth/logout');
		await getLoggedIn();
		localStorage.removeItem('loginUser');
		history.push("/");
	}	

 	return (
	  	<nav className="main-header navbar navbar-expand navbar-white navbar-light">
		    <ul className="navbar-nav">
		      <li className="nav-item">
		        <Link className="nav-link" data-widget="pushmenu" to="/" role="button"><i className="fas fa-bars"></i></Link>
		      </li>
		    </ul>
		    <ul className="navbar-nav ml-auto">
			    <li className="nav-item dropdown">
		        <a className="nav-link" data-toggle="dropdown" href="#">
		          <i className="fa fa-user" aria-hidden="true"></i>
		        </a>
		        <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
		          <div className="dropdown-divider"></div>
		          <Link to="/profile" className="dropdown-item">
		           <i className="fa fa-user" aria-hidden="true"></i> Profile
		          </Link>
		          <div className="dropdown-divider"></div>
		          <Link to="/change-password" className="dropdown-item">
		           <i className="fa fa-lock" aria-hidden="true"></i> Change Password
		          </Link>
		          <div className="dropdown-divider"></div>
		          <span onClick={logOut} className="dropdown-item">
		            <i className="fa fa-power-off" aria-hidden="true"></i> Logout
		          </span>
		        </div>
		      </li>
		    </ul>
	 	</nav>
 	);
}
