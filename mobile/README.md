First time installation
- npm install
- cordova platform add android
- cordova platform add ios 
- cordova plugin add cordova-plugin-geolocation
- cordova plugin add cordova-plugin-whitelist

Development(web)
- Run: gulp dev
- Run: ionic serve

Testing(web)
- Run: gulp
- Run: ionic serve

Testing(ios) - Requires Mac
- Run: gulp
- ionic build ios
- ionic emulate ios

Testing(android)
- Run: gulp
- ionic build android
- ionic run android (requires android device connected)

