import React from "react";
import { Redirect } from "react-router";


export default function ErrorMessage(err){

	if(err && err.response && err.response.data && err.response.data.status==='denied'){
		return ( <Redirect to='/dashboard' /> );
	}
};
