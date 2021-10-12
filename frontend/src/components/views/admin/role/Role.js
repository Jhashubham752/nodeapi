import React, { useState, useEffect } from "react";
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useHistory   } from 'react-router-dom';
import swal from 'sweetalert';
import Modal from 'react-awesome-modal';
import Pagination from "react-js-pagination";

import TextInput from '../../../shared/TextInput';
import LoadingButton from '../../../shared/LoadingButton';
import Layout from '../../../layout/Layout';
import TextRadio from '../../../shared/TextRadio';
import  { Code } from 'react-content-loader';

const Role = (props) => {
	const history = useHistory();

	//pagination
	const [activePage, setActivePage] = useState(1);
	const [totalItemsCount, setTotalItemsCount] = useState(0);
	const [itemsCountPerPage, setItemsCountPerPage] = useState(0);

	//modal
	const [modal, setModal] = useState(false);

	//error
	const [error, setError] = useState({});

	const [sending, setSending] = useState(false);

	//edit key
	const [editkey, setEditkey] = useState({});

	//roles
	const [roles, setRoles] = useState([]);

	const [ values, setValues] = useState({
		role:"",
	});
	//isChecked
	const [ isChecked, setIsChecked] = useState([]);

	//open modal
	const openModal=()=>{
		setEditkey('');
		setValues({
			role:"",
		});
		setIsChecked([]);
		setError({});
 		setModal(true);
    }

 	//close modal
    const closeModal=()=>{
        setModal(false);
    }

    const handleChange = (e) => {
		const { name, value } = e.target;
		setValues({
			...values,
			[name]: value
		})
 	};

 	//checked
 	const handleCheckedChange = (e) => {
		const { name, value, checked } = e.target;
		setIsChecked([
			...isChecked,
			name,
		]);
		if (!checked) {
      		setIsChecked(isChecked.filter(item => item !== name));
    	}
 	};
 	

 	//submit
 	async function handleSubmit(e) {
		e.preventDefault();
		try{
			setSending(true);
			if(editkey){
		      	values['permission'] = isChecked;
				await axios.put('/api/role/update/'+editkey, values).then((res) => {
					setSending(false);
				 	setModal(false);
				 	getAllroles();
				});
			}
			else{
				values['permission'] = isChecked;
				await axios.post('/api/role/create', values).then((res) => {
					setSending(false);
					setModal(false);
					getAllroles();
				});
			}

		}catch(err) {
			setSending(false);
			if(err && err.response && err.response.data && err.response.data.status=='denied'){
				history.push("/dashboard");
			}
	  		err.response.data.errors && setError(err.response.data.errors);
	    }
	}

	useEffect(() => {
		getAllroles();
 	}, [activePage]);

 	//pagination
 	const handlePageChange = (page) => {
    	setActivePage(page);
 	}

 	//get all roles
 	async function getAllroles(){
		try {
			setSending(true);
			await axios.get('/api/roles?page='+activePage).then((res) => {
				setSending(false);
				setRoles(res.data.data);
				setItemsCountPerPage(res.data.per_page);
				setTotalItemsCount(res.data.total);
			});
		}
		catch(err) {
			setSending(false);
			if(err && err.response && err.response.data && err.response.data.status=='denied'){
				history.push("/dashboard");
			}
	    	err.response.data.errors && setError(err.response.data.errors);
	    }	
	}
	
	//edit modal
    const openEditModal = item => {
    	try {
			axios.get('/api/role/edit/'+item).then((res) => {
				let permission = JSON.parse(res.data.data.permission);
			 	let checkArray = [];
			 	permission.forEach(value => {
			 	 	checkArray.push(value);
			 	});

			 	setIsChecked(checkArray);
				setEditkey(item);
				setValues(res.data.data);
			});
		}
		catch(err) {
			if(err && err.response && err.response.data && err.response.data.status=='denied'){
				history.push("/dashboard");
			}
	    	err.response.data.errors && setError(err.response.data.errors);
	    }
    	setModal(true);
    	setError({});
    }

	//delete categories
	const popupDelete = id =>{
		try {
			swal({
				title: "Are you sure?",
				text: "Are you sure to Delete?",
				icon: "warning",
				buttons: true,
				dangerMode: true,
			})
			.then(willDelete => {
				if (willDelete) {
				  	axios.post('/api/role/delete/'+id).then((res) => {
						getAllroles();
						swal("Deleted!", "Role has been deleted!", "success");
					});
				}
			});
		}
		catch(err) {
			swal("Oops!", "Something went wrong!", "error");
			if(err && err.response && err.response.data && err.response.data.status=='denied'){
				history.push("/dashboard");
			}
	    	err.response.data.errors && setError(err.response.data.errors);
	    }
	}

	//table
	const renderTable = () =>{
		return(
			<section className="content">
		      	<div className="container-fluid">
			        <div className="row">
			          	<div className="col-md-12">
				            <div className="card">
				             	<div className="card-header">
				               		<h3 className="card-title">Role list</h3>
				                	<div className="card-tools">
				                 		<Link className="btn btn-success" onClick={openModal}>+ Add Role</Link>
				                	</div>
				              	</div>
				              	<div className="card-body p-0">
					                <table className="table table-striped projects">
					                  <thead>
					                    <tr>
					                      <th>Roles</th>
					                      <th>Action</th>
					                    </tr>
					                  </thead>
					                  	{sending &&
						              		<Code  
											   	style={{ width: '100%', padding: 10, }} 
								            	speed={2}
											    backgroundColor="#f3f3f3"
											    foregroundColor="#c1c5c7"
						           			/>
					              		} 
					                  	<tbody>
					                  	{!sending && roles.length>0  && roles.map((item, i) => {
	                  						return(
							                  	<tr key={i}>
							                  		<td>{item.role}</td>
							                  		<td className="project-actions">
							                  			<div class="dropdown">
														  	<button class="btn btn-info dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
														   	 Action
														  	</button>
														  	<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
									                  			<button className="dropdown-item btn btn-info btn-sm" title="Edit" onClick={() => openEditModal(item._id)}>
										                      		<i className="fas fa-pencil-alt"></i> Edit
										                      	</button>
														      	<button className="dropdown-item btn btn-danger btn-sm" title="Delete" onClick={() => popupDelete(item._id)}>
																	<i className="fas fa-trash" aria-hidden="true"></i> Delete
																</button>
															</div>
														</div>
							                  		</td>
							                  	</tr>
					                  		)
			     						})}
					                  </tbody>
				                  	</table>
				             	</div>
				            </div>
				            <div className="pagination-box">
								{(totalItemsCount>itemsCountPerPage) &&
									<Pagination
										activePage={activePage}
										itemsCountPerPage={itemsCountPerPage}
										totalItemsCount={totalItemsCount}
										pageRangeDisplayed={5}
										onChange={(page) => handlePageChange(page)}
										itemClass='page-item'
										linkClass='page-link'
							 		/>
								} 
							</div>
			          	</div>
		          	</div>
          		</div>
          	</section>
		)
	}

	//modal form
	const renderFormModal = () => {
		return(
			<div className="row">
	          	<div className="col-md-6">
		          	<div className="card">
		                <Modal visible={modal} width="600" height="450" effect="fadeInUp">
		                 	<div className="scrollmodal">
		                 	<section className="content-header">
			      				<div className="container-fluid">
							        <div className="row">
							          <div className="col-md-12">
							            <h3>Role {editkey ? 'Edit' : 'Create'}
							           		<div className="pull-right">
												<button className="closeModal" onClick={closeModal}><span className="close-icon">x</span></button>
											</div>
							            </h3>
							          </div>
							        </div>
					  		 	</div>
			  			 	</section>
		                   	<form onSubmit={handleSubmit}>
				          		<div className="card-body">
									<TextInput
										label="Name"
										type="text"
										placeholder="Enter name"
										name="role"
										value={values.role}
										onChange={handleChange}
										errors={error.role}
									/>

								<div className="form-group">
									<label htmlFor="status">Permission:</label>
									<div className="row">
										<div className="col-md-6">
											Users
											<TextRadio
												type="checkbox"
												name="user"
												value="user"
												checked={isChecked.includes('user')}
												onChange={handleCheckedChange}
											/>
										</div>
										<div className="col-md-6">
											Category
											<TextRadio
												type="checkbox"
												value="category"
												name="category"
												checked={isChecked.includes('category')}
												onChange={handleCheckedChange}
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-md-6">
											SubCategory
											<TextRadio
												type="checkbox"
												value="subcategory"
												name="subcategory"
												checked={isChecked.includes('subcategory')}
												onChange={handleCheckedChange}
											/>
										</div>
										<div className="col-md-6">
											Product
											<TextRadio
												type="checkbox"
												value="product"
												checked={isChecked.includes('product')}
												name="product"
												onChange={handleCheckedChange}
											/>
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
												{editkey ? 'Update' : 'Submit'}
											</LoadingButton>
										</div>
									</div>
		                    	</div>
		                    </form>
		                    </div>
		                </Modal>
            		</div>
            	</div>
          </div>
		)
	}



	return(
		<Layout>
	  		<Helmet title="Roles" />
	  		<section className="content-header">
		      <div className="container-fluid">
		        <div className="row mb-2">
		          <div className="col-sm-6">
		            <h1>Role Details</h1>
		          </div>
		        </div>
		      </div>
		    </section>
		    {renderFormModal()}
	     	{renderTable()}
		    
	  	</Layout>	
	);
}

export default Role;