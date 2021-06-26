const BasePage = require("./BasePage");
const TextView = require("../BaseUI/Components/TextView");
const WebComponent = require("../BaseUI/Components/WebComponent");

class SearchPage extends BasePage {

    constructor() {
        super();
    }

    //---------------------- Elements -------------------------//
    getSearchResultText(searchText) {
        return new TextView(SelectorType.XPATH, `.//*[text()="Search Results - "]/../*[@id="searchValue" and text()="${searchText}"]`);
    }

    getProductName(productName) {
        return new TextView(SelectorType.XPATH, `.//div[@class="item-name" and contains(text(), "${productName}")]`);
    }

    getProductPrice(productName, productPrice) {
        return new TextView(SelectorType.XPATH, `.//div[@class="item-name" and contains(text(), "${productName}")]/../div[@class="item-price"]//*[contains(text(), "${productPrice}")]`)
    }

    getProductImage(productName) {
        return new WebComponent(SelectorType.CSS, `img[alt*="${productName}"]`);
    }

    getNoResultFoundText() {
        return new TextView(SelectorType.XPATH, `.//*[@class="noResultText" and contains(text(), "No results found")]`);
    }

    //----------------------- Verify Elements on UI -----------------//

    async verifySearchResultPageIsDisplayed(searchText, options = { invalidProductName: false }) {
        const isSearchResultTextDisplayed = await this.getSearchResultText(searchText).isElementAvailable();
        expect(isSearchResultTextDisplayed).is.true;

        if(options.invalidProductName) {
            const isNoResultsFoundTextDisplayed = await this.getNoResultFoundText().isElementAvailable();
            expect(isNoResultsFoundTextDisplayed).is.true;
        }else{
            const isProductNameDisplayed = await this.getProductImage(searchText).isElementAvailable();
            expect(isProductNameDisplayed).is.true;
        }
    }

    async verifyProductInformation(products) {
        for(const product of products) {
            const isProductImageDisplayed = await this.getProductImage(product.name).isElementAvailable();
            expect(isProductImageDisplayed).is.true;

            const isProductNameDisplayed = await this.getProductName(product.name).isElementAvailable();
            expect(isProductNameDisplayed).is.true;

            const isProductPriceDisplayed = await this.getProductPrice(product.name, product.price).isElementAvailable();
            expect(isProductPriceDisplayed).is.true;
        }
    }
}

module.exports = SearchPage;