describe("TOPTAL - Box API automation tests", function () {
    let accessToken;
    const generalFolderName = `test-folder-${Date.now()}`;
    const newFolderName = `new-folder-${Date.now()}`;

    /**
     * We need to get the 'code' and it requires browser interaction.
     * On before method we are calling the GET Request Authorization API on browser,
     * which will return the code on the response URI.
     */
    before("GET: Authorize user (via browser)", function () {
        // Move to app.box.com and do login with valid user
        cy.visit("https://app.box.com/");
        cy.get("#login-email").type(Cypress.env('box_email')).should("have.value", 'pratikquora2@gmail.com');
        cy.get("#login-submit").first().click();
        cy.get("#password-login").type(Cypress.env('box_password')).should("have.value", '12qw!@QWBox');
        cy.get("#login-submit-password").first().click();

        // (1) GET: Request Authorization API
        cy.visit(`${Cypress.env('API_BASE_URL')}/oauth2/authorize?response_type=code&client_id=${Cypress.env('client_id')}`);
        cy.get("#consent_accept_button").click();

        // Get the code from URL
        cy.url().should('include', 'code').as('authenticatedUrl');
    });

    /**
     * POST Get Access & Refresh Token
     * Using the code which obtained from 'before' hook we are calling
     * POST: Get Access & Refresh Token to generate the access and refresh tokens.
     */
    it("POST: Request access token", function () {
        const code = this.authenticatedUrl.split('?code=')[1];

        const reqData = {
            method: 'POST',
            url: `${Cypress.env('API_BASE_URL')}/oauth2/token`, // baseUrl is prepended to url
            form: true, // indicates the body should be form urlencoded and sets Content-Type: application/x-www-form-urlencoded headers
            failOnStatusCode: false, // to not fail on bad status codes
            body: {
                grant_type: 'authorization_code', // Need to get the authorization code
                code: code,
                client_id: Cypress.env('client_id'),
                client_secret: Cypress.env('client_secret')
            }
        };

        cy.request(reqData).its('body').then(res => {
            window.var_access_token = res.access_token;
        })
    });

    describe("1) POST: Create new folder", function () {
        const reqData = function (reqUrl, authToken, folderName, parentFolderId) {
            return {
                method: 'POST',
                url: reqUrl,
                failOnStatusCode: false,
                auth: {
                    bearer: authToken,
                },
                body: {
                    name: folderName, // Assign name to folder
                    parent: {
                        id: parentFolderId // id of the parent folder
                    }
                }
            }
        };

        it("Create folder with unique name and by passing valid authentication token and valid parent folder_id", function () {
            const reqUrl = `${Cypress.env('API_BASE_URL')}/2.0/folders`;
            const authToken = window.var_access_token;
            const folderName = generalFolderName;
            const parentFolderId = Cypress.env('parent_folder_id');

            cy.request(reqData(reqUrl, authToken, folderName, parentFolderId)).then(res => {
                // Check status code
                expect(res.status).to.eq(201);
                expect(res.statusText).to.eq('Created');

                // Save folder id
                window.var_folder_id = res.body['id']
                // Check response headers
                expect(res.headers['cache-control']).to.eq('no-cache, no-store');
                expect(res.headers['connection']).to.eq('keep-alive');
                expect(res.headers['content-type']).to.eq('application/json');
                expect(res.headers['strict-transport-security']).to.eq('max-age=31536000');
                expect(res.headers['transfer-encoding']).to.eq('chunked');

                // Check response body
                expect(res.body['name']).to.eq(folderName);
                expect(res.body['type']).to.eq('folder');
                expect(res.body['created_by']['login']).to.eq(Cypress.env('box_email'));
                expect(res.body['parent']['name']).to.eq(Cypress.env('parent_folder_name'));
            });
        });

        it("Create folder with same name and by passing valid authentication token", function () {
            const reqUrl = `${Cypress.env('API_BASE_URL')}/2.0/folders`;
            const authToken = window.var_access_token;
            const folderName = generalFolderName;
            const parentFolderId = Cypress.env('parent_folder_id');

            cy.request(reqData(reqUrl, authToken, folderName, parentFolderId)).then(res => {
                // Check status code
                expect(res.status).to.eq(409);
                expect(res.statusText).to.eq('Conflict');

                // Check response headers
                expect(res.headers['cache-control']).to.eq('no-cache, no-store');
                expect(res.headers['connection']).to.eq('keep-alive');
                expect(res.headers['content-type']).to.eq('application/json');
                expect(res.headers['strict-transport-security']).to.eq('max-age=31536000');
                expect(res.headers['transfer-encoding']).to.eq('chunked');

                // Check response body
                expect(res.body['type']).to.eq('error');
            });
        });

        it("Create folder by passing invalid parent folder_id", function () {
            const reqUrl = `${Cypress.env('API_BASE_URL')}/2.0/folders`;
            const authToken = window.var_access_token;
            const folderName = generalFolderName;
            const parentFolderId = '-1';

            cy.request(reqData(reqUrl, authToken, folderName, parentFolderId)).then(res => {
                // Check status code
                expect(res.status).to.eq(404);

                // Check response headers
                expect(res.headers['cache-control']).to.eq('no-cache, no-store');
                expect(res.headers['connection']).to.eq('keep-alive');
                expect(res.headers['content-type']).to.eq('application/json');
                expect(res.headers['strict-transport-security']).to.eq('max-age=31536000');
                expect(res.headers['transfer-encoding']).to.eq('chunked');

                // Check response body
                expect(res.body['type']).to.eq('error');
                expect(res.body['code']).to.eq('not_found');
            });
        });

        it("Create folder by passing invalid authentication token", function () {
            const reqUrl = `${Cypress.env('API_BASE_URL')}/2.0/folders`;
            const authToken = 'test123';
            const folderName = generalFolderName;
            const parentFolderId = Cypress.env('parent_folder_id');

            cy.request(reqData(reqUrl, authToken, folderName, parentFolderId)).then(res => {
                // Check status code
                expect(res.status).to.eq(401);

                // Check response headers
                expect(res.headers['connection']).to.eq('keep-alive');
                expect(res.headers['strict-transport-security']).to.eq('max-age=31536000');
                expect(res.headers['transfer-encoding']).to.eq('chunked');
                expect(res.headers['www-authenticate']).to.contain('invalid_token').to.contain('The access token provided is invalid');
            });
        });
    });

    describe("2) GET: Get that folder information", function () {
        const reqData = function (reqUrl, authToken) {
            return {
                method: 'GET',
                url: reqUrl,
                failOnStatusCode: false,
                auth: {
                    bearer: authToken
                }
            }
        };

        it("Get folder details by passing folder_id for newly created folder", function () {
            const reqUrl = `${Cypress.env('API_BASE_URL')}/2.0/folders/${window.var_folder_id}`;
            const authToken = window.var_access_token;

            cy.request(reqData(reqUrl, authToken)).then(res => {
                // Check status code
                expect(res.status).to.eq(200);
                // Check response headers
                expect(res.headers['cache-control']).to.eq('no-cache, no-store');
                expect(res.headers['connection']).to.eq('keep-alive');
                expect(res.headers['content-encoding']).to.eq('gzip');
                expect(res.headers['content-type']).to.eq('application/json');
                expect(res.headers['strict-transport-security']).to.eq('max-age=31536000');
                expect(res.headers['transfer-encoding']).to.eq('chunked');

                // Check response body
                expect(res.body['type']).to.eq('folder');
                expect(res.body['id']).to.eq(window.var_folder_id);
                expect(res.body['name']).to.eq(generalFolderName);
            });
        });

        it("Get folder details by passing invalid folder_id", function () {
            const reqUrl = `${Cypress.env('API_BASE_URL')}/2.0/folders/-1`;
            const authToken = window.var_access_token;

            cy.request(reqData(reqUrl, authToken)).then(res => {
                // Check status code
                expect(res.status).to.eq(404);

                // Check response headers
                expect(res.headers['cache-control']).to.eq('no-cache, no-store');
                expect(res.headers['connection']).to.eq('keep-alive');
                expect(res.headers['content-type']).to.eq('application/json');
                expect(res.headers['strict-transport-security']).to.eq('max-age=31536000');
                expect(res.headers['transfer-encoding']).to.eq('chunked');

                // Check response body
                expect(res.body['type']).to.eq('error');
                expect(res.body['code']).to.eq('not_found');
            });
        });

        it("Get folder details by passing invalid authentication token", function () {
            const reqUrl = `${Cypress.env('API_BASE_URL')}/2.0/folders/${window.var_folder_id}`;
            const authToken = 1;

            cy.request(reqData(reqUrl, authToken)).then(res => {
                // Check status code
                expect(res.status).to.eq(401);

                // Check response headers
                expect(res.headers['connection']).to.eq('keep-alive');
                expect(res.headers['strict-transport-security']).to.eq('max-age=31536000');
                expect(res.headers['transfer-encoding']).to.eq('chunked');
                expect(res.headers['www-authenticate']).to.contain('invalid_token').to.contain('The access token provided is invalid');

                // Check response body
                expect(res.body).to.eq('');
            });
        });

    });

    describe("3) PUT: Update the folder name", function () {
        const reqData = function (reqUrl, authToken, newFolderName) {
            return {
                method: 'PUT',
                url: reqUrl,
                failOnStatusCode: false,
                auth: {
                    bearer: authToken,
                },
                body: {
                    name: newFolderName, // Give the new folder name
                }
            }
        };

        it("Update folder name by passing valid folder_id", function () {
            const reqUrl = `${Cypress.env('API_BASE_URL')}/2.0/folders/${window.var_folder_id}`;
            const authToken = window.var_access_token;

            cy.request(reqData(reqUrl, authToken, newFolderName)).then(res => {
                // Check status code
                expect(res.status).to.eq(200);

                // Check response headers
                expect(res.headers['connection']).to.eq('keep-alive');
                expect(res.headers['content-encoding']).to.eq('gzip');
                expect(res.headers['content-type']).to.eq('application/json');
                expect(res.headers['strict-transport-security']).to.eq('max-age=31536000');
                expect(res.headers['transfer-encoding']).to.eq('chunked');

                // Check response body
                expect(res.body['type']).to.eq('folder');
                expect(res.body['id']).to.eq(window.var_folder_id);
                expect(res.body['name']).to.eq(newFolderName);
            })
        });

        it("Update folder name by passing invalid folder_id", function () {
            const reqUrl = `${Cypress.env('API_BASE_URL')}/2.0/folders/-1`;
            const authToken = window.var_access_token;

            cy.request(reqData(reqUrl, authToken, newFolderName)).then(res => {
                // Check status code
                expect(res.status).to.eq(404);

                // Check response headers
                expect(res.headers['cache-control']).to.eq('no-cache, no-store');
                expect(res.headers['connection']).to.eq('keep-alive');
                expect(res.headers['content-type']).to.eq('application/json');
                expect(res.headers['strict-transport-security']).to.eq('max-age=31536000');
                expect(res.headers['transfer-encoding']).to.eq('chunked');

                // Check response body
                expect(res.body['type']).to.eq('error');
                expect(res.body['code']).to.eq('not_found');
            })
        });

        it("Update folder name by passing invalid authentication token", function () {
            const reqUrl = `${Cypress.env('API_BASE_URL')}/2.0/folders/${window.var_folder_id}`;
            const authToken = 1;

            cy.request(reqData(reqUrl, authToken, newFolderName)).then(res => {
                // Check status code
                expect(res.status).to.eq(401);

                // Check response headers
                expect(res.headers['connection']).to.eq('keep-alive');
                expect(res.headers['strict-transport-security']).to.eq('max-age=31536000');
                expect(res.headers['transfer-encoding']).to.eq('chunked');
                expect(res.headers['www-authenticate']).to.contain('invalid_token').to.contain('The access token provided is invalid');
            })
        });
    });

    describe("4) GET: Get that folder information", function () {
        const reqData = function (reqUrl, authToken) {
            return {
                method: 'GET',
                url: reqUrl,
                auth: {
                    bearer: authToken
                }
            }
        };

        it("Get folder details by passing folder_id for newly created folder", function () {
            const reqUrl = `${Cypress.env('API_BASE_URL')}/2.0/folders/${window.var_folder_id}`;
            const authToken = window.var_access_token;

            cy.request(reqData(reqUrl, authToken)).then(res => {
                // Check status code
                expect(res.status).to.eq(200);
                // Check response headers
                expect(res.headers['cache-control']).to.eq('no-cache, no-store');
                expect(res.headers['connection']).to.eq('keep-alive');
                expect(res.headers['content-encoding']).to.eq('gzip');
                expect(res.headers['content-type']).to.eq('application/json');
                expect(res.headers['strict-transport-security']).to.eq('max-age=31536000');
                expect(res.headers['transfer-encoding']).to.eq('chunked');

                // Check response body
                expect(res.body['type']).to.eq('folder');
                expect(res.body['id']).to.eq(window.var_folder_id);
                expect(res.body['name']).to.eq(newFolderName);
            });
        });

    });

    describe("5) DELETE: Delete that folder", function () {
        const reqData = function (reqUrl, authToken) {
            return {
                method: 'DELETE',
                url: reqUrl,
                failOnStatusCode: false,
                auth: {
                    bearer: authToken,
                }
            }
        };

        it("Delete folder name by passing invalid authentication token and valid folder_id", function () {
            const reqUrl = `${Cypress.env('API_BASE_URL')}/2.0/folders/${window.var_folder_id}`;
            const authToken = 'test123';

            cy.request(reqData(reqUrl, authToken)).then(res => {
                // Check status code
                expect(res.status).to.eq(401);

                // Check response headers
                expect(res.headers['connection']).to.eq('keep-alive');
                expect(res.headers['strict-transport-security']).to.eq('max-age=31536000');
                expect(res.headers['transfer-encoding']).to.eq('chunked');
                expect(res.headers['www-authenticate']).to.contain('invalid_token').to.contain('The access token provided is invalid');

                // Check response body
                expect(res.body).to.eq('');
            });
        });

        it("Delete folder name by passing folder_id for newly created folder", function () {
            const reqUrl = `${Cypress.env('API_BASE_URL')}/2.0/folders/${window.var_folder_id}`;
            const authToken = window.var_access_token;

            cy.request(reqData(reqUrl, authToken)).then(res => {
                // Check status code
                expect(res.status).to.eq(204);
                expect(res.statusText).to.eq('No Content');

                // Check response headers
                expect(res.headers['cache-control']).to.eq('no-cache, no-store');
                expect(res.headers['connection']).to.eq('keep-alive');
                expect(res.headers['content-location']).to.eq(`${Cypress.env('API_BASE_URL')}/2.0/folders/${window.var_folder_id}/trash`);

                // Check response body
                expect(res.body).to.eq('');
            });
        });

        it("Delete folder name by passing the same deleted folder_id", function () {
            const reqUrl = `${Cypress.env('API_BASE_URL')}/2.0/folders/${window.var_folder_id}`;
            const authToken = window.var_access_token;

            cy.request(reqData(reqUrl, authToken)).then(res => {
                // Check status code
                expect(res.status).to.eq(404);

                // Check response headers
                expect(res.headers['cache-control']).to.eq('no-cache, no-store');
                expect(res.headers['connection']).to.eq('keep-alive');
                expect(res.headers['content-type']).to.eq('application/json');
                expect(res.headers['strict-transport-security']).to.eq('max-age=31536000');
                expect(res.headers['transfer-encoding']).to.eq('chunked');

                // Check response body
                expect(res.body['type']).to.eq('error');
                expect(res.body['code']).to.eq('not_found');
                cy.log(res.body['context_info'][0])
                cy.log(res.body['context_info']['errors'][0])
            });
        });
    });

    describe("6) GET: Get deleted folder information", function () {
        const reqData = function (reqUrl, authToken) {
            return {
                method: 'GET',
                url: reqUrl,
                failOnStatusCode: false,
                auth: {
                    bearer: authToken
                }
            }
        };

        it("Get folder details by passing folder_id for newly created folder", function () {
            const reqUrl = `${Cypress.env('API_BASE_URL')}/2.0/folders/${window.var_folder_id}`;
            const authToken = window.var_access_token;

            cy.request(reqData(reqUrl, authToken)).then(res => {
                // Check status code
                expect(res.status).to.eq(404);

                // Check response headers
                expect(res.headers['cache-control']).to.eq('no-cache, no-store');
                expect(res.headers['connection']).to.eq('keep-alive');
                expect(res.headers['content-type']).to.eq('application/json');
                expect(res.headers['strict-transport-security']).to.eq('max-age=31536000');
                expect(res.headers['transfer-encoding']).to.eq('chunked');

                // Check response body
                expect(res.body['type']).to.eq('error');
                expect(res.body['code']).to.eq('trashed');
                expect(res.body['message']).to.eq('Item is trashed');
            });
        });
    });
});