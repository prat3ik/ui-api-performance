class TestConfig {
    //Constructor
    constructor() {
        this.executionMode = "remote";
        this.juiceShopBaseUrl = "https://juice-shop.herokuapp.com";
        this.defaultElementTimeout = 30000; //30 seconds
        this.defaultPageLoadTimeout = 30000; //30 seconds
        this.defaultTestTimeout = 300000; //5 Minutes
        this.browser = "chrome";
        this.isHeadless = "false";
        this.browserStackEnabled = "false";
        this.browserStackOS = "windows";
        this.browserStackOSVersion = "10";
        this.env = "prod";
    }

    //Properties
    executionMode;
    juiceShopBaseUrl;
    browser;
    isHeadless;
    browserStackEnabled;
    browserStackOS;
    browserStackOSVersion;
    defaultElementTimeout;
    defaultPageLoadTimeout;
    defaultTestTimeout;
    env;
}

module.exports = TestConfig;