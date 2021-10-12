import React, { useState, useEffect } from "react";
import Helmet from 'react-helmet';
import axios from 'axios';
import { useHistory   } from 'react-router-dom';

import Auth from '../../layout/Auth';

const AccountVerify = (props) => {
	const history = useHistory();
	//error
	const [error, setError] = useState({});

	useEffect(() => {
		verifyAccount();
 	}, []);

	async function verifyAccount(){
		try {
			await axios.post('/api/account-verify/'+props.match.params.token).then((res) => {
				if(res.data.success==true){
					history.push("/dashboard");
				}

			});
		}
		catch(err) {
		  		//console.log(err.response.data.errors);
	    	 err.response.data.errors && setError(err.response.data.errors);
	    }	
	}

 	return (
	  	<Auth>
	  		<Helmet title="Account Verify" />
		</Auth>
 	);
}

export default AccountVerify;