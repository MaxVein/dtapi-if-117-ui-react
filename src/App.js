import { Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './common/guards/ProtectedRoute';
import { isLogged } from './common/utils';
import Login from './components/login';
import LoginRoute from './common/guards/LoginRoute';
import { useEffect, useState } from 'react';
import AdminPanel from './components/admin/AdminPanel';
function App() {
    const [authInfo, setAuthInfo] = useState({});

    useEffect(() => {
        async function isAuth() {
            const res = await isLogged();
            setAuthInfo(res);
        }

        isAuth();
    }, []);

    return (
        <div>
            <Switch>
                <Redirect path="/" to="/login" exact />
                <Route path="/student" component={() => <h1>Hello Student</h1>} />
                <Redirect path="/admin" exact to="/admin/dashboard" />
                <ProtectedRoute
                    authInfo={authInfo}
                    setAuthInfo={setAuthInfo}
                    path="/admin"
                    component={AdminPanel}
                />

                <LoginRoute
                    setAuthInfo={setAuthInfo}
                    authInfo={authInfo}
                    path="/login"
                    component={Login}
                />

                <Route path="*" component={() => <h1>404</h1>} />
            </Switch>
        </div>
    );
}

export default App;
