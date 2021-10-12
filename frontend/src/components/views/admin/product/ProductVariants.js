import React, { useState, useEffect, useRef, useContext} from "react";
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useHistory   } from 'react-router-dom';
import ReactImageMagnify from 'react-image-magnify';
import AuthContext from '../../../../context/AuthContext';
import NumberFormat from 'react-number-format';

import Layout from '../../../layout/Layout';

const ProductVariants = (props) => {
	const history = useHistory();
	const [sending, setSending] = useState(false);
 	//product
 	const [product, setProduct] = useState({});

 	//priceCode
	const { priceCode, getCodeIcon } = useContext(AuthContext);

	//single product images
	const [ images, setImages] = useState([]);

	//single product images
	const [ single, setSingle] = useState({});
	//error
	const [error, setError] = useState({});

	// product variants
	const [variants, setVariants] = useState([]);

	// single product variants
	const [singleVariants, setSingleVariants] = useState({});
	
	// single product variants data
	const [variantsData, setVariantsData] = useState([]);

	const selectImage = item =>{
		setSingle(item);
	}
	
	const prevCountRef = useRef();

 	useEffect(() => {
 		prevCountRef.current = singleVariants;
		if(props.match.params.vid !== prevCountRef.current._id ) {
			let variantId = props.match.params.vid;
			setSingleVariants(singleVariants);
		};
		getSingleVariants();
		getVariants();
		getData();
 	}, [singleVariants, setSingleVariants]);

 	//getSingleVariants
	async function getSingleVariants(){
		try {
			let vid = props.match.params.vid;
			await axios.get('/api/variant/single/'+vid).then((res) => {
				setSingleVariants(res.data.data);
				setVariantsData(JSON.parse(res.data.data.data));	
			});
		}
		catch(err) {
			if(err && err.response && err.response.data && err.response.data.status=='denied'){
				history.push("/dashboard");
			}
    		err.response.data.errors && setError(err.response.data.errors);
	    }	
	}

 	//getVariants
	async function getVariants(){
		try {
			await axios.get('/api/variants/'+props.match.params.id).then((res) => {	
				setVariants(res.data.data);
			});
		}
		catch(err) {
			if(err && err.response && err.response.data && err.response.data.status=='denied'){
				history.push("/dashboard");
			}
	    	err.response.data.errors && setError(err.response.data.errors);
	    }	
	}

 	//products
	async function getData(){
		try {
			await axios.get('/api/product/show/'+props.match.params.id).then((res) => {	
				setProduct(res.data.data);
				setImages(res.data.images);
				setSingle(res.data.images[0])
			});
		}
		catch(err) {
			if(err && err.response && err.response.data && err.response.data.status=='denied'){
				history.push("/dashboard");
			}
	    	err.response.data.errors && setError(err.response.data.errors);
	    }	
	}
	
	return(
		<Layout>
		<Helmet title="Product Variants" />
	  		<section className="content-header">
		      <div className="container-fluid">
		        <div className="row mb-2">
		          <div className="col-sm-6">
		            <h1>Product Variants Detail</h1>
		          </div>
		        </div>
		      </div>
		    </section>

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
								<h3 className="my-3">{singleVariants.var_name}</h3>
								<p>{product.description}</p>
								<hr />
								
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
								
				                <Link to={`/admin/product/show/${product._id}`} className="item-thumb" > 
									<label className="btn btn-default text-center active">
										{product.title}
									</label>
								</Link>
								
								
								<h4>Quantity</h4>
								<div className="btn-group btn-group-toggle">
									<p>{singleVariants.var_quantity}</p>
								</div>
								<h4>Types:</h4>
								
								<div className="card-body p-0">
					                <table className="table table-striped projects">
					                  	<thead>
						                    <tr>
						                      <th>Title</th>
						                      <th>Value</th>
						                    </tr>
					                  </thead>
				                 		<tbody>
										{variantsData.length>0 && variantsData.map((type, key)=> {
											return(
												<tr key={key}>
													<td>{type.var_title}</td>
													<td>{type.var_value}</td>	
												</tr>
											)
										})}
									 	</tbody>
		                  			</table>
		             			</div>

								<div className="bg-gray py-2 px-3 mt-4">
									<h2 className="mb-0">
										Price: 
										{priceCode && priceCode=='in' ?
											<span>&#8377;</span>
										:
										<span>$</span>
										}
										<NumberFormat value={singleVariants.var_price} displayType={'text'} thousandSeparator={true} />
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
export default ProductVariants;