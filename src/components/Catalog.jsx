import React from 'react'

import { Button, Content, Section, Title } from 'bloomer';
import { tokenRepository } from '../tokenRepository.js';

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

    fetchCatalog = (url, accessToken) => {
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
            const products = body.products;
            this.setState((prevState) => {
                return {
                    ...prevState,
                    products: {
                        ...prevState.products,
                        [accessToken]: products
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
            const url = platform.resources.catalog;
            this.fetchCatalog(url, token.accessToken);
        });
    };

    render() {
        const accessTokens = Object.keys(this.state.products);

        const reducer = (acc, val) => acc.concat(this.state.products[val]);
        const products = accessTokens.reduce(reducer, []);

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
                                    <td>{product.quantity}</td>
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
