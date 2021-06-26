const axios = require('axios').default;
require('dotenv').config();
const fs = require('fs');
const Browser = require('./../BaseUI/Browser');

const report = async (reportFilePath) => {
    let failingTestsCount = 1;
    let pendingTestsCount = 1;
    let skippedTestsCount = 1;
    const testResult = JSON.parse(fs.readFileSync(reportFilePath, 'utf8'));
    const passedTests = parseInt(testResult['stats']['passes']);
    const failedTests = parseInt(testResult['stats']['failures']);
    const skippedTests = parseInt(testResult['stats']['skipped']);
    const pendingTests = parseInt(testResult['stats']['pending']);
    const color = (failedTests > 0 || skippedTests > 0) ? '#ff1a1a' : '#76b000';
    let failingTestData = '';
    let pendingTestData = '';
    let skippedTestData = '';
    let browser = new Browser();
    const env = browser.getEnv();

    testResult.results.forEach(result => {
        result.suites.forEach(suite => {
            suite.suites.forEach(suite => {
                suite.tests.forEach(test => {
                    if (test.state === 'failed') {
                        failingTestData = `${failingTestData} ${failingTestsCount++}) ${test.title} \n ${test.err.message} \n\n`
                    } else if (test.state === 'pending') {
                        pendingTestData = `${pendingTestData} (${pendingTestsCount++}) ${test.fullTitle} \n\n`
                    } else if (test.state === 'skipped') {
                        skippedTestData = `${skippedTestData} (${skippedTestsCount++}) ${test.fullTitle} \n\n`
                    }
                })
            })
        })
    })

    let overallResultData = `*Passed:* ${passedTests}\n*Failed:* ${failedTests}\n*Skipped:* ${skippedTests}\n*Pending:* ${pendingTests}`;

    if (failingTestData !== '') {
        if(failingTestData.length > 1500)
            overallResultData += '\n\n\n ---------------- \n'
        else
            overallResultData += `\n\n\n*Failing tests:*\n ---------------- \n${failingTestData}`
    }

    if (pendingTestData !== '')
        overallResultData += `\n\n\n*Pending tests:*\n ---------------- \n${pendingTestData}`

    if (skippedTestData !== '')
        overallResultData += `\n\n\n*Skipped tests:*\n ---------------- \n${skippedTestData}`

    const slackData = {
        "attachments": [
            {
                "blocks": [
                    {
                        "text": {
                            "text": overallResultData,
                            "type": "mrkdwn"
                        },
                        "type": "section"
                    }
                ],
                "color": color
            }
        ],
        "blocks": [
            {
                "text": {
                    "text": `*Juice Shop - Automation tests summary - ${env.toUpperCase()}*\n`,
                    "type": "mrkdwn"
                },
                "type": "section"
            }
        ]
    }

    await axios.post(`https://hooks.slack.com/services/${process.env.SLACK_WEBHOOK}`, slackData);
}

(async () => {
    await report(`${__dirname}/../../TestResults/test-report.json`);
})();