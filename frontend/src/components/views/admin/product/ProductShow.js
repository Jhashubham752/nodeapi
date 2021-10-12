import React, { useState, useEffect, useContext} from "react";
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useHistory   } from 'react-router-dom';
import ReactImageMagnify from 'react-image-magnify';
import AuthContext from '../../../../context/AuthContext';
import NumberFormat from 'react-number-format';

import Layout from '../../../layout/Layout';
import ContentLoader from 'react-content-loader';

const ProductShow = (props) => {
	const history = useHistory();
	const [sending, setSending] = useState(false);
 	//product
 	const [product, setProduct] = useState({});

 	//priceCode
	const { priceCode, getCodeIcon } = useContext(AuthContext);

 	//single product subcategories
	const [subcat, setSubcat] = useState({});

	//single product images
	const [ images, setImages] = useState([]);

	//single product images
	const [ single, setSingle] = useState({});
	//error
	const [error, setError] = useState({});

	// product variants
	const [variants, setVariants] = useState({});

	const selectImage = item =>{
		setSingle(item);
	}

 	useEffect(() => {
		getData();
		getVariants();
 	}, []);

 	//getVariants
	async function getVariants(){
		try {
			setSending(true);
			await axios.get('/api/variants/'+props.match.params.id).then((res) => {
				setSending(false);
				setVariants(res.data.data);
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

 	//products
	async function getData(){
		try {
			setSending(true);
			await axios.get('/api/product/show/'+props.match.params.id).then((res) => {	
				setSending(false);
				setProduct(res.data.data);
				setSubcat(res.data.data.subcat_id);
				setImages(res.data.images);
				setSingle(res.data.images[0])
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
	
	return(
		<Layout>
		<Helmet title="Product Show" />
	  		<section className="content-header">
		      <div className="container-fluid">
		        <div className="row mb-2">
		          <div className="col-sm-6">
		            <h1>Product Detail</h1>
		          </div>
		        </div>
		      </div>
		    </section>
		    {sending &&
				<ContentLoader 
				viewBox="0 0 380 100"
				style={{ width: '100%', padding: 30, }} 
	        	speed={1}
			    backgroundColor="#f3f3f3"
			    foregroundColor="#c1c5c7"
				>
				<rect x="0" y="20" rx="5" ry="5" width="70" height="70" />
			    <rect x="80" y="30" rx="4" ry="4" width="250" height="13" />
			    <rect x="80" y="60" rx="3" ry="3" width="250" height="10" />
		    	</ContentLoader>
			}
		    {(product && images.length>0) &&
		    <section className="content">
		    	<div className="card card-solid">
					<div className="card-body">
						<div className="row">
							<div className="col-12 col-sm-6">
								<h3 className="d-inline-block d-sm-none">LOWA Men’s Renegade GTX Mid Hiking Boots Review</h3>
								<div className="col-12 Box_image-container">
									<ReactImageMagnify {...{
										smallImage: {
											alt: 'items',
											isFluidWidth: true,
											src:single,
					
										},
										largeImage: {
											src: single,
											width: 1200,
											height: 1800,
										}
									}} />
								</div>
								<div className="col-12 product-image-thumbs">
								{images.length>0 && images.map((item, key) =>{ 
									return(
										<div className="product-image-thumb active">
											<img src={item} alt="Product Image" onClick={() => selectImage(item)} />
										</div>
									)
								})}
								</div>
							</div>
							<div className="col-12 col-sm-6">
								<h3 className="my-3">{product.title}</h3>
								<p>{product.description}</p>
								<hr />
								{variants.length>0 &&
								<>
							 	<h4>Available Variants</h4>

						 		{variants.length>0 && variants.map((variant, key) =>{ 
									let url = '/admin/product/variant/'+props.match.params.id+''+'/v/'+variant._id;
									return(
									<>
					                <Link to={url} key={key}>
			              				<label className="btn btn-default text-center active">
				              				{variant.var_name} 
				              			</label>
					                </Link>
					              	</>
					              	)
								})}
								</>
						        }
								<h4>Quantity</h4>
								<div className="btn-group btn-group-toggle">
									<p>{product.quantity}</p>
								</div>
								<div className="bg-gray py-2 px-3 mt-4">
									<h2 className="mb-0">
										Price: 
										{priceCode && priceCode=='in' ?
											<span>&#8377;</span>
										:
										<span>$</span>
										}
										<NumberFormat value={product.price} displayType={'text'} thousandSeparator={true} />
									</h2>
								</div>
								
							</div>
						</div>
					</div>
				</div>
		    </section>
	    	}
	  	</Layout>	
  	);
}
export default ProductShow;