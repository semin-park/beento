import React from 'react';

export const AuthContext = React.createContext({});
export const loggedIn = (loginInfo) => {
    return ('profileObj' in loginInfo);
};
