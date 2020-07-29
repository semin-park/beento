import React, { useState } from 'react';
import Map from './components/Map.component';
import NavigationBar from './components/NavigationBar.component';
import { AuthContext } from './auth';

export default function App() {
    const [loginInfo, setLoginInfo] = useState({});
    const handleLogin = (response) => {
        setLoginInfo({
            accessToken: response.accessToken,
            profileObj: response.profileObj,
            tokenObj: response.tokenObj,
        });
    };
    return (
        <AuthContext.Provider value={loginInfo}>
            <div>
                <NavigationBar onLogin={handleLogin} />
                <Map />
            </div>
        </AuthContext.Provider>
    );
}
