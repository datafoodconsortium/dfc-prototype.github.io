import React from 'react'

import { Button, Content, Section, Title } from 'bloomer';
import { tokenRepository } from '../tokenRepository.js';

class Accounts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tokens: [],
            usernames: {},
        };

        this.fetchUsername = this.fetchUsername.bind(this);
        this.fetchUsernames = this.fetchUsernames.bind(this);
    }

    componentDidMount() {
        this.setState({
            tokens: tokenRepository.getTokens(),
        });
    }

    fetchUsername(url, accessToken) {
        fetch(url, {
            headers: new Headers({
                'Authorization': `Bearer ${accessToken}`,
            }),
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }

            throw "Error while fetching data.";
        })
        .then(body => {
            const username = body.username;
            this.setState((prevState) => {
                return {
                    ...prevState,
                    usernames: {
                        ...prevState.usernames,
                        [accessToken]: username
                    }
                };
            });
        })
        .catch(e => { console.log(e); });
    }

    fetchUsernames() {
        this.setState({
            usernames: {},
        });

        this.state.tokens.map(token => {
            const platform = this.props.platforms.filter(p => p.id === token.platform)[0];
            const url = platform.resources.profile;
            this.fetchUsername(url, token.accessToken);
        });
    }

    render() {
        const accessTokens = Object.keys(this.state.usernames);
        const usernames = accessTokens.map(accessToken => (
            <li key={accessToken}>{this.state.usernames[accessToken]}</li>
        ));

        return (
            <Section>
                <Title>Accounts</Title>
                <Content>
                    <ul>{usernames}</ul>
                    <Button onClick={this.fetchUsernames}>Refresh</Button>
                </Content>
            </Section>
        );
    }
}

export default Accounts;
