# TOPTAL - UI automation of Juice shop website using Selenium test automation framework

**UI API automation for Juice shop website (demo app) using Selenium.**

## Why use Selenium based UI test automation framework
- Selenium is one of the best and matured automation tool out there for over a decade.
- It supports various browsers like Chrome, Mozilla, Firefox, Safari
- It also supports all major languages like Java, Python, JavaScript, C#, Ruby, and Perl
- Using selenium we can create custom automation framework with some great capabilities.
- The framework used in this project has below capabilities:
  - Cloud platform execution support (BrowserStack)
  - CI integration (GitlabCI)
  - Screenshot capture on test failures

## What is Juice shop website?
- It is demo website and ideal candidate for automation testing.
- Official website: https://juice-shop.herokuapp.com/#/

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
- `chromedriver`: [NPM wrapper for Selenium ChromeDriver](https://www.npmjs.com/package/chromedriver)
- `dotenv`: [Env variable management library](https://www.npmjs.com/package/dotenv)
- `chai`: [Test assertions library](https://www.npmjs.com/package/chai)
- `mocha`: [Test runner library](https://www.npmjs.com/package/mocha)
- `selenium-webdriver`: [UI automation library](https://www.npmjs.com/package/selenium-webdriver)

## Description of automation tests

**There are 5 tests autoamted and detailed test cases can be found here: https://docs.google.com/spreadsheets/d/1lcHxbokzVWC4_wpxxFPVebBidG1wBZTfBKeWHaNbpjw/**

## How to run
### Setup
**Clone the repo and Install the project dependencies:** `npm install` or `npm ci`
```
git clone https://git.toptal.com/screening/Pratik-K-Patel.git 
cd UI\ automation\ tests/ 
npm install 
```

### Execution
#### 1. Local:
***
- Open `testconfig.json`.
- In order to execute the test case, set the below parameters in `testconfig.json` file.
    ```
    "browserStackEnabled": false
    "isHeadless": true
    ```
- Now you can execute test either via IDE or CLI (`npm test`) as described on above section.
- **To run the tests on your local chrome browser**
  - Make sure `"isHeadless": false` on `testconfig.json`
  - `npm test`
  - The HTML reports would be generated inside `API automation ___`

- **To run the tests on your local chrome browser but with headless mode**
  - Set `"isHeadless": true` on `testconfig.json`
  - `npm test`

#### 2. Browserstack (Remote):
- **To run the tests on Browserstack chrome browser**
  - On `testconfig.json`, set below parameters
    ```
     "browserStackEnabled": true
     "isHeadless": false`
     ```
  - `npm test`
  - Go to your browserstack ac. and you can observe the output

#### 3. Gitlab CI:
- There are 2 ways the automated tests can be executed on CI
  1) CRON job: Tests are executing automatically on the set CRON time
  2) Manual trigger: User can run the tests manually by following below steps:
    - a
    - b


### HTML Report


#### Video of successful execution:
