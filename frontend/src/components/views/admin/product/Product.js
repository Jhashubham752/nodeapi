import React, { useState, useEffect, useContext} from "react";
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useHistory   } from 'react-router-dom';
import swal from 'sweetalert';
import Modal from 'react-awesome-modal';
import Pagination from "react-js-pagination";

import Layout from '../../../layout/Layout';
import AuthContext from '../../../../context/AuthContext';
import { Code } from 'react-content-loader';
import NumberFormat from 'react-number-format';

const Product = (props) => {
	const history = useHistory();

	//pagination
	const [activePage, setActivePage] = useState(1);
	const [totalItemsCount, setTotalItemsCount] = useState(0);
	const [itemsCountPerPage, setItemsCountPerPage] = useState(0);

	//priceCode
	const { priceCode, getCodeIcon } = useContext(AuthContext);

	//products
	const [products, setProducts] = useState({});

	//single product
	const [data, setData] = useState({});

	//single product subcategories
	const [subcat, setSubcat] = useState({});

	const [sending, setSending] = useState(false);

	//single product images
	const [ images, setImages] = useState([]);
	//error
	const [error, setError] = useState({});

	useEffect(() => {
		getAllproducts();
		getCodeIcon();
 	}, [activePage]);

	//pagination
 	const handlePageChange = (page) => {
    	setActivePage(page);
 	}

	//get all products
 	async function getAllproducts(){
		try {
			setSending(true);
			await axios.get('/api/products?page='+activePage).then((res) => {
				setSending(false);
				setProducts(res.data.data);
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

	//delete product
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
				  	axios.post('/api/product/delete/'+id).then((res) => {
						//console.log(res);
						getAllproducts();
						swal("Deleted!", "Product has been deleted!", "success");
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

	//set modal
	const [modal, setModal] = useState(false);

	//show products
	const showProduct = id =>{
		try {
			 axios.get('/api/product/show/'+id).then((res) => {
				setData(res.data.data);
				setSubcat(res.data.data.subcat_id);
				setImages(res.data.images)
			});
		}
		catch(err) {
		  	if(err && err.response && err.response.data && err.response.data.status=='denied'){
				history.push("/dashboard");
			}
	    	 err.response.data.errors && setError(err.response.data.errors);
	    }
		 setModal(true);
	}

	//close modal
	const closeModal=()=>{
        setModal(false);
    }

    //modal product
    const renderProducts = () =>{
	    return(
		  	<div className="row">
		      	<div className="col-md-6">
		          	<div className="card">
		                <Modal visible={modal} width="1000" height="600" effect="fadeInUp">
		                 	<section className="content-header scrollmodal">
			      				<div className="container-fluid">
							        <div className="row">
							          	<div className="col-md-12">
								            <h3>Product Detail
								            	<div className="pull-right">
													<button className="closeModal" onClick={closeModal}><span className="close-icon">x</span></button>
												</div>
								            </h3>
							          	</div>
							          	<div className="invoice p-3 mb-3">
											<div className="row">
												<div className="col-6">
													<p className="lead">Subcategory:</p>
													<p className="text-muted well well-sm shadow-none">{subcat.name}</p>
												</div>
												<div className="col-6">
													<p className="lead">Title:</p>
													<p className="text-muted well well-sm shadow-none">{data.title}</p>
												</div>
											</div>
											<div className="row">
												<div className="col-12">
													<p className="lead">Description:</p>
													<p className="text-muted well well-sm shadow-none">{data.description}</p>
												</div>
											</div>
											<div className="row">
												<div className="col-6">
													<p className="lead">Price:</p>
													<p className="text-muted well well-sm shadow-none">
														{priceCode && priceCode=='in' ?
															<span>&#8377;</span>
														:
														<span>$</span>
														}
														<NumberFormat value={data.price} displayType={'text'} thousandSeparator={true} />
													</p>
												</div>
												<div className="col-6">
													<p className="lead">Quantity:</p>
													<p className="text-muted well well-sm shadow-none">{data.quantity}</p>
												</div>
											</div>
											<div className="row">
												<div className="col-12">
													<p className="lead">Images:</p>
													{images.length>0  && images.map((itemImg, Key) => { 
														return(
															<a href={itemImg} target="_blank">
															<img className="productimages" src={itemImg} />
															</a>
														)
													})}
												</div>
											</div>
										</div>
							      
							        </div>
					  		 	</div>
			  			 	</section>
		                   
		                </Modal>
		    		</div>
		    	</div>
			</div>
		)
	}

	return (
	  	<Layout>
	  		<Helmet title="Product" />
	  		<section className="content-header">
		      <div className="container-fluid">
		        <div className="row mb-2">
		          <div className="col-sm-6">
		            <h1>Product Details</h1>
		          </div>
		        </div>
		      </div>
		    </section>
		    <section className="content">
		      	<div className="container-fluid">
			        <div className="row">
			        {renderProducts()}
			          	<div className="col-md-12">
				            <div className="card">
				             	<div className="card-header">
				               		<h3 className="card-title">Product list</h3>
				                	<div className="card-tools">
				                 		<Link className="btn btn-success" to="/admin/product/create">+ Add Product</Link>
				                	</div>
				              	</div>
				              	<div className="card-body p-0">
					                <table className="table table-striped projects">
					                  <thead>
					                    <tr>
					                      <th>Title</th>
					                      <th>Subcategory</th>
					                      <th>Price</th>
					                      <th>Image</th>
					                      <th>Status</th>
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

					                  	{!sending && products.length>0  && products.map((item, Key) => { 
	                  						return(
	                  							<tr key={Key}>
	                  								<td>
		                  								<Link title="View" to={`/admin/product/show/${item.product._id}`}>
		                  									{item.product.title}
		                  								</Link>
	                  								</td>
	                  								<td>{item.product.subcat_id.name}</td>
	                  								<td>
		                  								{priceCode && priceCode=='in' ?
															<span>&#8377;</span>
														:
														<span>$</span>
														}
														<NumberFormat value={item.product.price} displayType={'text'} thousandSeparator={true} />
														
													</td>
	                  								<td>
			                  							<img className="productimage" src={item.img} />
	                  								</td>
	                  								<td>
	                  									{item.product.status=='active' &&
							                      			<span className="badge bg-success">Active</span>
							                      		}
							                      		{item.product.status=='inactive' &&
							                      			<span className="badge bg-danger">Inactive</span>
							                      		}
	                  								</td>
	                  								<td className="project-actions">
														<div class="dropdown">
														  	<button class="btn btn-info dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
														   	 Action
														  	</button>
														 	 <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
															    <button className="dropdown-item btn btn-warning btn-sm" title="Quick View" onClick={() => showProduct(item.product._id)}>
										                      		<i className="fa fa-eye" aria-hidden="true"></i> Quick View
										                      	</button> 
										                      	<Link className="dropdown-item btn btn-info btn-sm" title="Edit" to={`/admin/product/create/duplicate/${item.product._id}`}>
										                      		<i className="fa fa-clone" aria-hidden="true"></i> Duplicate
										                      	</Link> 
															    <Link className="dropdown-item btn btn-info btn-sm" title="Edit" to={`/admin/product/edit/${item.product._id}`}>
										                      		<i className="fas fa-pencil-alt"></i> Edit
										                      	</Link>
														      	<button className="dropdown-item btn btn-danger btn-sm" title="Delete" onClick={() => popupDelete(item.product._id)}>
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
	  	</Layout>	
  	);
}
export default Product;