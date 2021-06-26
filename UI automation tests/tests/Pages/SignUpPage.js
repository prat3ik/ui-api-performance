const BasePage = require("./BasePage");
const WebComponent = require("../BaseUI/Components/WebComponent");
const TextInput = require("../BaseUI/Components/TextInput");
const DropDown = require("../BaseUI/Components/DropDown");
const Button = require("../BaseUI/Components/Button");
const TextView = require("../BaseUI/Components/TextView");

class SignUpPage extends BasePage {

    constructor() {
        super();
    }

    //--------------------- Elements ------------------//
    getUserRegistrationContainer() {
        return new WebComponent(SelectorType.CSS, `#registration-form`);
    }

    getUserRegistrationContainerTitle() {
        return new WebComponent(SelectorType.XPATH, `.//h1[text()="User Registration"]`);
    }

    getEmailTextInput() {
        return new TextInput(SelectorType.CSS, `input#emailControl`);
    }

    getPasswordTextInput() {
        return new TextInput(SelectorType.CSS, `input#passwordControl`)
    }

    getRepeatPasswordTextInput() {
        return new TextInput(SelectorType.CSS, `input#repeatPasswordControl`);
    }

    getSecurityDropDown() {
        return new DropDown(SelectorType.CSS, `mat-select[name="securityQuestion"]`);
    }

    getDropDownOption(optionValue) {
        return new TextView(SelectorType.XPATH, `.//mat-option[contains(.,"${optionValue}")]`)
    }

    getSecurityAnswerTextInput() {
        return new TextInput(SelectorType.CSS, `input#securityAnswerControl`);
    }

    getRegisterButton() {
        return new Button(SelectorType.CSS, `button#registerButton`);
    }

    getAlreadyRegisteredLink() {
        return new WebComponent(SelectorType.XPATH, `.//div[@id="alreadyACustomerLink"]/a[contains(@href, "login")]`);
    }

    //----------------- Verify Elements on UI ----------------//

    async verifyUserRegisterPageIsDisplayed() {
        const isUserRegistrationContainerDisplayed = await this.getUserRegistrationContainer().isElementAvailable();
        expect(isUserRegistrationContainerDisplayed).is.true;

        const isUserRegistrationContainerTitleDisplayed = await this.getUserRegistrationContainerTitle().isElementAvailable();
        expect(isUserRegistrationContainerTitleDisplayed).is.true;

        const isEmailTextInputDisplayed = await this.getEmailTextInput().isElementAvailable();
        expect(isEmailTextInputDisplayed).is.true;

        const isPasswordTextInputDisplayed = await this.getPasswordTextInput().isElementAvailable();
        expect(isPasswordTextInputDisplayed).is.true;

        const isRepeatPasswordTextInputDisplayed = await this.getRepeatPasswordTextInput().isElementAvailable();
        expect(isRepeatPasswordTextInputDisplayed).is.true;

        const isSecurityQuestionDropDownDisplayed = await this.getSecurityDropDown().isElementAvailable();
        expect(isSecurityQuestionDropDownDisplayed).is.true;

        const isSecurityAnswerTextInputDisplayed = await this.getSecurityAnswerTextInput().isElementAvailable();
        expect(isSecurityAnswerTextInputDisplayed).is.true;

        const isRegisterButtonDisplayed = await this.getRegisterButton().isElementAvailable();
        expect(isRegisterButtonDisplayed).is.true;

        const isAlreadyRegisteredLinkDisplayed = await this.getAlreadyRegisteredLink().isElementAvailable();
        expect(isAlreadyRegisteredLinkDisplayed).is.true;
    }

    async doSignup(user) {
        await this.getEmailTextInput().fastType(user.email);
        await this.getPasswordTextInput().fastType(user.password);
        await this.getRepeatPasswordTextInput().fastType(user.password);
        await this.getSecurityDropDown().click();
        await browser.delay(1000);
        await this.getDropDownOption(user.securityQuestion).click();
        await this.getSecurityAnswerTextInput().fastType(user.securityAnswer);
        await this.getRegisterButton().click();
        const isSignUpSuccessMessage = await this.getPageText("Registration completed successfully. You can now log in.").isElementAvailable();
        expect(isSignUpSuccessMessage).is.true;
    }
}

module.exports = SignUpPage;