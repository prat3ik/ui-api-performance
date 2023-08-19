# Sample - UI automation of Juice shop website using Selenium test automation framework

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
  - Different test environment support (prod/stage)

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
- `mochawesome`: [Test reporting library](https://www.npmjs.com/package/mochawesome)
- `selenium-webdriver`: [UI automation library](https://www.npmjs.com/package/selenium-webdriver)

## Description of Automation tests
**There are 5 tests autoamted and detailed test cases can be found here: https://docs.google.com/spreadsheets/d/1lcHxbokzVWC4_wpxxFPVebBidG1wBZTfBKeWHaNbpjw/**

## Bug report
**There is one bug found and logged the details here: https://docs.google.com/spreadsheets/d/1KXMoSVISg9dfRq-KWd9IoIfsKgXcma38we06L4B874E/edit#gid=2088996798**

## How to run

-----------------------------
### Setup:
**Clone the repo and Install the project dependencies:** `npm install` or `npm ci`
```
cd UI\ automation\ tests/ 
npm install 
```

### Execution:
#### 1. Local
**1) To run the tests on your local normal chrome browser:**
- Open `testconfig.json` and set the below parameters:
    ```
    "browserStackEnabled": false
    "isHeadless": false
    ```
- `npm test`
- The HTML/JSON reports would be generated inside `UI automation tests/TestResults`

**2) To run the tests on your local chrome browser but with headless mode(browser will not open here, but work in backend)**
- On `testconfig.json` do set the below parameters:
    ```
    "browserStackEnabled": false
    "isHeadless": true
    ```
- `npm test`
- And HTML/JSON reports can be found inside: `UI automation tests/TestResults`

_**NOTE:**_ _If there are any test failures, then the screenshot of the failure can be found inside: `UI automation tests/TestResults/screenshots`_ 

#### 2. Browserstack (Remote):
- **To run the tests on Chrome on MacOS X OS**
  - Set below parameters on `testconfig.json`
    ```
    "isHeadless": false,
    "browserStackEnabled": true,
    "browserStackOS": "OS X",
    "browserStackOSVersion": "Big sur"
     ```
  - `npm test`
  - Go to your browserstack ac. and you can observe the output
  
- **To run the tests on Chrome on Windows 10**
  - Set below parameters
    ```
    "isHeadless": false,
    "browserStackEnabled": true,
    "browserStackOS": "Windows",
    "browserStackOSVersion": "10"
     ```
  - `npm test`
  - Go to your browserstack ac. and you can observe the output

#### 3. Gitlab CI:
We have setup continuous integration(CI) pipeline using GitlabCI, so we can execute the tests over there as well.
Steps:
- Move to CI pipeline
- Click on the Run pipeline button
  ![run-pipeline](https://drive.google.com/uc?export=view&id=1aZG6Ik0D3M9nfnZvhmRxDGYb_191yxze)
- Observe the result
  ![result](https://drive.google.com/uc?export=view&id=1fsKn6O_XsBWQ4zYbR1ayoTi9a6D2elzI)

### HTML/JSON Reports
HTML & JSON reports will be generated under path: `UI automation tests/TestResults`  at the end of the execution.
- Execute tests: `npm test`
- Move to: `UI automation tests/TestResults`
- Open HTML report`test-report.html`
- OR open JSON report `test-report.json`

----------------------------------------------
#### Video of setup and successful local execution:
**https://drive.google.com/file/d/1NYN4uZOiG-4FkdFgdeGtzgcgL8p9JFmn/**