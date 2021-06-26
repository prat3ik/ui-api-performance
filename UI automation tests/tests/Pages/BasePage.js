const ProcessUtil = require('./../BaseUI/ProcessUtil');
const WebComponent = require("../BaseUI/Components/WebComponent");
const Button = require("../BaseUI/Components/Button");
const TextView = require("../BaseUI/Components/TextView");
const TextInput = require("../BaseUI/Components/TextInput");

class BasePage {
    constructor() {
        if (this.constructor === BasePage) {
            throw new Error("Abstract class can not be instantiated!");
        }
        this.url = "";
    }

    getPageText(text) {
        return new TextView(SelectorType.XPATH, `.//*[text()="${text}"]`);
    }


    async goTo(url=null) {
        try {
            if(!url)
                url = this.url
            await browser.navigate(url);
        } catch (error) {
            await ProcessUtil.errorToPromiseError(`Page: '${this.getPageName()}' tried to go to url: ${this.url}`);
        }
    }

    //------------------ Elements -------------------//

    getPageHeaderTitle() {
        return new TextView(SelectorType.XPATH, `.//button[contains(., "OWASP Juice Shop")]`);
    }

    getPageHeaderLogo() {
        return new WebComponent(SelectorType.CSS, `img[alt="OWASP Juice Shop"]`);
    }

    getHeaderSearchButton() {
        return new Button(SelectorType.CSS, `mat-icon.mat-search_icon-search`);
    }

    getHeaderSearchTextInput() {
        return new TextInput(SelectorType.XPATH, `.//input[@type="text" and @id="mat-input-0"]`);
    }

    getHeaderAccountButton() {
        return new Button(SelectorType.CSS, `#navbarAccount`);
    }

    getAccountDropDownLoginButton() {
        return new Button(SelectorType.CSS, `#navbarLoginButton`);
    }

    getYourBasketButton() {
        return new Button(SelectorType.CSS, `button[routerlink="/basket"]`);
    }

    getProfileButton() {
        return new Button(SelectorType.CSS, `button[aria-label="Go to user profile"]`);
    }

    //--------------- Verify Elements on UI ------------//

    async verifyPageHeaderIsDisplayed() {
        const isHeaderLogoDisplayed = await this.getPageHeaderLogo().isElementAvailable();
        expect(isHeaderLogoDisplayed).is.true;

        const isHeaderTitleTextDisplayed = await this.getPageHeaderTitle().isElementAvailable();
        expect(isHeaderTitleTextDisplayed).is.true;

        const isHeaderSearchButtonDisplayed = await this.getHeaderSearchButton().isElementAvailable();
        expect(isHeaderSearchButtonDisplayed).is.true;

        const isHeaderAccountButtonDisplayed = await this.getHeaderAccountButton().isElementAvailable();
        expect(isHeaderAccountButtonDisplayed).is.true;
    }

    async goToLoginPage() {
        await this.clickOnAccountButton();
        await this.clickOnLoginButton();
    }

    async goToProfilePage() {
        await this.verifyUserIsLoggedIn();
        await this.clickOnAccountButton();
        await this.clickOnProfileButton();
    }

    async doSearchProduct(productName) {
        await this.getHeaderSearchButton().click();
        await this.getHeaderSearchTextInput().fastType(productName);
        await this.getHeaderSearchTextInput().pressEnter();

    }

    async verifyUserIsLoggedIn() {
        await this.verifyPageHeaderIsDisplayed();

        const isYourBasketButtonDisplayed = await this.getYourBasketButton().isElementAvailable();
        expect(isYourBasketButtonDisplayed).is.true;
    }

    //--------------- Component's Events --------------//

    async clickOnAccountButton() {
        await this.getHeaderAccountButton().click();
    }

    async clickOnLoginButton() {
        await this.getAccountDropDownLoginButton().click();
    }

    async clickOnProfileButton() {
        await this.getProfileButton().click();
    }
}

module.exports = BasePage;
