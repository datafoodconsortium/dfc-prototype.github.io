import React from 'react'

import { Button, Content, Section, Title } from 'bloomer';
import { tokenRepository } from '../tokenRepository.js';
import * as R from 'ramda';

class Catalog extends React.Component {
    state = {
        tokens: [],
        products: {},
    };

    componentDidMount() {
        this.setState({
            tokens: tokenRepository.getTokens(),
        });
    }

    fetchCatalog = (platform, accessToken) => {
        const url = platform.resources.catalog;

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
            const products = body.products;
            const key = `${username}@${platform.id}`;
            this.setState((prevState) => {
                return {
                    ...prevState,
                    products: {
                        ...prevState.products,
                        [key]: products
                    }
                };
            });
        })
        .catch(e => { console.log(e); });
    };

    fetchCatalogs = () => {
        this.setState({
            products: {},
        });

        this.state.tokens.map(token => {
            const platform = this.props.platforms.filter(p => p.id === token.platform)[0];
            this.fetchCatalog(platform, token.accessToken);
        });
    };

    render() {
        const keys = Object.keys(this.state.products);

        const reducer = (acc, key) => R.concat(acc, R.map(R.assoc('account', key), this.state.products[key]));
        const products = keys.reduce(reducer, []);

        return (
            <Section>
                <Title>Catalog</Title>
                <Content>
                    <table>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={index}>
                                    <td>{product.type}</td>
                                    <td>{product.nature}</td>
                                    <td>{product.account}</td>
                                    <td className="has-text-right">{product.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Button onClick={this.fetchCatalogs}>Refresh</Button>
                </Content>
            </Section>
        );
    }
}

export default Catalog;
