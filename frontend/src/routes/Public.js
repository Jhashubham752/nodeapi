import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { ROUTES } from './routes';
import { isAuthenticated } from './auth.utils';

interface PublicRouteProps {
    restricted?: boolean;
}

function PublicRoute(props: PublicRouteProps & RouteProps): React.ReactElement {
    const { component: Component, restricted = false, ...rest } = props;

    const render = props => {
        if (isAuthenticated && restricted) {
            return <Redirect to={ROUTES.DASHBOARD} />;
        }

        return <Component {...props} />;
    };

    return <Route {...rest} render={render} />;
}

export default PublicRoute;