import CustomElementsMock from '../../customElementsMock.js';

import TreezTabFolder from '../../../src/components/tabs/treezTabFolder.js';

import TestUtils from '../../testUtils.js';

import puppeteerToIstanbul from 'puppeteer-to-istanbul';

jest.setTimeout(100000);

describe('TreezTabFolder', ()=>{

    const id = 'treez-tab-folder';

    let page;

    beforeAll(async () => {
        page = await TestUtils.createBrowserPage();
        await page.coverage.startJSCoverage();

    });

    beforeEach(async () => {
        await TestUtils.clearBody(page);
        await TestUtils.createCustomElement(page, id, 'TreezTabFolder', '../../src/components/tabs/treezTabFolder.js');
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

                removeExistingChildren(element);

                element.connectedCallback();

                let header = element.__tabFolderHeader;
                let headerIsCreated = header.constructor.name === 'TreezTabFolderHeader';
                console.log('header is created: ' + headerIsCreated);

                let headerIsInserted = element.firstChild === header;
                console.log('header is inserted: ' + headerIsInserted);

                let styleIsSet = element.style.display === 'block';


                return headerIsCreated &&
                    headerIsInserted &&
                    styleIsSet;

                function removeExistingChildren(element) {

                    element.__tabFolderHeader = undefined;

                    while (element.firstChild) {
                        element.firstChild.remove();
                    }
                }

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

        it('createTabHeaderForTabIfNotExists', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                let methodCalls = {};
                element.__showFirstTab = ()=>{
                    methodCalls['__showFirstTab'] = true;
                };
                element.__hideAllTabs = ()=>{
                    methodCalls['__hideAllTabs'] = true;
                };

                let tabMock = document.createElement('div');
                tabMock.label = 'tabLabelMock';
                tabMock.style.display = 'none';

                element.createTabHeaderForTabIfNotExists(tabMock);

                let header = tabMock.tabHeader;
                let tabHeaderIsCreated = header.constructor.name === 'TreezTabHeader';

                let headerTextIsSet = header.innerText === 'tabLabelMock';

                let tabHeaderIsIncludedInTabFolderHeader = element.__tabFolderHeader.firstChild === header;

                let methodIsCalled = methodCalls['__showFirstTab'] === true;

                header.click();

                let tabIsShownAfterClick = tabMock.style.display === 'block';
                let tabHeaderIsSelectedAfterClick = header.classList.contains('selected');
                let hideAllIsCalledAfterClick = methodCalls['__hideAllTabs'] === true;

                return tabHeaderIsCreated &&
                    headerTextIsSet &&
                    tabHeaderIsIncludedInTabFolderHeader &&
                    methodIsCalled &&
                    tabIsShownAfterClick &&
                    tabHeaderIsSelectedAfterClick &&
                    hideAllIsCalledAfterClick;

            }, {id});
            expect(success).toBe(true);

        });

    });

    describe('Private API', ()=>{

        it('__hideAllTabs', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                let firstTab = document.createElement('treez-tab');
                element.appendChild(firstTab);

                let secondTab = document.createElement('treez-tab');
                element.appendChild(secondTab);

                firstTab.click();

                let firstTabIsSelectedBefore = firstTab.tabHeader.classList.contains('selected');

                element.__hideAllTabs();

                let firstTabIsNotSelectedAfter = !firstTab.tabHeader.classList.contains('selected');

                let firstTabIsHiddenAfter = firstTab.style.display === 'none';
                let secondTabIsHiddenAfter = secondTab.style.display === 'none';

                return firstTabIsSelectedBefore &&
                    firstTabIsNotSelectedAfter &&
                    firstTabIsHiddenAfter &&
                    secondTabIsHiddenAfter;

            }, {id});
            expect(success).toBe(true);

        });

        it('__showFirstTab', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                let firstTab = document.createElement('treez-tab');
                element.appendChild(firstTab);

                let secondTab = document.createElement('treez-tab');
                element.appendChild(secondTab);

                secondTab.click();

                let methodCalls = {};
                element.__hideAllTabs = ()=>{
                    methodCalls['__hideAllTabs'] = true;
                };

                element.__showFirstTab();

                let methodIsCalled = methodCalls['__hideAllTabs'] === true;
                let firstTabHeaderIsSelected = firstTab.tabHeader.classList.contains('selected');
                let firstTabIsShown = firstTab.style.display === 'block';

                return methodIsCalled &&
                    firstTabHeaderIsSelected &&
                    firstTabIsShown;

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

