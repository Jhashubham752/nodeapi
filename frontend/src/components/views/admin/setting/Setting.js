import React, { useState, useEffect, useContext} from "react";
import Helmet from 'react-helmet';
import axios from 'axios';
import { useHistory   } from 'react-router-dom';
import swal from 'sweetalert';
import Modal from 'react-awesome-modal';

import AuthContext from '../../../../context/AuthContext';

import TextInput from '../../../shared/TextInput';
import TextAreaInput from '../../../shared/TextAreaInput';
import SelectInput from '../../../shared/SelectInput';
import LoadingButton from '../../../shared/LoadingButton';
import Layout from '../../../layout/Layout';
import { Code } from 'react-content-loader';

const Setting = (props) => {
	const history = useHistory();
	//modal
	const [modal, setModal] = useState(false);

	//getCodeIcon
	const { getCodeIcon } = useContext(AuthContext);

	const [sending, setSending] = useState(false);

	//setting
	const [settings, setsettings] = useState();

	//error
	const [error, setError] = useState({});

	const [ values, setValues] = useState({
		gst_number:"",
		pan_number:"",
		company_name:"",
		contact:"",
		company_address:"",
		priceCode:"",
		taxable:"",
	});
	//edit key
	const [editkey, setEditkey] = useState([]);

	//open modal
	const openModal=()=>{
		setEditkey([]);
		setValues({
			gst_number:"",
			pan_number:"",
			company_name:"",
			contact:"",
			company_address:"",
			priceCode:"",
			taxable:"",
		});
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
		});
 	};

	useEffect(() => {
		getAllsettings();
 	}, []);

 	//get all setting
 	async function getAllsettings(){
		try {
			setSending(true);
			await axios.get('/api/setting').then((res) => {
				setSending(false);
				setsettings(res.data.data);
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

    //submit
 	async function handleSubmit(e) {
		e.preventDefault();
		try{
			setSending(true);
			if(editkey.length>0){
				await axios.put('/api/setting/update/'+editkey, values).then((res) => {
					setSending(false);
					setModal(false);
					getAllsettings();
				});
			}
			else{
				await axios.post('/api/setting/create', values).then((res) => {
					localStorage.setItem('main_logo', res.data.data.company_name);
					setSending(false);
					setModal(false);
					getAllsettings();
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

	//edit setting
	const openEditModal = item => {
		try {
			 axios.get('/api/setting/edit/'+item).then((res) => {
				//console.log(res)
				setEditkey(item);
				setValues(res.data.data);
				localStorage.setItem('main_logo', res.data.data.company_name);
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

	const popupDelete = id => {
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
				  	axios.post('/api/setting/delete/'+id).then((res) => {
						getAllsettings();
						getCodeIcon();
						localStorage.removeItem('main_logo');
						swal("Deleted!", "Setting has been deleted!", "success");
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
		      	<div className="card card-solid">
			        <div className="card-body pb-0">
		          		<div className="row d-flex align-items-stretch">
          					<div className="col-md-12 d-flex align-items-stretch">
								<div className="card bg-light col-md-12">
									<div className="card-header text-muted border-bottom-0">
										{!settings &&
										<div className="pull-right">
											<button className="btn btn-success" title="Delete" onClick={openModal}>
												+ Add
											</button>
										</div>	
										}
									</div>
									{sending &&
					              		<Code  
										   	style={{ width: '100%', padding: 10, }} 
							            	speed={2}
										    backgroundColor="#f3f3f3"
										    foregroundColor="#c1c5c7"
					           			/>
					              	}
									{!sending && settings &&
									<>
									<div className="card-body pt-0">
										<div className="row">
											<div className="col-12">
												<h2 className="lead"><b>Company Name: {settings.company_name}</b></h2>
												<p className="text-muted text-sm"><b>Tax: </b> {settings.taxable ? settings.taxable : '0' }% </p>
												<p className="text-muted text-sm"><b>GST Number: </b> {settings.gst_number} </p>
												<p className="text-muted text-sm"><b>Pan Number: </b> {settings.pan_number} </p>
												<p className="text-muted text-sm"><b>Company Address: </b> {settings.company_address} </p>
												<p className="text-muted text-sm"><b>Contact Number: </b> {settings.contact} </p>
											
												{settings.priceCode=='in' && 
													<p className="text-muted text-sm"><b>Currency Code: </b> IN (&#8377;) </p>
												}
												{settings.priceCode=='us' && 
													<p className="text-muted text-sm"><b>Currency Code: </b> US ($) </p>
												}
											</div>
										</div>
									</div>
									<div className="card-footer">
										<div className="text-right">
											<button className="btn btn-sm btn-primary" title="Edit" onClick={() => openEditModal(settings._id)}>
					                      		<i className="fas fa-pencil-alt"></i> Edit
					                      	</button> 

									      	<button className="btn btn-danger btn-sm" title="Delete" onClick={() => popupDelete(settings._id)}>
												<i className="fas fa-trash" aria-hidden="true"></i> Delete
											</button>
										</div>
									</div>	
								</>
								
								}
								</div>
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
		                <Modal visible={modal} width="700" height="550" effect="fadeInUp">
		                 	<div className="scrollmodal">
		                 	<section className="content-header">
			      				<div className="container-fluid">
							        <div className="row">
							          <div className="col-md-12">
							            <h3>Setting {editkey.length>0 ? 'Edit' : 'Create'}
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
										label="Gst Number"
										type="number"
										placeholder="Gst Number"
										name="gst_number"
										value={values.gst_number}
										onChange={handleChange}
										errors={error.gst_number}
									/>
									<TextInput
										label="Pan Number"
										type="number"
										placeholder="Pan Number"
										name="pan_number"
										value={values.pan_number}
										onChange={handleChange}
										errors={error.pan_number}
									/>
									<TextInput
										label="Company Name"
										type="text"
										placeholder="Company Name"
										name="company_name"
										value={values.company_name}
										onChange={handleChange}
										errors={error.company_name}
									/>
									<TextInput
										label="Phone Number"
										type="number"
										placeholder="Phone Number"
										name="contact"
										value={values.contact}
										onChange={handleChange}
										errors={error.contact}
									/>
									<TextInput
										label="Tax"
										type="number"
										placeholder="Tax"
										name="taxable"
										value={values.taxable}
										onChange={handleChange}
										errors={error.taxable}
									/>
									<TextAreaInput
										label="Company Address"
										type="text"
										placeholder="Company Address"
										name="company_address"
										value={values.company_address}
										onChange={handleChange}
										errors={error.company_address}
									/>
									<SelectInput
										label="Select Currency"
										placeholder="Select Currency"
										name="priceCode"
										errors={error.priceCode}
										value={values.priceCode}
										onChange={handleChange}
										>
										<option value="">Select</option>
										<option value='in' selected={values.priceCode=='in'}>IN (&#8377;)</option>
										<option value='us' selected={values.priceCode=='us'}>US ($)</option>
									</SelectInput>
										
									<div className="row">
										<div className="col-12">
											<LoadingButton
												type="submit"
												className="btn btn-primary btn-block"
												loading={sending}
											>
												{editkey.length>0 ? 'Update' : 'Submit'}
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
	  		<Helmet title="Setting" />
	  		<section className="content-header">
		      <div className="container-fluid">
		        <div className="row mb-2">
		          <div className="col-sm-6">
		            <h1>Setting Details</h1>
		          </div>
		        </div>
		      </div>
		    </section>
		    {renderFormModal()}
		    {renderTable()}
	  	</Layout>	
  	);
}
export default Setting;