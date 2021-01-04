import React from 'react';
import { Redirect, Route } from 'react-router-dom';
const LoginRoute = ({ component: Component, path, authInfo, setAuthInfo }) => {
    return (
        <Route
            render={(props) => {
                if (authInfo.data?.response === 'non logged') {
                    return <Component setAuthInfo={setAuthInfo} path={path} {...props} />;
                } else if (authInfo.data?.roles) {
                    const goTo = authInfo.data.roles.includes('admin');
                    if (goTo) {
                        return (
                            <Redirect
                                to={{
                                    pathname: '/admin/dashboard',
                                    state: { from: props.location },
                                }}
                            />
                        );
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
                }
            }}
        />
    );
};
export default LoginRoute;
