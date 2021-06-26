const BasePage = require("./BasePage");
const WebComponent = require("../BaseUI/Components/WebComponent");
const TextView = require("../BaseUI/Components/TextView");
const TextInput = require("../BaseUI/Components/TextInput");
const Button = require("../BaseUI/Components/Button");
const CheckBox = require("../BaseUI/Components/CheckBox");

class LoginPage extends BasePage {

    constructor() {
        super();
    }

    //-------------------- Elements -----------------//
    getLoginContainer() {
        return new WebComponent(SelectorType.CSS, `#login-form`);
    }

    getLoginContainerTitle() {
        return new TextView(SelectorType.XPATH, `.//h1[text()="Login"]`);
    }

    getEmailTextInput() {
        return new TextInput(SelectorType.CSS, `input[name="email"]`);
    }

    getPasswordTextInput() {
        return new TextInput(SelectorType.CSS, `input[name="password"]`);
    }

    getForgotPasswordLink() {
        return new WebComponent(SelectorType.CSS, `a[href="#/forgot-password"]`);
    }

    getLoginButton() {
        return new Button(SelectorType.CSS, `#loginButton`);
    }

    getRememberMeCheckBox() {
        return new CheckBox(SelectorType.CSS, `#rememberMe`);
    }

    getLoginWithGoogleButton() {
        return new Button(SelectorType.CSS, `#loginButtonGoogle`);
    }

    getNotYetACustomerLink() {
        return new WebComponent(SelectorType.CSS, `a[href="#/register"]`);
    }

    getErrorMessageText() {
        return new TextView(SelectorType.CSS, `div.error`);
    }

    //------------------- Verify Elements on UI ---------------------------//

    async verifyLoginPageIsDisplayed() {
        await this.verifyPageHeaderIsDisplayed();

        const isLoginContainerDisplayed = await this.getLoginContainer().isElementAvailable();
        expect(isLoginContainerDisplayed).is.true;

        const isLoginContainerTitleDisplayed = await this.getLoginContainerTitle().isElementAvailable();
        expect(isLoginContainerTitleDisplayed).is.true;

        const isEmailTextInputDisplayed = await this.getEmailTextInput().isElementAvailable();
        expect(isEmailTextInputDisplayed).is.true;

        const isPasswordTextInputDisplayed = await this.getPasswordTextInput().isElementAvailable();
        expect(isPasswordTextInputDisplayed).is.true;

        const isForgotPasswordLinkDisplayed = await this.getForgotPasswordLink().isElementAvailable();
        expect(isForgotPasswordLinkDisplayed).is.true;

        const isLoginButtonDisplayed = await this.getLoginButton().isElementAvailable();
        expect(isLoginButtonDisplayed).is.true;

        const isRememberMeCheckBoxDisplayed = await this.getRememberMeCheckBox().isElementAvailable();
        expect(isRememberMeCheckBoxDisplayed).is.true;

        const isLoginWithGoogleButtonDisplayed = await this.getLoginWithGoogleButton().isElementAvailable();
        expect(isLoginWithGoogleButtonDisplayed).is.true;

        const isNotYetACustomerLinkDisplayed = await this.getNotYetACustomerLink().isElementAvailable();
        expect(isNotYetACustomerLinkDisplayed).is.true;
    }

    async verifyLoginPageErrorMessage(errorMessage) {
        const isErrorMessageDisplayed = await this.getErrorMessageText().isElementAvailable();
        const errorMessageText = await this.getErrorMessageText().getText();
        expect(isErrorMessageDisplayed).is.true;
        expect(errorMessageText).is.eq(errorMessage);
    }

    //------------------- Filing Forms -----------------//
    async fillLoginFormAndClickOnLogin(user) {
        await this.getEmailTextInput().fastType(user.email);
        await this.getPasswordTextInput().fastType(user.password);
        await this.getLoginButton().click();
    }

    //------------------ Events -------------------------//
    async clickOnNotYetACustomerLink() {
        await this.getNotYetACustomerLink().click();
    }
}

module.exports = LoginPage;