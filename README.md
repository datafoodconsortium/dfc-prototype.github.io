# Goal

The goal of this repo is to host the work on the Data Food Consortium prototype.

## Requirements

The prototype expects two authorization servers to run on http://localhost:8001 and :8002.

See [fake-auth-server-php](https://github.com/datafoodconsortium/fake-auth-server-php) to setup a fake authorization server using Docker.

## Develop

The client app uses node modules and is bundled with [Parcel](https://parceljs.org/).

```sh
# install dependencies
npm install

# bundle with parcel
npm start

# browse!
xdg-open http://localhost:1234
```
