const dbc = require('../Libs/DeathByCaptcha');
require('dotenv').config();

class RecaptchaSolver {
    constructor(browser) {
        this.browser = browser;
        console.log(process.env.DEATH_BY_CAPTCHA_USERNAME);
    }

    getTokenParams() {
        return JSON.stringify({
            'proxy': '',
            'proxytype': '',
            'googlekey': process.env.RECAPTCHA_SITE_KEY,
            'pageurl': process.env.RECAPTCHA_PAGE_URL
        });
    }

    getClient() {
        return new dbc.HttpClient(process.env.DEATH_BY_CAPTCHA_USERNAME, process.env.DEATH_BY_CAPTCHA_PASSWORD);
    }

    async solve() {
        const token = await new Promise(resolve => {
            // Get user balance
            const client = this.getClient();
            client.get_balance((balance) => {
                console.log(`Remaining balance of deathbycaptcha is: ${balance}`);
            });
            client.decode({extra: {type: 4, token_params: this.getTokenParams()}}, async (captcha) => {
                try {
                    if (captcha) {
                        console.log('Captcha ' + captcha['captcha'] + ' solved: ' + captcha['text']);
                        return resolve(captcha['text']);
                    } else {
                        // Report an incorrectly solved CAPTCHA.
                        // Make sure the CAPTCHA was in fact incorrectly solved!
                        client.report(captcha['captcha'], (result) => {
                            console.log('Report status: ' + result);
                        });
                        return resolve(false);
                    }
                } catch (error) {
                    if (captcha == null)
                        console.log('Captcha is null!');
                    throw error;
                }
            });
        });
        await console.log(`Captcha token: ${token}`);
        await this.browser.executeJavaScript(`document.getElementById("g-recaptcha-response").innerHTML="${token}"`, null)
    }
}

module.exports = RecaptchaSolver;
