import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { ROUTES } from './routes';
import { isAuthenticated } from './auth.utils';

function PrivateRoute(props: RouteProps): React.ReactElement {
    const { component: Component, ...rest } = props;

    const render = props => {
        if (!isAuthenticated) {
            return <Redirect to={ROUTES.LOGIN} />;
        }

        return <Component {...props} />;
    };

    return <Route {...rest} render={render} />;
}

export default PrivateRoute;