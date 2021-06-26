# TOPTAL - API automation of Box using Cypress test framework

**REST API automation for Box (cloud storage) APIs using Cypress.**

## Why use Cypress
- Cypress is great tool for UI and API automation. 
- Box uses OAuth 2.0 which requires browser interaction to authorize the user _(API: https://developer.box.com/reference/get-authorize/)_
- On successful authorization it will generate the code on redirection URL and that code will require in order to generate the Access token _(API: https://developer.box.com/reference/post-oauth2-token/)_
_**NOTE:**_ _An Access token is a string that enables Box to verify that a request belongs to an authorized session._
- The generated Access token can then be used to to make Box API calls.
- As we require **browser as well as API interaction**, we used Cypress.

## What is Box?
- Box is a cloud computing company which provides file sharing, collaborating, and other tools for working with files that are uploaded to its servers.
- Official website: https://www.box.com/
- Official API documentation: https://developer.box.com/reference/

## Dependencies
Please ensure you have stable version of Node installed (_Recommanded : v12.1.0_): https://nodejs.org/en/download/ and also check npm is installed.
```
node -v // should return valid node version
```
```
npm -v // should return valid npm version
```
![node](https://drive.google.com/uc?export=view&id=1sKamal7sIuDL8IUiL3AUYzoC9jWtP3UD)

## Libraries and plugins used
- `cypress`: [API and UI automation library](https://www.npmjs.com/package/cypress)
- `cypress-mochawesome-reporter`: [Reporting library](https://www.npmjs.com/package/cypress-mochawesome-reporter)

## Box - Authentication
- Box uses OAuth 2.0 protocol for authentication.
- OAuth 2.0 enables applications to obtain limited access to user accounts on an HTTP service.
- To access Box APIs first we need to create an application on the developer console: https://app.box.com/
    - Create app: ![img](https://drive.google.com/uc?export=view&id=1bLcBWqqUqbJQ2Bd1e_AanlzYq6eO-EjL)
    - Get `client_id` and `client_secret` which will needed to get code and authorisation token: ![img](https://drive.google.com/uc?export=view&id=1wEB-ITuuqCdeBxTQWnHQoq1pe4J2u2gk)
 
- Now using [Authorize user](https://developer.box.com/reference/get-authorize/) and [Request access token](https://developer.box.com/reference/post-oauth2-token/) APIs user can generate the Access token, and that Access token will be passed as Bearer token to Box APIs.
- 
## Description of automation tests
Box provides many APIs according to its features, but we have automated the **[Folder](https://developer.box.com/reference/resources/folder/)** API to test its functionality. 

### Automation workflow:
We have automated simple workflow for folder lifecycle _(Create folder, update it and last delete it)_ and added the test cases for each step. 
#### Prerequisite:
Get Access token using below API calls:
- [Get authorization code](https://developer.box.com/reference/get-authorize/)
- [Request authentication token](https://developer.box.com/reference/post-oauth2-token/)

#### Steps & Test cases:
_**NOTE:**_ **Detailed steps and test cases can be found here: https://docs.google.com/spreadsheets/d/1KXMoSVISg9dfRq-KWd9IoIfsKgXcma38we06L4B874E/**
1) [POST: Create new folder](https://developer.box.com/reference/post-folders/)
    - Create folder with unique name and by passing valid authentication token and valid parent folder_id
    - Create folder with same name and by passing valid authentication token
    - Create folder by passing invalid parent folder_id
    - Create folder by passing invalid authentication token
    
2) [GET: Get that folder information](https://developer.box.com/reference/get-folders-id/)
    - Get folder details by passing folder_id for newly created folder
    - Get folder details by passing invalid folder_id
    - Get folder details by passing invalid authentication token
    
3) [PUT: Update the folder name](https://developer.box.com/reference/put-folders-id/)
    - Update folder name by passing valid folder_id
    - Update folder name by passing invalid folder_id
    - Update folder name by passing invalid authentication token
    
4) [GET: Get that folder information](https://developer.box.com/reference/get-folders-id/)
    - Get folder details by passing folder_id for newly created folder

5) [DELETE: Delete that folder](https://developer.box.com/reference/delete-folders-id/)
    - Delete folder name by passing invalid authentication token and valid folder_id
    - Delete folder name by passing folder_id for newly created folder
    - Delete folder name by passing the same deleted folder_id 
6) [GET: Get deleted folder information](https://developer.box.com/reference/get-folders-id/)
    - Get folder details by passing folder_id for newly created folder

## How to run
### Setup
```
git clone
cd A
```
**Clone the repo and Install the project dependencies:** `npm install` or `npm ci`

### Execution
- **To run the tests on your terminal**
    - `npm test`
    - The HTML reports would be generated inside `API automation tests/cypress/report`

- **To run the tests on chrome headless**
    - `npm run cy:headless` 

- **To run the tests against the Cypress Test Runner**
    - `npm run cy:open`
    - Once the test runner has loaded, click on the spec file: `Test.spec.js` ![cypress-img](https://drive.google.com/uc?export=view&id=1KMlXNlG691DUo6_ijjrk13z6108dNEuD)

### HTML Report
After the successful execution via CLI (`npm test`), the HTML reports would be generated inside: `API automation tests/cypress/report`

### BUG Report
Example of Bug report can be found here:
https://docs.google.com/spreadsheets/d/1KXMoSVISg9dfRq-KWd9IoIfsKgXcma38we06L4B874E/edit#gid=2088996798

------------
#### Video of successful execution: https://drive.google.com/file/d/1rpu7zhI3DtpFHXkrSLKmmJmVi1plcTDk/
