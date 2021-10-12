import React, { useState, useContext } from "react";
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useHistory   } from 'react-router-dom';

import Auth from '../../layout/Auth';
import TextInput from '../../shared/TextInput';
import LoadingButton from '../../shared/LoadingButton';
import AuthContext from '../../../context/AuthContext';

const Login = (props) => {
	const history = useHistory();

	const { getLoggedIn, getCodeIcon } = useContext(AuthContext);

	const [sending, setSending] = useState(false);

	const [ values, setValues] = useState({
		email:"",
		password:"",
	});

	//error
	const [error, setError] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setValues({
			...values,
			[name]: value
		});
 	};

 	

 	async function handleSubmit(e) {
		e.preventDefault();
		try{
			setSending(true);
			await axios.post('/api/auth/login', values).then((res) => {
				//console.log(res.data.user.id);
				localStorage.setItem('loginUser', JSON.stringify(res.data.user));
				setSending(false);
				getLoggedIn();
				getCodeIcon();
				history.push("/dashboard");
			});

		}catch(err) {
			setSending(false);
			//console.log(err.response.data);
	  		err.response.data.errors && setError(err.response.data.errors);
	    }
	}

 	return (
 		<Auth>
 		<Helmet title="Login" />
	  		<div className="hold-transition login-page">
				<div className="login-box">
					<div className="login-logo">
						<Link to="/"><b>Admin</b>LTE</Link>
					</div>
					<div className="card">
						<div className="card-body login-card-body">
							<p className="login-box-msg">Sign in to start your session</p>
							
							<form onSubmit={handleSubmit}>
								<TextInput
									placeholder="Email"
									name="email"
									type="email"
									value={values.email}
									onChange={handleChange}
									errors={error.email}
								/>
							
								<TextInput
									placeholder="Password"
									name="password"
									type="password"
									value={values.password}
									onChange={handleChange}
									errors={error.password}
								/>
								<div className="row">
									<div className="col-12">
										<LoadingButton
											type="submit"
											className="btn btn-primary btn-block"
											loading={sending}
										>
											Sign In
										</LoadingButton>
									</div>
								</div>
							</form>
							<p className="mb-1">
								<Link to="/forgot-password">I forgot my password</Link>
							</p>
							<p className="mb-0">
								<Link to="/register" className="text-center">Register a new membership</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</Auth>
 	);
}

export default Login;