import React from "react";
import Helmet from 'react-helmet';

import Auth from '../../layout/Auth';

const EmailVerify = (props) => {
	
 	return (
	  	<Auth>
	  		<Helmet title="EmailVerify" />
	  		 <div>
		      <h1>check you email to activate your account</h1>
		    </div>
		</Auth>
 	);
}

export default EmailVerify;