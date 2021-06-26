require('dotenv').config();
const fs = require("fs");
const FileUtil = require("./FileUtil");
const ConfigFactory = require("./ConfigFactory");
const SelectorType = require("./SelectorType");
const ProcessUtil = require("./ProcessUtil");
const MochaUtil = require("./MochaUtil");
const {Origin} = require("selenium-webdriver/lib/input");
const {WebDriver, until, By, WebElement, Key} = require("selenium-webdriver");


class Browser {
    mainWindowHandler = "";

    //Constructor
    constructor(mochaContext, driver) {
        this.testConfig = ConfigFactory.getConfig();
        this.mochaContext = mochaContext;
        this.driver = driver;
    }

    /**
     * Get the environment.
     */
    getEnv() {
        return this.testConfig.env;
    }

    /**
     * Get the selected browser.
     */
    getBrowserName() {
        return this.testConfig.browser;
    }

    /**
     * Get the shopify store base URL.
     */
    getWrapmateBaseUrl() {
        const currentEnv = this.getEnv();
        if (currentEnv === 'dev')
            return this.getWrapmateDevBaseUrl();
        else if (currentEnv === 'beta')
            return this.getWrapmateBetaBaseUrl();
        else if (currentEnv === 'stage')
            return this.getWrapmateStageBaseUrl();
        else
            return this.getWrapmateProdBaseUrl();
    }

    /**
     * Get the Juice Shop application dev URL.
     */
    getJuiceShopBaseUrl() {
        return this.testConfig.juiceShopBaseUrl;
    }

    /**
     * Get execution mode (remote/local).
     */
    getExecutionMode() {
        return this.testConfig.executionMode;
    }

    /**
     * Get the current URL
     * @returns {Promise<void>}
     */
    async getCurrentUrl() {
        await this.waitUntilPageIsLoaded();
        await this.delay(2500); //TODO: Remove this and check
        return await this.driver.getCurrentUrl();
    }

    /**
     * Navigate to URL.
     * @param url The URL of destination.
     */
    async navigate(url) {
        console.log("Navigating to: " + url);
        await this.driver.navigate().to(url);
        this.clearMainWindowHandler();
    }

    clearMainWindowHandler() {
        this.mainWindowHandler = "";
    }

    /**
     * Close the browser.
     */
    async close() {
        await this.driver.quit();
    }

    //-------------CONFIGURATION VALUES--------------//
    //-----------------------------------------------//
    //-----------------------------------------------//

    getShopifyPartnerCredentials() {
        return [process.env.SHOPIFY_PARTNER_EMAIL, process.env.SHOPIFY_PARTNER_PASSWORD];
    }

    //------------DRIVER RELATED METHODS-------------//
    //-----------------------------------------------//
    //-----------------------------------------------//


    //-----------------FIND ELEMENT------------------//
    async findBySelectorType(selectorType, locator, timeout) {
        if (selectorType === SelectorType.CSS) {
            if (timeout) return await this.findByCss(locator, timeout);
            else return await this.findByCss(locator);
        } else {
            if (timeout) return await this.findByXPath(locator, timeout);
            return await this.findByXPath(locator);
        }
    }

    async findByCss(cssPath, timeout, multipleElements = false) {
        console.info("waitForCssPath: " + cssPath);
        const optTimeout = timeout || this.testConfig.defaultElementTimeout;
        console.info("timeout for CSS locator: " + optTimeout);
        // Below step is not working with MS Edge(chromium) browser
        // await this.driver.wait(until.elementLocated(By.css(cssPath)), optTimeout);
        const condition = until.elementLocated(By.css(cssPath))
        await this.driver.wait(async driver => condition.fn(driver), optTimeout, `Could not load the element with given CSS selector: ${cssPath}`)
        let element;
        if (multipleElements)
            element = await this.driver.findElements(By.css(cssPath));
        else
            element = await this.driver.findElement(By.css(cssPath));
        return element;
    }

    async findByXPath(xPath, timeout, multipleElements = false) {
        console.info("waitForXPath: " + xPath);
        const optTimeout = timeout || this.testConfig.defaultElementTimeout;
        console.info("timeout for XPath locator: " + optTimeout);
        // Below step is not working with MS Edge(chromium) browser
        // await this.driver.wait(until.elementLocated(By.xpath(xPath)), optTimeout);
        const condition = until.elementLocated(By.xpath(xPath))
        await this.driver.wait(async driver => condition.fn(driver), optTimeout, `Could not load the element with given XPath selector: ${xPath}`)
        let element;
        if (multipleElements)
            element = await this.driver.findElements(By.xpath(xPath));
        else
            element = await this.driver.findElement(By.xpath(xPath));
        return element;
    }

