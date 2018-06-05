import React from 'react'

import { Button, Content, Panel, PanelBlock, PanelHeading, Section, Title } from 'bloomer';
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
            (token, index) => <PanelBlock key={index}>
                {token.platform}
            </PanelBlock>
        );

        const newConnectionItems = this.props.platforms.map(
            (platform) => <PanelBlock key={platform.id}>
                <Button isFullWidth isOutlined isColor="primary" onClick={() => this.handleConnect(platform)}>
                    {platform.name}
                </Button>
            </PanelBlock>
        );

        return (
            <Panel>
                <PanelHeading>Connections</PanelHeading>
                {tokenListItems.length === 0 && <PanelBlock>No connection</PanelBlock>}
                {tokenListItems}
                {tokenListItems.length > 0 && (
                    <PanelBlock>
                        <Button isFullWidth isOutlined isColor="danger" onClick={this.clearConnections.bind(this)}>
                        Clear connections
                        </Button>
                    </PanelBlock>
                )}
                <PanelHeading>Add connection</PanelHeading>
                {newConnectionItems}
            </Panel>
        );
    }
}

export default TokenStore;
