import React, { useState, useEffect } from "react";
import Helmet from 'react-helmet';
import axios from 'axios';
import swal from 'sweetalert';

import Layout from '../../layout/Layout';
import TextInput from '../../shared/TextInput';
import LoadingButton from '../../shared/LoadingButton';

const ChangePassword = (props) => {
	const [sending, setSending] = useState(false);

	const [ values, setValues ] = useState({
		new_password:"",
		confirm_password:"",
		old_password:"",
	});

	//userid
	const [userId, setUserId] = useState({});

	useEffect(() => {
		getData();
 	}, []);

	async function getData(){
		try {
			await axios.get('/api/user').then((res) => {
				setUserId(res.data._id);
			});
		}
		catch(err) {
		  		//console.log(err.response.data.errors);
	    	 err.response.data.errors && setError(err.response.data.errors);
	    }	
	}

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
			await axios.put('/api/changepassword/'+userId, values).then((res) => {
				// console.log(res);
			 	setSending(false);
			  	setValues({
					new_password:"",
					confirm_password:"",
					old_password:"",
			 	});
			 	swal("Updated!", "Update Successfully!", "success");
			 	setError({});
				 /*history.push("/admin/category");*/
			});
		}catch(err) {
			setSending(false);
			//console.log(err.response.data);
	  		err.response.data.errors && setError(err.response.data.errors);
	    }
	}

	return(
		<Layout>
	  		<Helmet title="Change Password" />
	  		<section className="content-header">
		      <div className="container-fluid">
		        <div className="row mb-2">
		          <div className="col-sm-6">
		            <h1>Change Password</h1>
		          </div>
		        </div>
		      </div>
		    </section>
		    <section className="content">
		      	<div className="container-fluid">
			        <div className="row">
			          	<div className="col-md-6">
				          	<div className="card">
				          		<form onSubmit={handleSubmit}>
					          		<div className="card-body">
										<TextInput
											label="New password"
											type="password"
											placeholder="New password"
											name="new_password"
											value={values.new_password}
											onChange={handleChange}
											errors={error.new_password}
										/>

										<TextInput
											label="Confirm Password"
											type="password"
											placeholder="Confirm Password"
											name="confirm_password"
											value={values.confirm_password}
											onChange={handleChange}
											errors={error.confirm_password}
										/>

										<TextInput
											label="Old Password"
											type="password"
											placeholder="Old Password"
											name="old_password"
											value={values.old_password}
											onChange={handleChange}
											errors={error.old_password}
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
									</div>
								</form>
							</div>
          	  			</div>
	          	  	</div>
          		</div>
          	</section>
	    </Layout>
	);
}
export default ChangePassword;