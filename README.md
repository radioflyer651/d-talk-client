
# DChat2

This is the front-end for DTalk2, a multi-agent chat application.  it's written in Angular 19, though not all of the newest Angular features are used.

See the server repo for more information about this application. (https://github.com/radioflyer651/d-talk-server)

## Getting Started

For the most part, the front end works like any Angular application.  Note that, instead of running on port 4200, it's setup to run on port 54647 by default (see the angular.json file).

When running locally, be sure your servers CORS settings reflect this, by allowing `http://localhost:54647`.  Of course, you can change this to anything you like though.

`environment.ts` & `environment.development.ts`:
  - **Note about Port**: When running locally, it's important to run on a different port.  As you can see from my production configuration, I use the same domain, and a different path.  The server's port is configured in the app-config.json file, with the `serverConfig.port` setting.  Make sure your server values match the client values, if you're using a similar setup.
  - apiBaseUrl: This is the URL to the base API.
  - chatSocketIoEndpoint: This should be the same as your `apiBaseUrl`, except with the `ws` protocol.  As you probably see in my production configuration, it actually works with `https`, so I'm not entirely sure here.  Both configurations work for me on my local machine though.
  - chatSocketPath: Just make sure this value is the same as what's found in the settings on the `app-config.json` file, `chatSocketIoPath` setting.  If it's not, you'll have some issues connecting the two.