    async findAllBySelectorType(selectorType, locator) {
        if (selectorType == SelectorType.CSS) {
            return await this.findByCss(locator, this.testConfig.defaultElementTimeout, true);
        } else {
            return await this.findByXPath(locator, this.testConfig.defaultElementTimeout, true);
        }
    }

    //----------------WAIT FUNCTIONS-----------------//
    delay(timeInMillis) {
        console.log("Delay: " + timeInMillis + " milliseconds");
        return new Promise(function (resolve) {
            setTimeout(resolve, timeInMillis);
        });
    }

    async randomDelay(maximumTimeInMillis) {
        let randomDelay = Math.random() * maximumTimeInMillis;
        await this.delay(randomDelay)
    }

    async elementExists(selectorType, locator) {
        if (selectorType === SelectorType.CSS) {
            return (await this.driver.findElements(By.css(locator))).length > 0;
        } else {
            return (await this.driver.findElements(By.xpath(locator))).length > 0;
        }
    }

    async waitUntilElementEnabled(element) {
        console.info("WaitUntilElementEnabled");
        const condition1 = until.elementIsVisible(element)
        await this.driver.wait(async driver => condition1.fn(driver), this.testConfig.defaultElementTimeout, 'Element is not visible!')

        const condition2 = until.elementIsEnabled(element)
        await this.driver.wait(async driver => condition2.fn(driver), this.testConfig.defaultElementTimeout, 'Element is not enabled!')

        // Below steps are not working with MS Edge(chromium) browser
        // await this.driver.wait(until.elementIsVisible(element), this.testConfig.defaultElementTimeout);
        // await this.driver.wait(until.elementIsEnabled(element), this.testConfig.defaultElementTimeout);
        console.info(`Element: '${await element.getText()}' is enabled!`);
    }

    async waitUntilEnabled(selectorType, locator) {
        const element = await this.findBySelectorType(selectorType, locator);
        await this.waitUntilElementEnabled(element);
    }

    async waitUntilPageIsLoaded() {
        console.info("WaitUntilPageIsLoaded");
        return await this.driver.executeScript('return document.readyState', this.testConfig.defaultPageLoadTimeout)
            .then(function (readyState) {
                    return readyState === 'complete';
                }
            );
        console.info(`Page is loaded!`);
    }


    //----------------SCROLL FUNCTIONS-----------------//
    async scrollToTopOfPage() {
        console.info("ScrollToTopOfPage");
        const javaScript = "window.scrollTo(0, 0)";
        await this.executeJavaScript(javaScript, null);
        await this.delay(700);
    }

    async scrollToBottomOfPage() {
        console.info("ScrollToBottomOfPage");
        const javaScript = "window.scrollTo(0, document.body.scrollHeight)";
        await this.executeJavaScript(javaScript, null);
        await this.delay(700);
    }

    async scrollElementIntoView(element) {
        console.info("ScrollElementIntoView");
        const javaScript = "arguments[0].scrollIntoView(true);";
        await this.executeJavaScript(javaScript, element);
        await this.delay(700);
    }

    async scrollIntoView(selectorType, locator) {
        console.info("ScrollIntoView");
        const element = await this.findBySelectorType(selectorType, locator);
        const javaScript = "arguments[0].scrollIntoView(true);";
        await this.executeJavaScript(javaScript, element);
        await this.delay(200);
    }

    async isElementVisibleOnView(element) {
        console.info("isElementVisibleOnView");
        return await this.executeJavaScript("return window.getComputedStyle(arguments[0]).visibility!=='hidden'", element);
    }

    //--------------TEXTFIELD FUNCTIONS---------------//
    async clear(element) {
        await element.clear();
    }

    async sendKeys(selectorType, locator, text) {
        const element = await this.findBySelectorType(selectorType, locator);
        await this.waitUntilElementEnabled(element);
        await this.delay(100);
        await this.clear(element);
        await this.delay(100);
        await element.sendKeys(text);
        console.info("sendKeys performed successfully!, typed text is: " + await element.getAttribute("value"));
        return element;
    }

    async sendKeysJS(selectorType, locator, text) {
        const element = await this.findBySelectorType(selectorType, locator);
        await this.waitUntilElementEnabled(element);
        await this.delay(200);
        await this.executeJavaScript(`arguments[0].value=''`, element);
        await this.delay(200);
        const javaScript = `arguments[0].value='${text}'`;
        await this.executeJavaScript(javaScript, element);
        console.info("sendKeysJS performed successfully!, typed text is: " + await element.getAttribute("value"));
        return element;
    }

