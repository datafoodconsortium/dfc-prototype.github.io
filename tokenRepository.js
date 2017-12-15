class TokenRepository {
    getTokens() {
        if (!localStorage.getItem('tokens')) {
            return [];
        }

        return JSON.parse(localStorage.getItem('tokens'));
    }

    addToken(token) {
        let tokens = this.getTokens();

        tokens.push({
            accessToken: token.accessToken,
            expires: token.expires,
        });

        localStorage.setItem('tokens', JSON.stringify(tokens));
    }

    clear() {
        localStorage.removeItem('tokens');
    }
}

export let tokenRepository = new TokenRepository();
