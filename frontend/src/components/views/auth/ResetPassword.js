import React, { useState } from "react";
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Auth from '../../layout/Auth';
import TextInput from '../../shared/TextInput';
import LoadingButton from '../../shared/LoadingButton';

const ResetPassword = (props) => {
	
	const [sending, setSending] = useState(false);

	const [response, setResponse] = useState({});

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
 	//console.log(props.match.params.token);

 	async function handleSubmit(e) {
		e.preventDefault();
		try {
		 	setSending(true);
			await axios.post('/api/auth/reset-password/'+props.match.params.token, values).then((res) => {
				setSending(false);
				setResponse(res.data);
	      	});
	  	}catch(err) {
	  		setSending(false);
	  		//console.log(err.response.data.errors);
	    	 err.response.data.errors && setError(err.response.data.errors);
	    }
	}


 	return (
	  	<Auth>
	  		<Helmet title="Reset Password" />
	  		<div className="hold-transition login-page">
				<div className="login-box">
					<div className="login-logo">
						<Link to="/"><b>Admin</b>LTE</Link>
					</div>
					
					<div className="card">
						<div className="card-body login-card-body">
							<p className="login-box-msg">You reset your password? Here you can easily retrieve a new password.</p>
							{response.success==true &&
								<>
								<div className="success-error">
							      <span>{response.message}</span>
							    </div>
								<Link to="/">Click here to login with new password</Link>
								</>
							}
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
											Update
										</LoadingButton>
									</div>
								</div>
							</form>
						</div>
						
					</div>
				</div>
			</div>
		</Auth>
 	);
}

export default ResetPassword;