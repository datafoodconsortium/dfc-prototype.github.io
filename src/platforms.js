import ClientOAuth2 from 'client-oauth2'

const platforms = [
    {
        id: 'laruchequiditoui',
        name: 'La Ruche qui dit Oui !',
        client: new ClientOAuth2({
            clientId: '1_38sng3yrrd4ww0kogsk8kc0sc0wkg44sg88wcggc8sk8ggw88c',
            authorizationUri: 'http://localhost:8001/oauth/v2/auth',
            redirectUri: 'http://localhost:1234/redirect',
            scopes: ['read:email', 'read:profile'],
        }),
        resources: {
            profile: 'http://localhost:8001/api/me',
            catalog: 'http://localhost:8001/api/catalog',
        },
    },
    {
        id: 'openfoodnetwork',
        name: 'Open Food Network',
        client: new ClientOAuth2({
            clientId: '1_38sng3yrrd4ww0kogsk8kc0sc0wkg44sg88wcggc8sk8ggw88c',
            authorizationUri: 'http://localhost:8002/oauth/v2/auth',
            redirectUri: 'http://localhost:1234/redirect',
            scopes: ['read:email', 'read:profile'],
        }),
        resources: {
            profile: 'http://localhost:8002/api/me',
            catalog: 'http://localhost:8002/api/catalog',
        },
    },
];

export default platforms;
