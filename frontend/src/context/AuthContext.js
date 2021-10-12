import React, { useState, useEffect, createContext } from "react";
import axios from 'axios';
const AuthContext = createContext();

function AuthContextProvider(props){

	//loggedIn
	const [loggedIn, setloggedIn] = useState(undefined);

	async function getLoggedIn(){
		const loggedInRes = await axios.get('/api/auth/loggedIn');
		setloggedIn(loggedInRes.data);
	}

	//priceCode
	const [priceCode, setPriceCode] = useState({});

	async function getCodeIcon(){
		const getRes = await axios.get('/api/setting');
		//console.log(getRes.data.data[0].priceCode=='in');
		const newPrice = getRes.data.data;
		if(newPrice && newPrice.priceCode==='in'){
			setPriceCode('in');
		}
		else if(newPrice && newPrice.priceCode==='us'){
			setPriceCode('us');
		}
		else{
			setPriceCode('in');
		}
	}

	useEffect(() => {
		getLoggedIn();
		getCodeIcon();
 	}, []);

 	return(
		<AuthContext.Provider value={{loggedIn, getLoggedIn, priceCode, getCodeIcon}}>
			{props.children}
		</AuthContext.Provider>
	);
}
export default AuthContext;
export { AuthContextProvider };