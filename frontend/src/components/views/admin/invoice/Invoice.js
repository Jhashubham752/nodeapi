import React, { useState, useEffect, useCallback, useContext} from "react";
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useHistory   } from 'react-router-dom';
import swal from 'sweetalert';
import { Code } from 'react-content-loader';
import NumberFormat from 'react-number-format';
import queryString from "query-string";
import debounce from 'lodash.debounce';

import TextInput from '../../../shared/TextInput';
import TextAreaInput from '../../../shared/TextAreaInput';
import AuthContext from '../../../../context/AuthContext';
import LoadingButton from '../../../shared/LoadingButton';
import Layout from '../../../layout/Layout';

const Invoice = (props) => {
	const history = useHistory();
	//priceCode
	const { priceCode, getCodeIcon } = useContext(AuthContext);

	const [sending, setSending] = useState(false);
	//error
	const [error, setError] = useState({});
	//auth
	const LoginAuth = localStorage.getItem("loginUser");	 
	let user = JSON.parse(LoginAuth);

	//pervoiusValues
	const [ pervoiusValues, setPervoiusValues] = useState({});
	
	const [ values, setValues] = useState({
		contact:"",
		name:"",
		email:"",
		gst_number:"",
		address:"",
		cust_id:"",
		product_name:"",
		available_quantity:"",
		total_price:"",
	});

 	//search
	const [ productvalue, setProductvalue] = useState({
		keywords:"",
	});
	const [newQuantity, setNewQuantity] = useState({
		quantity:"",
	});

	//newPrice
	const [ newPrice, setNewPrice]  = useState("");

	//setProductRecord
	const [ productRecord, setProductRecord]  = useState({});
	//search suggestResult
	const [ suggestResult, setSuggestResult]  = useState([]);

	//multiple product fields
	const [inputList, setInputList] = useState([{
		product_name: "", available_quantity: "", quantity:"", total_price:""
	}]);

	//multiple product fields
	const handleChangeMutiple = (i, e) => {
	  const { name, value } = e.target;
	  const values = [...inputList];
	  values[i][name] = value;
	  setInputList(values);
	};

	const handleRemoveClick = i => {
	  const values = [...inputList];
	  values.splice(i, 1);
	  setInputList(values);
	};

	const handleAddClick = () => {
	  setInputList([...inputList, { product_name: "", available_quantity: "", quantity:"", total_price:"" }]);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setValues({
			...values,
			[name]: value
		});
 	};

 	//handleChangeQuantity
 	const handleChangeQuantity = (e) => {
 		const { name, value } = e.target;
		setNewQuantity({
			...values,
			[name]: value
		});
		getTotalPrice(value);
 	}
 	//newPrice
 	const getTotalPrice = (value) => {
 		const newPrice = value*productRecord.price;
 		setNewPrice(newPrice);
 	}

	//get customers
 	const getCustomers = async (contactVal) => {
		let query = {
			contact: contactVal,
		};

		query = queryString.stringify(query);
 		try {
			await axios.get('/api/customers?'+query).then((res) => {
				if(res && res.data && res.data.data){
					setValues(res.data.data);
				}
			});
		}
		catch(err) {
		  	if(err && err.response && err.response.data && err.response.data.status=='denied'){
				history.push("/dashboard");
			}
	    	err.response.data.errors && setError(err.response.data.errors);
	    }	
 	};

 	//search handleChangeProduct
 	const debouncedSave = useCallback(
 		debounce((value) => autoSuggest(value), 1000), [],
	);
	const handleChangeProduct = (e) => {
		const { name, value } = e.target;
		setProductvalue({
			...productvalue,
			[name]: value
		});
		const debouncedSave = debounce(() => autoSuggest(value), 1000);
		debouncedSave(value);
 	};

 	//autosuggest name
 	const autoSuggest = async (value) => {
 		let productName = {
			keywords: value
		};

		productName = queryString.stringify(productName);
 		try {
			await axios.get('/api/auto-suggest?'+productName).then((res) => {		
				setSuggestResult(res.data.data);
			});
		}
		catch(err) {
		  	if(err && err.response && err.response.data && err.response.data.status=='denied'){
				history.push("/dashboard");
			}
	    	err.response.data.errors && setError(err.response.data.errors);
	    }	
 	};

 	//get search record
 	const getSearchRecord = (search) => {
 		setProductRecord(search);
 		setProductvalue({
 			keywords:search.title
		});
		setSuggestResult([]);
 	};

 	//submit
 	async function handleSubmit(e){
		e.preventDefault();
		try{
			setSending(true);
			values['contact'] = values.contact;
			values['name'] = values.name;
			values['email'] = values.email;
			values['gst_number'] = values.gst_number;
			values['address'] = values.address;
			values['quantity'] = newQuantity.quantity;
			values['cust_id'] = user.id;
			values['product_name'] = productRecord.title;
			values['available_quantity'] = productRecord.quantity;
			values['total_price'] = newPrice;
			await axios.post('/api/invoice/create', values).then((res) => {
			 	setSending(false);
			 	setError([]);
			 	swal("Created!", "Created Successfully!", "success");
			 	setValues({
			 		contact:"", name:"", email:"", gst_number:"",
					address:"", cust_id:"", product_name:"",
					available_quantity:"", total_price:"",
			 	});  
			 	setProductRecord({});
			 	setProductvalue({keywords:""});
			 	setNewQuantity({quantity:""})
			});
		}catch(err) {
			setSending(false);
			if(err && err.response && err.response.data && err.response.data.status=='denied'){
				history.push("/dashboard");
			}
	  		err.response.data.errors && setError(err.response.data.errors);
	    }
	}
 	
	/*//search filed
 	const searchFiels = () => {
 		return(
 			<>
 			<TextInput
				type="text"
				placeholder="Search..."
				name="keywords"
				className="myInput" 
				errors={error.keywords}
				value={productvalue.keywords}
				onChange={handleChangeProduct}
				autoComplete="off"
			/>
			<ul className="myUL">
				{suggestResult && suggestResult.map((search, key) => {
					let suggestion = search.title;
					return(
						<>
						{suggestion &&
						<li key={key} onClick={() => getSearchRecord(search)}>{suggestion}</li>
						}
						</>
					);
				})}
			</ul>
			</>
		)
 	}*/

 	//data render products
	const renderTable = () => {
		return(
			<>
			<div className="card-header">
           		<h3 className="card-title">Product list</h3>
          	</div>
          	<div className="card-body">
          		<div className="row">
					<div className="col-md-4">
					 	Product Name
					</div>
					<div className="col-md-2">
					 	Available Quantity
					</div>
					<div className="col-md-2">
					 	Quantity
					</div>
					<div className="col-md-4">
					 	Total Price
					</div>
				</div>
				{inputList.map((field, i) => {
					return(
			         	<div className="row">
							<div className="col-md-4">
							  	<TextInput
									type="text"
									placeholder="Search..."
									name="keywords"
									className="myInput" 
									errors={error.keywords}
									value={productvalue.keywords}
									onChange={handleChangeProduct}
									autoComplete="off"
								/>
								<ul className="myUL">
									{suggestResult && suggestResult.map((search, key) => {
										let suggestion = search.title;
										return(
											<>
											{suggestion &&
											<li key={key} onClick={() => getSearchRecord(search)}>{suggestion}</li>
											}
											</>
										);
									})}
								</ul>
							</div>
							<div className="col-md-2">
							   {productRecord.quantity}
							</div>
							<div className="col-md-2">
							   <TextInput
									type="text"
									placeholder="Quantity"
									name="quantity"
									errors={error.quantity}
									value={newQuantity.quantity}
									onChange={handleChangeQuantity}
								/>
							</div>
							<div className="col-md-4">
							{(productRecord.title && newQuantity.quantity) &&
								<>
								{newQuantity.quantity}*{productRecord.price} =

							   	{productRecord.price &&
								<>
								{priceCode && priceCode=='in' ?
								<span> &#8377;</span>
								:
								<span> $</span>
								}
								<NumberFormat value={newPrice} displayType={'text'} thousandSeparator={true} />
								</>
								}
								</>
							}
							</div>
						</div>
					);
				})}
            </div>
            </>
		);
	}
	return(
			<Layout>
		  	<Helmet title="Invoice" />
		  		<section className="content-header">
			      <div className="container-fluid">
			        <div className="row mb-2">
			          <div className="col-sm-6">
			            <h1>Invoice Details</h1>
			          </div>
			        </div>
			      </div>
			    </section>
			    <div className="col-md-12">
			   		<div className="card">
				   		<form onSubmit={handleSubmit}>
			          		<div className="card-body">
			          			<div className="row">
									<div className="col-md-5">
									    <TextInput
											label="Contact"
											type="number"
											placeholder="Contact"
											name="contact"
											errors={error.contact}
											value={values.contact}
											onChange={handleChange}
										/>
									</div>
									<div className="checkContactdiv">
										<span className="checkContact" onClick={() => getCustomers(values.contact)}><i className="fa fa-check"></i></span>
									</div>
									
									<div className="col-md-6">
										<TextInput
											label="Name"
											type="text"
											placeholder="Name"
											name="name"
											errors={error.name}
											value={values.name}
											onChange={handleChange}
										/>
									</div>
								</div>
								<div className="row">
									<div className="col-md-6">	
										<TextInput
											label="Email"
											type="email"
											placeholder="Email"
											name="email"
											errors={error.email}
											value={values.email}
											onChange={handleChange}
										/>	
									</div>
									<div className="col-md-6">
										<TextInput
											label="Gst Number"
											type="text"
											placeholder="Gst Number"
											name="gst_number"
											errors={error.gst_number}
											value={values.gst_number}
											onChange={handleChange}
										/>
									</div>
								</div>	
								<TextAreaInput
									label="Address"
									type="text"
									placeholder="Address"
									name="address"
									errors={error.address}
									value={values.address}
									onChange={handleChange}
								/>	
					    	<hr />
					   		{renderTable()}
						</div>
						<div className="row">
							<div className="col-12">
								<LoadingButton
									type="submit"
									className="btn btn-primary"
									loading={sending}
								>
									Submit
								</LoadingButton>
							</div>
						</div>
					</form>
				</div>
			</div>
	    </Layout>
	);
}

export default Invoice;
