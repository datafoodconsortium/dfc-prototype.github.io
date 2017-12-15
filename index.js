import ClientOAuth2 from 'client-oauth2'
import React from 'react'
import { render } from 'react-dom'

const platformAuth = new ClientOAuth2({
    clientId: '4_4h5htw43hrsw4scsks40g8sowco0kw08gwoo44g0osososgo4o',
    authorizationUri: 'http://localhost:8000/oauth/v2/auth',
    redirectUri: 'http://localhost:1234/redirect',
    scopes: ['read:email', 'read:profile'],
    state: '12345',
});

const oauth2Callback = function (uri) {
    platformAuth.token.getToken(uri)
        .then(function (user) {
            console.log(user);
        })
        .catch(function (err) {
            console.log(err);
        })
    ;
}

if (location.pathname === '/redirect') {
    oauth2Callback(location.href);
}

render(
    <div>
        <h1>Mes catalogues</h1>
        <a href={platformAuth.token.getUri()}>Connect to Platform</a>
    </div>,
    document.getElementById('root')
);
