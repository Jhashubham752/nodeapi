import React from "react";
import Helmet from 'react-helmet';


export default function Auth({children}){
  return (
  		<>	
			<Helmet titleTemplate={`%s | Inventory Management`} /> 	
			{children}
	    </>
  );
}

