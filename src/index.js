import ClientOAuth2 from 'client-oauth2'
import React from 'react'
import { render } from 'react-dom'
import { Button, Container, Content, Hero, HeroBody, Image, Media, MediaContent, MediaLeft, Section, Subtitle, Title } from 'bloomer';
import { tokenRepository } from './tokenRepository.js';
import Accounts from './components/Accounts.jsx';
import TokenStore from './components/TokenStore.jsx';

const platforms = [
    {
        id: 'laruchequiditoui',
        name: 'La Ruche qui dit Oui !',
        client: new ClientOAuth2({
            clientId: '1_38sng3yrrd4ww0kogsk8kc0sc0wkg44sg88wcggc8sk8ggw88c',
            authorizationUri: 'http://localhost:8001/oauth/v2/auth',
            redirectUri: 'http://localhost:1234/redirect',
            scopes: ['read:email', 'read:profile'],
        }),
        resources: {
            profile: 'http://localhost:8001/api/me',
        },
    },
    {
        id: 'openfoodnetwork',
        name: 'Open Food Network',
        client: new ClientOAuth2({
            clientId: '1_38sng3yrrd4ww0kogsk8kc0sc0wkg44sg88wcggc8sk8ggw88c',
            authorizationUri: 'http://localhost:8002/oauth/v2/auth',
            redirectUri: 'http://localhost:1234/redirect',
            scopes: ['read:email', 'read:profile'],
        }),
        resources: {
            profile: 'http://localhost:8002/api/me',
        },
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
                <Media>
                    <MediaLeft>
                        <Image isSize="64x64" src="https://avatars1.githubusercontent.com/u/24959977?s=64&v=4" />
                    </MediaLeft>
                    <MediaContent>
                        <Title><a href="/">Mes catalogues</a></Title>
                        <Subtitle>Data Food Consortium Prototype</Subtitle>
                    </MediaContent>
                </Media>
            </HeroBody>
        </Hero>
        <Accounts platforms={platforms} />
        <TokenStore platforms={platforms} />
    </Container>,
    document.getElementById('root')
);
