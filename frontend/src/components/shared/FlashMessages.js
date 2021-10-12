import React, { useState, useEffect } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default () => {
	//const { props } = usePage();
	//const { flash, errors } = props;
	//const numOfErrors = Object.keys(errors).length;

	// useEffect(() => {
	// 	if(flash.success){
	// 		toast(flash.success);
	// 	}
	// 	if(flash.error){
	// 		toast(flash.error);
	// 	}		
	// }, [flash, errors]);
		
	return (
		<ToastContainer autoClose={10000}/>
	);
};
