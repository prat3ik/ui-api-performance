describe("Juice Shop Tests:", function() {

    before("Test Configuration", async function() {
        this.user = {
            email: Utils.generateEmail(),
            password: "pass1234!@",
            securityQuestion: " Your eldest siblings middle name? ",
            securityAnswer: "Test"
        }
    });

    it("Verify user should able to signup", async function() {
        await pages.homePage.goTo();
        await pages.homePage.verifyHomePageIsDisplayed();
        await pages.homePage.goToLoginPage();
        await pages.loginPage.verifyLoginPageIsDisplayed();
        await pages.loginPage.clickOnNotYetACustomerLink();
        await pages.signUpPage.verifyUserRegisterPageIsDisplayed();
        await pages.signUpPage.doSignup(this.user);
        await pages.loginPage.fillLoginFormAndClickOnLogin(this.user);
        await pages.homePage.verifyUserIsLoggedIn();
    });

    it("Verify valid user should able to login", async function() {
        await pages.homePage.goTo();
        await pages.homePage.verifyHomePageIsDisplayed();
        await pages.homePage.goToLoginPage();
        await pages.loginPage.verifyLoginPageIsDisplayed();
        await pages.loginPage.fillLoginFormAndClickOnLogin(this.user);
        await pages.homePage.verifyUserIsLoggedIn();
    });

    it("Verify invalid user should not able to login", async function() {
        const user = {
            email: "invalidemail@0ranges.com",
            password: "pass1234!@"
        }

        await pages.homePage.goTo();
        await pages.homePage.verifyHomePageIsDisplayed();
        await pages.homePage.goToLoginPage();
        await pages.loginPage.verifyLoginPageIsDisplayed();
        await pages.loginPage.fillLoginFormAndClickOnLogin(user);
        await pages.loginPage.verifyLoginPageErrorMessage("Invalid email or password.");
    });

    it("Verify user should able to search valid product", async function() {
        const product = {
            name: "Apple Juice (1000ml)",
            price: "1.99¤"
        }

        await pages.homePage.goTo();
        await pages.homePage.verifyHomePageIsDisplayed();
        await pages.homePage.doSearchProduct(product.name);
        await pages.searchPage.verifySearchResultPageIsDisplayed(product.name);
        await pages.searchPage.verifyProductInformation([product]);
    });

    it("Verify user should not able to search invalid product", async function() {
        const productName = "xyz product";

        await pages.homePage.goTo();
        await pages.homePage.verifyHomePageIsDisplayed();
        await pages.homePage.doSearchProduct(productName);
        await pages.searchPage.verifySearchResultPageIsDisplayed(productName, { invalidProductName: true });
    });

    it("Valid user should be able to update own profile details.", async function() {
        await pages.homePage.goTo();
        await pages.homePage.verifyHomePageIsDisplayed();
        await pages.homePage.goToLoginPage();
        await pages.loginPage.verifyLoginPageIsDisplayed();
        await pages.loginPage.fillLoginFormAndClickOnLogin(this.user);
        await pages.loginPage.goToProfilePage();
        await pages.profilePage.verifyUserProfilePageIsDisplayed(this.user.email);
        await pages.profilePage.uploadProfilePicture("profile.jpeg");
        await pages.profilePage.verifyProfileImageViewIsNotEmpty();
    });
});