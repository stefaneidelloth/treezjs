import CustomElementsMock from '../../../customElementsMock.js';

import TreezTextArea from '../../../../src/components/text/area/TreezTextArea.js';

import TestUtils from '../../../testUtils.js';

import puppeteerToIstanbul from 'puppeteer-to-istanbul';

jest.setTimeout(100000);

describe('TreezTextArea', ()=>{

    const id = 'treez-text-area';

    let page;

    beforeAll(async () => {
        page = await TestUtils.createBrowserPage();
        await page.coverage.startJSCoverage();

    });

    beforeEach(async () => {
        await TestUtils.clearBody(page);
        await TestUtils.createCustomElement(page, id, 'TreezTextArea', '../../src/components/text/area/treezTextArea.js');
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
                const methodCalls = prepareMocks(element);

                element.connectedCallback();

                const methodsAreCalled = (methodCalls['updateElements'] === null) &&
                    (methodCalls['disableElements'] === false) &&
                    (methodCalls['hideElements'] === false);

                console.log('methods are called:' + methodsAreCalled);

                let labelIsCreated = element.__label.constructor.name === 'HTMLLabelElement';
                console.log('label is created: ' + labelIsCreated);

                let container = element.__container;
                let containerIsCreated = container.constructor.name === 'HTMLDivElement';
                console.log('container is created: ' + containerIsCreated);

                let textArea = container.firstChild;
                let textAreaIsCreated = textArea.constructor.name === 'HTMLTextAreaElement';
                console.log('text area is created: ' + textAreaIsCreated);

                return methodsAreCalled && labelIsCreated && containerIsCreated && textAreaIsCreated;

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

                function removeExistingChildren(element) {

                    element.__label = undefined;
                    element.__container = undefined;
                    element.__textArea = undefined;

                    while (element.firstChild) {
                        element.firstChild.remove();
                    }
                }

            }, {id});
            expect(success).toBe(true);
        });

        it('updateElements', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                element.updateElements('newValueMock');

                let textIsSet = element.__textArea.value === 'newValueMock';

                return textIsSet;

            }, {id});
            expect(success).toBe(true);

        });

        it('disableElements', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                element.disableElements(true);

                let areaIsDisabled = element.__textArea.disabled === true;

                return areaIsDisabled;

            }, {id});
            expect(success).toBe(true);

        });

        it('hideElements', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                element.hideElements(true);

                let labelIsHidden = element.__label.style.display === 'none';
                let containerIsHidden = element.__container.style.display === 'none';

                return labelIsHidden && containerIsHidden;

            }, {id});
            expect(success).toBe(true);

        });

    });

    describe('Private API', ()=>{

        it('__textAreaChanged', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                element.__textArea.value = 'foo';

                let valueIsNotSetBefore = element.value === null;

                element.__textAreaChanged();

                let valueIsSetAfter = element.value === 'foo';

                return valueIsNotSetBefore && valueIsSetAfter;

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

