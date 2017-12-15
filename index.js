import ClientOAuth2 from 'client-oauth2'
import React from 'react'
import { render } from 'react-dom'

class TokenRepository {
    getTokens() {
        if (!localStorage.getItem('tokens')) {
            return [];
        }

        return JSON.parse(localStorage.getItem('tokens'));
    }

    addToken(token) {
        let tokens = this.getTokens();

        tokens.push({
            accessToken: token.accessToken,
            expires: token.expires,
        });

        localStorage.setItem('tokens', JSON.stringify(tokens));
    }

    clear() {
        localStorage.removeItem('tokens');
    }
}

const tokenRepository = new TokenRepository();

class TokenStore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tokens: tokenRepository.getTokens(),
        };
    }

    clearConnections() {
        tokenRepository.clear();
        this.setState({
            tokens: [],
        });
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
                <a href={platformAuth.token.getUri()}>Connect to Platform</a>
            </div>
        );
    }
}

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
            tokenRepository.addToken(user);
            location.href = '/';
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
        <h1><a href="/">Mes catalogues</a></h1>
        <TokenStore />
    </div>,
    document.getElementById('root')
);
