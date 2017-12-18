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

    handleConnect(platform) {
        let array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        const state = array[0].toString();
        localStorage.setItem('oauth2.request', JSON.stringify({state: state, platform: platform.id}));
        location.href = platform.client.token.getUri({state: state});
    }

    render() {
        const tokenListItems = this.state.tokens.map(
            (token, index) => <li key={index}>{token.platform} {token.accessToken} (expires {token.expires})</li>
        );

        const connectButtons = this.props.platforms.map(
            (platform) => <button key={platform.id} onClick={() => this.handleConnect(platform)}>Connect to {platform.name}</button>
        );

        return (
            <div>
                <h2>Connections</h2>
                <ul>{tokenListItems}</ul>
                {tokenListItems.length > 0 && (
                    <p><button onClick={this.clearConnections.bind(this)}>Clear connections</button></p>
                )}
                {connectButtons}
            </div>
        );
    }
}

const platforms = [
    {
        id: 'platform_1',
        name: 'Platform 1',
        client: new ClientOAuth2({
            clientId: '4_4h5htw43hrsw4scsks40g8sowco0kw08gwoo44g0osososgo4o',
            authorizationUri: 'http://localhost:8000/oauth/v2/auth',
            redirectUri: 'http://localhost:1234/redirect',
            scopes: ['read:email', 'read:profile'],
        }),
    },
    {
        id: 'platform_2',
        name: 'Platform 2',
        client: new ClientOAuth2({
            clientId: '4_4h5htw43hrsw4scsks40g8sowco0kw08gwoo44g0osososgo4o',
            authorizationUri: 'http://localhost:8000/oauth/v2/auth',
            redirectUri: 'http://localhost:1234/redirect',
            scopes: ['read:email', 'read:profile'],
        }),
    },
];

const platformOauth2Callback = function (uri) {
    const request = JSON.parse(localStorage.getItem('oauth2.request'));
    const platform = platforms.filter(p => p.id === request.platform)[0];
    platform.client.token.getToken(uri, {state: request.state})
        .then(function (user) {
            console.log(user);
            tokenRepository.addToken(platform, user);
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
        <TokenStore platforms={platforms} />
    </div>,
    document.getElementById('root')
);
