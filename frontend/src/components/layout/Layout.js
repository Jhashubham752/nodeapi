import React from "react";
import Helmet from 'react-helmet';

import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Layout({children}){
  return (
  		<div className="hold-transition sidebar-mini layout-fixed">	
	  		<div className="wrapper"> 
	  			<Helmet titleTemplate={`%s | Inventory Management`} /> 
		  		<Header />
		  		<Sidebar />
			  		<div className="content-wrapper">
			  		    <div className="content">
	     					<div className="container">
				     			{children}
				     		</div>
				    	</div>
		      		</div>
			    <Footer />
		    </div>
	    </div>
  );
}

