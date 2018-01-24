import ClientOAuth2 from 'client-oauth2'
import React from 'react'
import { render } from 'react-dom'
import { Button, Container, Content, Hero, HeroBody, Section, Title } from 'bloomer';
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
            (token, index) => <li key={index}>{token.platform} {token.accessToken.substring(0, 16)}... (expires {token.expires})</li>
        );

        const connectButtons = this.props.platforms.map(
            (platform) => <span>
                <Button key={platform.id} onClick={() => this.handleConnect(platform)}>Connect to {platform.name}</Button>
                {' '}
            </span>
        );

        return (
            <Section>
                <Title>Connections</Title>
                <Title isSize={4}>Current connections</Title>
                {tokenListItems.length === 0 && 'No connection'}
                <Content>
                    <ul>{tokenListItems}</ul>
                    {tokenListItems.length > 0 && (
                        <Button isColor="warning" onClick={this.clearConnections.bind(this)}>Clear connections</Button>
                    )}
                </Content>
                <Title isSize={4}>Add connection</Title>
                {connectButtons}
            </Section>
        );
    }
}

const platforms = [
    {
        id: 'platform_1',
        name: 'Platform 1',
        client: new ClientOAuth2({
            clientId: '1_38sng3yrrd4ww0kogsk8kc0sc0wkg44sg88wcggc8sk8ggw88c',
            authorizationUri: 'http://localhost:8000/oauth/v2/auth',
            redirectUri: 'http://localhost:1234/redirect',
            scopes: ['read:email', 'read:profile'],
        }),
    },
    {
        id: 'platform_2',
        name: 'Platform 2',
        client: new ClientOAuth2({
            clientId: '1_38sng3yrrd4ww0kogsk8kc0sc0wkg44sg88wcggc8sk8ggw88c',
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
    <Container>
        <Hero isColor="primary">
            <HeroBody>
                <Title><a href="/">Mes catalogues</a></Title>
            </HeroBody>
        </Hero>
        <TokenStore platforms={platforms} />
    </Container>,
    document.getElementById('root')
);