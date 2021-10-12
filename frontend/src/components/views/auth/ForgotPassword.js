import React, { useState } from "react";
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Auth from '../../layout/Auth';
import TextInput from '../../shared/TextInput';
import LoadingButton from '../../shared/LoadingButton';

const ForgotPassword = () => {
	const [sending, setSending] = useState(false);

	const [response, setResponse] = useState({});

	const [ values, setValues] = useState({
		email:"",
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
			await axios.post('/api/auth/forgot-password', values).then((res) => {
				setSending(false);
				setResponse(res.data);

			});

		}catch(err) {
			setSending(false);
			//console.log(err.response.data);
	  		err.response.data && setError(err.response.data);
	    }
	}


 	return (
	  	<Auth>
	  		<Helmet title="ForgotPassword" />
	  		<div className="hold-transition login-page">
				<div className="login-box">
					<div className="login-logo">
						<Link to="/"><b>Admin</b>LTE</Link>
					</div>
					
					<div className="card">
						<div className="card-body login-card-body">
							<p className="login-box-msg">You forgot your password? Here you can easily retrieve a new password.</p>
							{response.success==true&&
								<div className="success-error">
							      <span>{response.message}</span>
							    </div>
							}
							{error.success==false&&
								<div className="danger-notice">
							      <span>{error.message}</span>
							    </div>
							}
							<form onSubmit={handleSubmit}>
								<TextInput
									placeholder="Email"
									name="email"
									type="email"
									value={values.email}
									onChange={handleChange}
								/>
								
								<div className="row">
									<div className="col-12">
										<LoadingButton
											type="submit"
											className="btn btn-primary btn-block"
											loading={sending}
										>
											Submit
										</LoadingButton>
									</div>
								</div>
							</form>
							
							<p className="mt-3 mb-1">
								<Link to="/">Login</Link>
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

export default ForgotPassword;