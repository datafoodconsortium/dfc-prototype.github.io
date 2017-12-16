class TokenRepository {
    getTokens() {
        if (!localStorage.getItem('tokens')) {
            return [];
        }

        return JSON.parse(localStorage.getItem('tokens'));
    }

    addToken(platform, token) {
        let tokens = this.getTokens();

        tokens.push({
            platform: platform.id,
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
