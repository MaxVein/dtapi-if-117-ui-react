import React from 'react';
import { Redirect, Route } from 'react-router-dom';
const ProtectedRoute = ({ component: Component, path, authInfo, setAuthInfo }) => {
    return (
        <Route
            render={(props) => {
                if (authInfo.data?.roles) {
                    const goTo = authInfo.data.roles.includes('admin');
                    if (goTo) {
                        return <Component setAuthInfo={setAuthInfo} path={path} {...props} />;
                    } else {
                        return (
                            <Redirect
                                to={{
                                    pathname: '/student',
                                    state: { from: props.location },
                                }}
                            />
                        );
                    }
                } else if (authInfo.data?.response === 'non logged') {
                    return (
                        <Redirect
                            to={{
                                pathname: '/login',
                                state: { from: props.location },
                            }}
                        />
                    );
                }
            }}
        />
    );
};
export default ProtectedRoute;
