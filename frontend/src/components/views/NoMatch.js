import React from 'react';
import { Link } from "react-router-dom";

const NoMatch = () => (
  <div className="container py-5">
	  <div className="not-found">
		<div className="text-center">
		  <h1>404</h1>
		  <p>No page found.</p>
		  <p><Link to="/">Go Back</Link></p>
		</div>
	</div>
  </div>
);

export default NoMatch;
