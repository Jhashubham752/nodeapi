import React from "react";
import Helmet from 'react-helmet';

import Layout from '../../layout/Layout';

const Dashboard = () => {
 	return (
	  	<Layout>
	  		<Helmet title="Dashboard" />
		    <div>
		      <h1>This is Dashboard</h1>
		    </div>
		</Layout>
 	);
}

export default Dashboard;