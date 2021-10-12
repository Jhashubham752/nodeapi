import React, { useState, useEffect } from "react";
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useHistory   } from 'react-router-dom';

import Layout from '../../../layout/Layout';
import TextInput from '../../../shared/TextInput';
import TextRadio from '../../../shared/TextRadio';
import LoadingButton from '../../../shared/LoadingButton';

const CategoryCreate = (props) => {
	const history = useHistory();
	const [sending, setSending] = useState(false);

	const [ values, setValues] = useState({
		name:"",
		status:"",
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
			await axios.post('/api/category/create', values).then((res) => {
				// console.log(res);
				 setSending(false);
				 history.push("/admin/category");
			});
		}catch(err) {
			setSending(false);
			//console.log(err.response.data);
	  		err.response.data.errors && setError(err.response.data.errors);
	    }
	}

	return(
		<Layout>
	  		<Helmet title="Category Create" />
	  		<section className="content-header">
		      <div className="container-fluid">
		        <div className="row mb-2">
		          <div className="col-sm-6">
		            <h1>Category Create</h1>
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
						
										<div className="form-group">
										<label htmlFor="status">Status</label>
											<div className="row">
												<div className="col-md-6">
													<TextRadio
														type="radio"
														name="status"
														value="active"
														onChange={handleChange}
														errors={error.status}
													/> Active
												</div>
												<div className="col-md-6">
													<TextRadio
														type="radio"
														value="inactive"
														name="status"
														onChange={handleChange}
													/> Inactive
												</div>
											</div>
										</div>
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
export default CategoryCreate;