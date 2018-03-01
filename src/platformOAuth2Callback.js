import platforms from './platforms';
import { tokenRepository } from './tokenRepository.js';

const platformOAuth2Callback = function (uri) {
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

export default platformOAuth2Callback;
