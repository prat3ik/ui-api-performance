const BasePage = require("./BasePage");
const TextView = require("../BaseUI/Components/TextView");
const Button = require("../BaseUI/Components/Button");

class HomePage extends BasePage {

    constructor() {
        super();
        this.url = browser.getBaseUrl();
        console.info(`Base URL: ${this.url}`)
    }

    //--------------------- Elements ------------------------//

    getAllProductTitleText() {
        return new TextView(SelectorType.XPATH, `.//div[text()="All Products"]`);
    }

    getWelcomeModalCloseButton() {
        return new Button(SelectorType.CSS, `button[aria-label="Close Welcome Banner"]`);
    }

    //---------------------- Verify Elements on UI ---------------//

    async verifyHomePageIsDisplayed() {
        await this.getWelcomeModalCloseButton().click();
        const isProductTitleTextDisplayed = await this.getAllProductTitleText().isElementAvailable();
        expect(isProductTitleTextDisplayed).is.true;
    }
}

module.exports = HomePage;