# Goal

The goal of this repo is to host the work on the Data Food Consortium prototype.

The goal of the prototype is to demonstrate interoperability between Short Food Supply
Chain (SFSC) platforms.

The prototype is a lightweight, client app that is able to:
- connect to several SFSC platforms;
- run standardized queries/commands on each platform, on behalf of a user;
- display a consolidated view of these information.

## Assumptions

The prototype is based on the following assumptions:
- all SFSC platforms involved will agree on a standardized HTTP API;
- each platform is able to handle authentication using OAuth2;
- the prototype app is registered on each platform as a OAuth2 client, using the "implicit
  grant" flow.

## Develop

### Requirements

The prototype expects two authorization servers to run on http://localhost:8001 and :8002.

See [fake-auth-server-php](https://github.com/datafoodconsortium/fake-auth-server-php) to
setup a fake authorization server using Docker.

### Run the prototype

The client app uses node modules and is bundled with [Parcel](https://parceljs.org/).

```sh
# install dependencies
npm install

# bundle with parcel
npm start

# browse!
xdg-open http://localhost:1234
```

### Run the prototype and fake OAuth servers with Docker Compose

```sh
# create a dedicated directory
mkdir datafoodconsortium
cd datafoodconsortium

# clone the prototype repo and servers
git clone git@github.com:datafoodconsortium/dfc-prototype.github.io.git
git clone git@github.com:datafoodconsortium/fake-auth-server-php.git

# create a docker-compose.yml file
cat > docker-compose.yml <<EOF
version: '2.1'

services:
    prototype:
        build: ./dfc-prototype.github.io
        ports:
            - "1234:1234"

    oauth_lrqdo:
        build: ./fake-auth-server-php
        ports:
            - "8001:8000"
        environment:
            PLATFORM_NAME: "La Ruche qui dit Oui !"
            PLATFORM_BGCOLOR: "#FBCF06"
            PLATFORM_LOGO: "https://laruchequiditoui.fr/favicon.ico"

    oauth_openfood:
        build: ./fake-auth-server-php
        ports:
            - "8002:8000"
        environment:
            PLATFORM_NAME: "Open Food Network"
            PLATFORM_BGCOLOR: "#F2795C"
            PLATFORM_LOGO: "https://www.openfoodfrance.org/favicon.ico"
EOF

# start
docker-compose up

# browse!
xdg-open http://localhost:1234
```
