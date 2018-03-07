import React from 'react'

import { Button, Content, Section, Title } from 'bloomer';
import { tokenRepository } from '../tokenRepository.js';

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
            (platform) => <span key={platform.id}>
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

export default TokenStore;
