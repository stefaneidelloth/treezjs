import CustomElementsMock from '../../customElementsMock.js';

import TreezTab from '../../../src/components/tabs/treezTab.js';

import TestUtils from '../../testUtils.js';

import puppeteerToIstanbul from 'puppeteer-to-istanbul';

jest.setTimeout(100000);

describe('TreezTab', ()=>{

    const id = 'treez-tab';

    let page;

    beforeAll(async () => {
        page = await TestUtils.createBrowserPage();
        await page.coverage.startJSCoverage();

    });

    beforeEach(async () => {
        await TestUtils.clearBody(page);
        await TestUtils.createCustomElement(page, id, 'TreezTab', '../../src/components/tabs/treezTab.js');
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

                let methodCalls = {};

                let tabFolderMock = document.createElement('div');
                tabFolderMock.createTabHeaderForTabIfNotExists = ()=>{
                        methodCalls['createTabHeaderForTabIfNotExists'] = true;
                };

                tabFolderMock.appendChild(element);

                element.connectedCallback();

                const methodsAreCalled = methodCalls['createTabHeaderForTabIfNotExists'] === true;

                return methodsAreCalled;

            }, {id});
            expect(success).toBe(true);
        });

        it('attributeChangedCallback', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                element.tabHeader = document.createElement('span');

                element.attributeChangedCallback('label','oldValueMock','newValueMock');

                let headerTextIsSet = element.tabHeader.innerText === 'newValueMock';

                return headerTextIsSet;

            }, {id});
            expect(success).toBe(true);

        });

        it('disconnectedCallback', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                let content = document.createElement('div');
                element.appendChild(content);

                let hasChildrenBefore = element.children.length > 0;

                element.disconnectedCallback();

                let hasNoChildrenAfter = element.children.length === 0;

                return hasChildrenBefore && hasNoChildrenAfter;

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

