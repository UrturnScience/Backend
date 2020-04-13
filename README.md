
# Backend 
## Getting Started
### Setting up Dev Environment
1. Clone repo
2. run `npm install`
3. download and install mongodb server [here](https://www.mongodb.com/download-center/community)
4. setup and create a firebase project (This firebase project should be your personal)
	- get your firebase admin credentials by following these [instructions](https://firebase.google.com/docs/admin/setup#initialize-sdk). Store the JSON credentials file in your documents or dev folder (This will set as `GOOGLE_APPLICATION_CREDENTIALS` env varible). Also take note of the `databaseURL` which will be set as the `FIREBASE_DATABASE_URL`.
	- get your firebase credentials for a web app by following these [instructions](https://firebase.google.com/docs/web/setup#register-app). Save the firebaseConfig as a JSON file named `firebaseConfig.json` in the root directory of the project.
5. Enable auth for the firebase app - under the project overview page, go to Authentication to enable Email/Password sign-in.
6. create a .env file in the root directory of the project. Example:
```
FIREBASE_DATABASE_URL=https://basicmessagingapp-n.firebaseio.com
GOOGLE_APPLICATION_CREDENTIALS=C:\Users\Shane\Documents\Dev\firebaseCredentials.json
MONGODB_HOST=localhost:27017
MONGODB_DBNAME=test
NODE_PORT=3000
```
7. run `npm run test` to verify all test cases pass for your environment
8. run `npm run dev` to run the server in the dev environment
