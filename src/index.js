import React from 'react'
import { render } from 'react-dom'
import { Button, Container, Content, Hero, HeroBody, Image, Media, MediaContent, MediaLeft, Section, Subtitle, Title } from 'bloomer';
import { tokenRepository } from './tokenRepository.js';
import Accounts from './components/Accounts.jsx';
import Catalog from './components/Catalog.jsx';
import TokenStore from './components/TokenStore.jsx';
import platforms from './platforms';
import platformOAuth2Callback from './platformOAuth2Callback';

if (location.pathname === '/redirect') {
    platformOAuth2Callback(location.href);
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
                        <Title><a href="/">Products</a></Title>
                        <Subtitle>Data Food Consortium Prototype</Subtitle>
                    </MediaContent>
                </Media>
            </HeroBody>
        </Hero>
        <Catalog platforms={platforms} />
        <Accounts platforms={platforms} />
        <TokenStore platforms={platforms} />
    </Container>,
    document.getElementById('root')
);