    async slowType(selectorType, locator, text, pressEnter) {
        const element = await this.findBySelectorType(selectorType, locator);
        await this.waitUntilElementEnabled(element);
        await this.clear(element);
        for (let i = 0; i < text.length; i++) {
            console.info("sendKeys: " + text[i]);
            await element.sendKeys(text[i]);
            await this.delay(text.length - i > 4 ? 50 : 150);
            await this.randomDelay(150);
        }
        console.info("Slow typed text is: " + await element.getAttribute("value"));
        if (pressEnter) await element.sendKeys(Key.ENTER);
        return element;
    }

    async getText(selectorType, locator) {
        const element = await this.findBySelectorType(selectorType, locator);
        const result = await element.getText();
        console.info(`GetText: ${result}`);
        return result;
    }

    async selectDropdownByText(selectorType, locator, text) {
        const element = await this.findBySelectorType(selectorType, locator);
        const options = await element.findElements(By.css('[role="option"]'));

        for (const option of options) {
            const optionText = await option.getText();
            if (optionText === text) {
                await option.click();
                return;
            }
        }

        await ProcessUtil.returnPromiseError(
            `SelectDropdownByText text not found "${text}"`
        );
    }

    async selectDropdownByValue(selectorType, locator, value) {
        const element = await this.findBySelectorType(selectorType, locator);
        const options = await element.findElements(By.css("option"));
        console.info("SelectDropdownByValue: " + value);

        for (const option of options) {
            const optionText = await option.getAttribute("value");
            if (optionText == value) {
                await option.click();
                return;
            }
        }

        await ProcessUtil.returnPromiseError(
            `SelectDropdownByValue text not found "${value}"`
        );
    }

    async selectDropdownByOptionIndex(selectorType, path, index) {
        const dropdown = await this.findBySelectorType(selectorType, path);
        const option = await this.findBySelectorType(selectorType, path + ` option:nth-child(${index})`);
        await this.waitUntilElementEnabled(dropdown);
        await dropdown.click();
        await this.waitUntilElementEnabled(option);
        await option.click();
        await this.delay(100);
        await dropdown.click();
        await this.delay(100);
    }

    //--------------BUTTON FUNCTIONS---------------//
    async click(selectorType, locator) {
        const element = await this.findBySelectorType(selectorType, locator);
        await this.waitUntilElementEnabled(element);
        await console.log("clicking .....")
        await element.click();
        console.info("Click() happened");
    }

    // Click, using element.click(), does not work in certain cases.
    async clickJS(selectorType, locator) {
        const element = await this.findBySelectorType(selectorType, locator);
        await this.waitUntilElementEnabled(element);

        await console.info("Clicking on element via JS");
        await this.executeJavaScript("arguments[0].click();", element);
        await console.info("clickJS() happened");
    }

    //--------------SCREENSHOT CAPTURING--------------//
    async captureScreenshot(imageName) {
        const screenshotDirectory = FileUtil.pathCombine(FileUtil.getCurrentDirectory(), "TestResults", "screenshots");
        FileUtil.createDirectory(screenshotDirectory);
        const filePath = FileUtil.pathCombine(screenshotDirectory, imageName);

        this.driver.takeScreenshot().then(function (data) {
            console.info("Capturing screenshot...");
            fs.writeFileSync(filePath, data, "base64");
        });
    }

    //----------------TAB SWITCHING-----------------//
    async switchToFirstBrowserTab() {
        await this.switchToBrowserTab(0);
    }

    async getAllWindowHandles() {
        return await this.driver.getAllWindowHandles();
    }

    async getCurrentWindowHandle() {
        return await this.driver.getWindowHandle();
    }

    async switchToLastBrowserTab() {
        const allWinHandles = await this.getAllWindowHandles()
        const lastBrowserTabIndex = await allWinHandles.length - 1;
        await this.switchToBrowserTab(lastBrowserTabIndex)
    }

    /**
     * @param index
     * @returns {Promise<*>}
     */
    async switchToBrowserTab(index) {
        console.info(`[SwitchToBrowserTab: ${index}]`);
        const tabs = await this.driver.getAllWindowHandles();
        await console.log(tabs)
        const handle = tabs[index];
        console.info(`[Handle: ${handle}]`);
        await this.driver.switchTo().window(handle);
        await this.delay(1000);
        const currentUrl = await this.driver.getCurrentUrl();
        console.info(`[After switching the current URL is: ${currentUrl}]`);
        return index;
    }

