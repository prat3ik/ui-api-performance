const BasePage = require("./BasePage");
const WebComponent = require("../BaseUI/Components/WebComponent");
const TextView = require("../BaseUI/Components/TextView");
const Button = require("../BaseUI/Components/Button");
const TextInput = require("../BaseUI/Components/TextInput");

class ProfilePage extends BasePage {

    constructor() {
        super();
    }

    //-------------------- Elements -----------------//
    getProfileInformationContainer() {
        return new WebComponent(SelectorType.CSS, `div#card`);
    }

    getProfileContainerTitle() {
        return new TextView(SelectorType.XPATH, `.//h1[text()="User Profile"]`);
    }

    getProfileImage() {
        return new WebComponent(SelectorType.CSS, `img[alt="profile picture"]`);
    }

    getEmailTextInput() {
        return new TextInput(SelectorType.CSS, `input#email`);
    }

    getImageUploadInput() {
        return new TextInput(SelectorType.CSS, `input[type="file"]`);
    }

    getUploadPictureButton() {
        return new Button(SelectorType.CSS, `button[aria-label="Button to upload the profile picture"]`);
    }

    //------------------- Verify Elements on UI --------------------------//

    async verifyUserProfilePageIsDisplayed(email) {
        const isProfileContainerDisplayed = await this.getProfileInformationContainer().isElementAvailable();
        expect(isProfileContainerDisplayed).is.true;

        const isProfileContainerTitleDisplayed = await this.getProfileContainerTitle().isElementAvailable();
        expect(isProfileContainerTitleDisplayed).is.true;

        const isProfileImageDisplayed = await this.getProfileImage().isElementAvailable();
        expect(isProfileImageDisplayed).is.true;

        const isUserEmailDisplayed = await this.getEmailTextInput().isElementAvailable();
        const emailText = await this.getEmailTextInput().getAttributeValue('value');
        expect(isUserEmailDisplayed).is.true;
        expect(emailText).is.eq(email);

        const isImageUploadInputDisplayed = await this.getImageUploadInput().isElementAvailable();
        expect(isImageUploadInputDisplayed).is.true;

        const isUploadPictureButtonDisplayed = await this.getUploadPictureButton().isElementAvailable();
        expect(isUploadPictureButtonDisplayed).is.true;
    }

    async uploadProfilePicture(fileName) {
        await this.getImageUploadInput().fastType(`${process.cwd()}/tests/TestData/${fileName}`);
        await this.getUploadPictureButton().click();
    }

    async verifyProfileImageViewIsNotEmpty() {
        const imageSrc = await this.getProfileImage().getAttributeValue('src');
        expect(imageSrc).to.contain('.jpg');
    }
}

module.exports = ProfilePage;