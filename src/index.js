import React from 'react'
import { render } from 'react-dom'
import { Button, Container, Content, Hero, HeroBody, Image, Media, MediaContent, MediaLeft, Section, Subtitle, Title } from 'bloomer';
import { tokenRepository } from './tokenRepository.js';
import Accounts from './components/Accounts.jsx';
import TokenStore from './components/TokenStore.jsx';
import platforms from './platforms';

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
