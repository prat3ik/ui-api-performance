require('chromedriver');
require('dotenv').config();
const Browser = require("./Browser");
const ConfigFactory = require("./ConfigFactory");
const ProcessUtil = require("./ProcessUtil");
const Chrome = require("selenium-webdriver/chrome");
const {Builder, Capabilities} = require("selenium-webdriver");
const {Capability} = require("selenium-webdriver/lib/capabilities");

class BrowserFactory {
    static async createBrowser(mochaContext) {
        try {
            this.config = await ConfigFactory.getConfig();
            console.log(`Test: ${mochaContext.test.title} is being executed.`);
            const driver = await this.createDriverFromBrowserType(this.config.browser, this.config.isHeadless, this.config.browserStackEnabled);
            let browser = await new Browser(mochaContext, driver);
            return await browser;
        } catch (error) {
            await ProcessUtil.errorToPromiseError(error);
            throw error;
        }
    }

    static async createDriverFromBrowserType(browserType, isHeadless, browserStackEnabled) {
        console.info(`Creating the Driver from given browser: ${browserType} with Headless mode: ${isHeadless} ${(browserStackEnabled) ? 'on BrowserStack' : ''}`);
        if (browserStackEnabled) {
            return await this.createBrowserStackDriver(browserType)
        } else {
            switch (browserType) {
                case "chrome":
                    return await this.createChromeDriver(isHeadless);
                default:
                    const message =
                        "User has not selected any browser to run automation tests upon!";
                    console.log(message);
                    await ProcessUtil.returnPromiseError(message);
                    throw new Error(message);
            }
        }
    }

    static async createChromeDriver(isHeadless) {
        console.log("Creating chrome driver...");

        // const proxy = "20.186.110.157:3128"
        const options = new Chrome.Options();
        if (isHeadless) {
            options.addArguments("--incognito");
            options.addArguments("--headless");
            options.addArguments("--disable-gpu");
            options.addArguments("no-sandbox");
            options.addArguments("--disable-dev-shm-usage");
            options.addArguments("--window-size=1920,1080");
        }

        const capabilities = Capabilities.chrome();
        capabilities.set(Capability.ACCEPT_INSECURE_TLS_CERTS, true);
        console.log('ENV:', process.env.TEST_ENV);
        const driver = (process.env.TEST_ENV === 'CI' ) ? await new Builder()
            .forBrowser("chrome")
            .withCapabilities(capabilities)
            .setChromeOptions(options)
            .usingServer(`http://selenium__standalone-chrome:4444/wd/hub`)
            .build() : await new Builder()
            .forBrowser("chrome")
            .withCapabilities(capabilities)
            .setChromeOptions(options)
            .build();

        await driver.manage().window().maximize();
        return driver;
    }

    static async createBrowserStackDriver(browserType) {
        console.log("Creating chrome driver on BrowserStack...");
        const USERNAME = process.env.BROWSERSTACK_USERNAME;
        const AUTOMATE_KEY = process.env.BROWSERSTACK_AUTOMATE_KEY;
        const browserstackURL = 'https://' + USERNAME + ':' + AUTOMATE_KEY + '@hub-cloud.browserstack.com/wd/hub';
        console.log(browserstackURL)
        const capabilities = {
            "bstack:options": {
                "os": this.config.browserStackOS,
                "osVersion": this.config.browserStackOSVersion,
            },
            "browserName": browserType,
            "browserVersion": "latest",
            'name': `Pratik - testing with ${browserType} on ${this.config.browserStackOS}`,
            "browserstack.networkLogs": true
        }
        const driver = await new Builder().usingServer(browserstackURL).withCapabilities(capabilities).build();
        await driver.manage().window().maximize();
        return driver;
    }

    static async createSauceLabsChromeDriver() {
        console.log("Creating chrome driver on SauceLabs...");
        const USERNAME = '';
        const AUTOMATE_KEY = '';
        const browserstackURL = 'https://' + USERNAME + ':' + AUTOMATE_KEY + '@ondemand.us-west-1.saucelabs.com:443/wd/hub';

        const capabilities = {
            "browserName": 'chrome',
            "browserVersion": 'latest',
            "platformName": 'macOS 10.15',
            "sauce:options": {}
        }
        const driver = await new Builder().usingServer(browserstackURL).withCapabilities(capabilities).build();

        //Maximize the window
        await driver.manage().window().maximize();

        return driver;
    }
}

module.exports = BrowserFactory;
