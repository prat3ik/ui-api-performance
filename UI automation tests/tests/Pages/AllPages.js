const HomePage = require("./HomePage");
const LoginPage = require("./LoginPage");
const SearchPage = require("./SearchPage");
const ProfilePage = require("./ProfilePage");
const SignUpPage = require("./SignUpPage");

class AllPages {
    constructor(browser) {
        this.homePage = new HomePage();
        this.loginPage = new LoginPage();
        this.searchPage = new SearchPage();
        this.profilePage = new ProfilePage();
        this.signUpPage = new SignUpPage();
    }
}

module.exports = AllPages;