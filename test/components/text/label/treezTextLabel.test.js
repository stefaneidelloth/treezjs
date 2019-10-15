import CustomElementsMock from '../../../customElementsMock.js';

import TreezTextLabel from '../../../../src/components/text/label/treezTextLabel.js';

import TestUtils from '../../../testUtils.js';

import puppeteerToIstanbul from 'puppeteer-to-istanbul';

jest.setTimeout(100000);

describe('TreezTextLabel', ()=>{

    const id = 'treez-text-label';

    let page;

    beforeAll(async () => {
        page = await TestUtils.createBrowserPage();
        await page.coverage.startJSCoverage();

    });

    beforeEach(async () => {
        await TestUtils.clearBody(page);
        await TestUtils.createCustomElement(page, id, 'TreezTextLabel', '../../src/components/text/label/treezTextLabel.js');
    });

    describe('State after construction', ()=>{

        it('id',  async ()=>{
            const property = await page.$eval('#' + id, element => element.id);
            expect(property).toBe(id);
        });

    });

    describe('Public API', ()=>{

        it('connectedCallback',  async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                const methodCalls = prepareMocks(element);

                element.connectedCallback();

                const methodsAreCalled = (methodCalls['updateElements'] === null) &&
                    (methodCalls['disableElements'] === false) &&
                    (methodCalls['hideElements'] === false);

                console.log('methods are called:' + methodsAreCalled);

                return methodsAreCalled;

                function prepareMocks(element) {
                    const methodCalls = {};

                    element.updateElements = (value) => {
                        methodCalls['updateElements'] = value;
                    };

                    element.disableElements = (value) => {
                        methodCalls['disableElements'] = value;
                    };

                    element.hideElements = (value) => {
                        methodCalls['hideElements'] = value;
                    };

                    return methodCalls;
                }

            }, {id});
            expect(success).toBe(true);
        });

        it('updateElements', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                element.updateElements('newValueMock');

                let textIsSet = element.innerHTML === 'newValueMock';

                return textIsSet;

            }, {id});
            expect(success).toBe(true);

        });

        it('disableElements', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                element.disableElements(true);
                return true;

            }, {id});
            expect(success).toBe(true);

        });

        it('hideElements', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);
                element.hideElements(true);  
                return element.style.display === 'none';

            }, {id});
            expect(success).toBe(true);

        });

    });

    afterAll(async () => {

        const jsCoverage = await page.coverage.stopJSCoverage();

        TestUtils.expectCoverage(jsCoverage,1,100);

        puppeteerToIstanbul.write([...jsCoverage]);
        //also see https://github.com/istanbuljs/puppeteer-to-istanbul
        //run following command to create index.html inside coverage folder:
        //nyc report --reporter=html

        await TestUtils.close(page);
    });

});

