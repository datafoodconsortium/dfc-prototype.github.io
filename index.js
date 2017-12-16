import ClientOAuth2 from 'client-oauth2'
import React from 'react'
import { render } from 'react-dom'
import { tokenRepository } from './tokenRepository.js';

class TokenStore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tokens: [],
        };
    }

    componentDidMount() {
        this.setState({
            tokens: tokenRepository.getTokens(),
        });
    }

    clearConnections() {
        tokenRepository.clear();
        this.setState({
            tokens: [],
        });
    }

    handleConnect(auth) {
        let array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        const state = array[0];
        localStorage.setItem('oauth2.request.state', state);
        location.href = auth.token.getUri({state: state});
    }

    render() {
        const tokenListItems = this.state.tokens.map(
            (token, index) => <li key={index}>{token.accessToken} (expires {token.expires})</li>
        );

        return (
            <div>
                <h2>Connections</h2>
                <ul>{tokenListItems}</ul>
                {tokenListItems.length > 0 && (
                    <p><button onClick={this.clearConnections.bind(this)}>Clear connections</button></p>
                )}
                <button onClick={() => this.handleConnect(platformAuth)}>Connect to Platform</button>
            </div>
        );
    }
}

const platformAuth = new ClientOAuth2({
    clientId: '4_4h5htw43hrsw4scsks40g8sowco0kw08gwoo44g0osososgo4o',
    authorizationUri: 'http://localhost:8000/oauth/v2/auth',
    redirectUri: 'http://localhost:1234/redirect',
    scopes: ['read:email', 'read:profile']
});

const platformOauth2Callback = function (uri) {
    const state = localStorage.getItem('oauth2.request.state');
    platformAuth.token.getToken(uri, {state: state})
        .then(function (user) {
            console.log(user);
            tokenRepository.addToken(user);
            location.href = '/';
        })
        .catch(function (err) {
            console.log(err);
        })
    ;
}

if (location.pathname === '/redirect') {
    platformOauth2Callback(location.href);
}

render(
    <div>
        <h1><a href="/">Mes catalogues</a></h1>
        <TokenStore />
    </div>,
    document.getElementById('root')
);
