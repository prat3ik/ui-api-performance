const BrowserFactory = require("../BaseUI/BrowserFactory");
const chai = require('chai');
const AllPages = require("../Pages/AllPages");

// Globals
global.fileUtil = require('../BaseUI/FileUtil');
global.SelectorType = require("../BaseUI/SelectorType");
global.Utils = require("../Libs/Utils");
global.assert = chai.assert;
global.expect = chai.expect;
global.browser = null;
global.pages = null;

before(async function() {

});

after(async function() {
  // runs after all tests in this file
});

beforeEach(async function() {
  // runs before each test in this block
  browser = await BrowserFactory.createBrowser(this);
  pages = new AllPages();
  // Pages initialization
});

afterEach(async function() {
  if (this.currentTest.state !== "passed") {
    const imageFileName = this.currentTest.title + '.jpeg';
    await browser.captureScreenshot(imageFileName, this);
    await browser.savePageSourceToFile(this.currentTest.title)
  }
  await browser.close();
});
