import React from 'react'

import { Button, Content, Section, Title } from 'bloomer';
import { tokenRepository } from '../tokenRepository.js';

class Accounts extends React.Component {
    state = {
        tokens: [],
        usernames: {},
    };

    componentDidMount() {
        this.setState({
            tokens: tokenRepository.getTokens(),
        });
    }

    fetchUsername = (platform, accessToken) => {
        const url = platform.resources.profile;

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
            const key = `${username}@${platform.id}`;
            this.setState((prevState) => {
                return {
                    ...prevState,
                    usernames: {
                        ...prevState.usernames,
                        [key]: `${username} (${platform.name})`
                    }
                };
            });
        })
        .catch(e => { console.log(e); });
    };

    fetchUsernames = () => {
        this.setState({
            usernames: {},
        });

        this.state.tokens.map(token => {
            const platform = this.props.platforms.filter(p => p.id === token.platform)[0];
            this.fetchUsername(platform, token.accessToken);
        });
    };

    render() {
        const keys = Object.keys(this.state.usernames);
        const usernames = keys.map(key => (
            <li key={key}>{this.state.usernames[key]}</li>
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
