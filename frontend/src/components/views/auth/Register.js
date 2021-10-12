import React, { useState, useContext} from "react";
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useHistory   } from 'react-router-dom';

import Auth from '../../layout/Auth';
import TextInput from '../../shared/TextInput';
import LoadingButton from '../../shared/LoadingButton';
import AuthContext from '../../../context/AuthContext';

const Register = () => {
	const history = useHistory();
	const { getLoggedIn, getCodeIcon } = useContext(AuthContext);

	const [sending, setSending] = useState(false);
	const [ values, setValues] = useState({
		name:"",
		email:"",
		password:"",
		password_confirmation:""
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
	 	try {
		 	setSending(true);
			await axios.post('/api/auth/register', values).then((res) => {
				setSending(false);
				getLoggedIn();
				getCodeIcon();
				const url = "/email-verify/"+`${res.data.token}`;
				history.push(url);
	      	});
	  	}catch(err) {
	  		setSending(false);
	  		//console.log(err.response.data.errors);
	    	 err.response.data.errors && setError(err.response.data.errors);
	    }
	};
 	return (
	  	<Auth>
  		<Helmet title="Register" />
    	<div className="hold-transition register-page">
			<div className="register-box">
				<div className="register-logo">
					<Link to="/"><b>Admin</b>LTE</Link>
				</div>
				
				<div className="card">
					<div className="card-body register-card-body">
						<p className="login-box-msg">Register a new membership</p>
						
						<form onSubmit={handleSubmit}>
							<TextInput
								placeholder="Name"
								name="name"
								type="text"
								value={values.name}
								onChange={handleChange}
								errors={error.name}
							/>
							
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
							<TextInput
								placeholder="Confirm password"
								type="password"
								name="password_confirmation"
								value={values.password_confirmation}
								onChange={handleChange}
								errors={error.password_confirmation}
							/>
							<div class="row">
								<div class="col-12">
									<LoadingButton
										type="submit"
										className="btn btn-primary btn-block"
										loading={sending}
									>
										Register
									</LoadingButton>
								</div>
							</div>
						</form>
						
						<Link to="/" className="text-center">I already have a membership</Link>
					</div>
				</div>
			</div>
		</div>
	</Auth>
 	);
}

export default Register;