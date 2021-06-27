class TestConfig {
    //Constructor
    constructor() {
        this.executionMode = "remote";
        this.prodBaseUrl = "https://juice-shop.herokuapp.com/";
        this.stageBaseUrl = "http://juice-shop-web-sample.herokuapp.com/";
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
    prodBaseUrl;
    stageBaseUrl;
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