    async switchToBrowserTabWhichHasSpecificUrlPath(urlPath) {
        await this.delay(2000);
        const handles = await this.driver.getAllWindowHandles();
        const currentHandle = await this.driver.getWindowHandle();
        await console.log(`All handles: ${handles}`);
        await console.log(`Current handle: ${currentHandle}`);
        let currentUrl = await this.driver.getCurrentUrl();

        await console.log(`Current URL: ${currentUrl}`);
        await console.log(`Expected urlPath: ${urlPath}`);

        if (!currentUrl.includes(urlPath)) {
            //if current URL is not matching with given link, then switch the tab


            while (!currentUrl.includes(urlPath)) {
                let timeout = 0; // in seconds
                let flag = false;

                for (let i = 0; i < handles.length; i++) {
                    await console.log(handles[i])
                    await console.log(`Current URL: ${currentUrl}`);

                    await this.driver.switchTo().window(handles[i]);
                    currentUrl = await this.driver.getCurrentUrl();
                    await this.delay(1500);
                    await console.log(`New Current URL: ${currentUrl}`);

                    if (currentUrl.includes(urlPath)) {
                        flag = true;
                        break;
                    }
                }

                timeout += 1;
                console.log("timeout: " + timeout)

                if (flag) {
                    break;
                }

                if (timeout === 10)
                    break;
            }
        }
        await this.delay(1500);
    }

    async closeBrowserTab() {
        console.info("[Browser tab is being closed..]");
        const currentUrl = await this.driver.getCurrentUrl();
        console.info(`[Closing browser tab URL: ${currentUrl}]`);
        await this.delay(100);
        await this.driver.close();
        try {
            await this.delay(200);
            await this.driver.getCurrentUrl();
            await this.closeBrowserTab();
        } catch (e) {
            console.info("[Browser tab closed!]");
        }
        await this.delay(500);
    }

    //----------------FRAME SWITCHING-----------------//
    clearMainWindowHandler() {
        this.mainWindowHandler = "";
    }

    async switchToIFrame(selectorType, locator) {
        console.info("SwitchToIFrame");
        if (this.mainWindowHandler === "") {
            this.mainWindowHandler = await this.driver.getWindowHandle();
        }

        const element = await this.findBySelectorType(selectorType, locator);
        if (element.length > 1) {
            console.info("WARNING: More than 1 iframes are found, Please fix the locator.");
        }
        await this.waitUntilElementEnabled(element);
        await this.driver.switchTo().frame(element);
        await this.delay(1000);
    }

    async switchToWindow(handle) {
        console.log("Switching to window");
        await this.driver.switchTo().window(handle);
    }

    async switchToNotGivenWindow(handle) {
        let windowsHandles = await this.getAllWindowHandles();
        const newWindowHadnles = windowsHandles.splice(windowsHandles.indexOf(handle), 1)
        await this.driver.switchTo().window(windowsHandles[0]);
    }

    async switchToMainWindow() {
        console.info("SwitchToMainWindow");
        if (this.mainWindowHandler !== "") {
            await this.driver.switchTo().window(this.mainWindowHandler);
            this.clearMainWindowHandler();
        }
        await this.driver.switchTo().defaultContent();
    }

    //----------------MISC. FUNCTIONS-----------------//
    async executeJavaScript(javaScript, args) {
        const jsOutput = await this.driver.executeScript(javaScript, args);
        await this.delay(300);
        return jsOutput;
    }

    async issueError(error) {
        await ProcessUtil.errorToPromiseError(error);
    }

    async getPageSource() {
        return await this.driver.getPageSource();
    }

    async savePageSourceToFile(testCaseName) {
        await FileUtil.createFile(`TestResults/${testCaseName.replace(/ /g, "-")}-page-source.txt`, await this.getPageSource());
    }

    async hover(selectorType, locator) {
        const element = await this.findBySelectorType(selectorType, locator);
        await this.waitUntilElementEnabled(element);
        await console.info("Hover via Selenium cmd");
        await this.driver.actions({bridge: true}).move({duration: 100, origin: element, x: 0, y: 0}).perform();

        await console.info("Hover via JS");
        const hoverJS = "if(document.createEvent){var evObj = document.createEvent('MouseEvents');evObj.initEvent('mouseover', true, false); arguments[0].dispatchEvent(evObj);} else if(document.createEventObject) { arguments[0].fireEvent('onmouseover');}"
        await this.executeJavaScript(hoverJS, element)
        await this.delay(1000);
    }

    async getCssValue(selectorType, locator, cssProperty) {
        const element = await this.findBySelectorType(selectorType, locator);
        return await element.getCssValue(cssProperty);
    }

    async refresh() {
        console.info("Refresh()");
        await this.driver.navigate().refresh();
    }

    //-----------------JS MODAL------------------//
    async acceptJSModal() {
        await this.driver.switchTo().alert().accept();
    }

    // TODO: Create a valid function for the action class
    // async moveAndClick(){
    //     await this.driver
    //         .actions()
    //         .move({ origin: element })
    //         .press()
    //         .move({ x: parseInt((elementCoordinatorX + elementWidth)*0.3), y: elementCoordinatorY, origin: Origin.VIEWPORT })
    //         .release()
    //         .perform()
    // }

}

module.exports = Browser
