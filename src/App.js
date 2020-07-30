import React, { useState, useEffect } from 'react';
import Map from './components/Map.component';
import NavigationBar from './components/NavigationBar.component';
import { AuthContext } from './auth';

export default function App(props) {
    const [loginInfo, setLoginInfo] = useState({});
    useEffect(() => {
        if (props.loginInfo !== null)
            setLoginInfo(props.loginInfo);
    }, []);
    const handleLogin = (response) => {
        setLoginInfo({
            accessToken: response.accessToken,
            profileObj: response.profileObj,
            tokenObj: response.tokenObj,
        });
    };
    const handleLogout = () => {
        setLoginInfo({});
    };
    useEffect(() => {
        localStorage.setItem('beento.loginInfo', JSON.stringify(loginInfo));
    }, [loginInfo])
    return (
        <AuthContext.Provider value={loginInfo}>
            <div>
                <NavigationBar onLogin={handleLogin} onLogout={handleLogout}/>
                <Map />
            </div>
        </AuthContext.Provider>
    );
}
