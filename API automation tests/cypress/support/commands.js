// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.on('uncaught:exception', (err, runnable) => {
    return false
});

/**
 * Save the authentication token
 */
Cypress.Commands.add('saveAuthToken', (code) => {
    cy.request({
        method: 'POST',
        url: '/oauth2/token', // baseUrl is prepended to url
        form: true, // indicates the body should be form urlencoded and sets Content-Type: application/x-www-form-urlencoded headers
        body: {
            grant_type: 'authorization_code', // Need to get the authorization code
            code: code,
            client_id: Cypress.env('client_id'),
            client_secret: Cypress.env('client_secret')
        },
    }).its('body').then(response => {
        cy.log(response)
        cy.log(response.access_token)
        cy.log(response.refresh_token)
        cy.setLocalStorage("access_token", response.access_token);
        cy.setLocalStorage("refresh_token", response.refresh_token);
    });
});
