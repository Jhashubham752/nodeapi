import React, { useState, useEffect } from "react";
import Helmet from 'react-helmet';
import axios from 'axios';
import swal from 'sweetalert';

import Layout from '../../layout/Layout';
import TextInput from '../../shared/TextInput';
import LoadingButton from '../../shared/LoadingButton';

const Profile = (props) => {
	const [sending, setSending] = useState(false);

	const [ values, setValues ] = useState({
		name:"",
		role:"",
		email:"",
		contact_number:"",
		status:"",
	});

	//profile info
	const [userId, setUserId] = useState({});

	useEffect(() => {
		getData();
 	}, []);

	async function getData(){
		try {
			await axios.get('/api/user').then((res) => {
				if(res.data && res.data._id){
					setValues(res.data);
					setUserId(res.data._id);
				}
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
			await axios.put('/api/profile/'+userId, values).then((res) => {
				// console.log(res);
				 setSending(false);
				 setError({});
				 swal("Updated!", "Update Successfully!", "success");
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
	  		<Helmet title="Profile" />
	  		<section className="content-header">
		      <div className="container-fluid">
		        <div className="row mb-2">
		          <div className="col-sm-6">
		            <h1>Profile Info</h1>
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
											label="Name"
											type="text"
											placeholder="Name"
											name="name"
											value={values.name}
											onChange={handleChange}
											errors={error.name}
										/>
										<TextInput
											label="Role"
											type="text"
											placeholder="Role"
											name="role"
											value={values.role}
											onChange={handleChange}
											errors={error.role}
											disabled
										/>
										<TextInput
											label="Email"
											type="email"
											placeholder="Email"
											name="email"
											value={values.email}
											onChange={handleChange}
											errors={error.email}
											disabled
										/>

										<TextInput
											label="Contact Number"
											type="number"
											placeholder="Contact Number"
											name="contact_number"
											value={values.contact_number}
											onChange={handleChange}
											errors={error.contact_number}
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
export default Profile;