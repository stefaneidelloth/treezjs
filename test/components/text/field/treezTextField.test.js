import CustomElementsMock from '../../../customElementsMock.js';

import TreezTextField from '../../../../src/components/text/field/treezTextField.js';

import TestUtils from '../../../testUtils.js';

import puppeteerToIstanbul from 'puppeteer-to-istanbul';

jest.setTimeout(100000);

describe('TreezTextField', ()=>{

    const id = 'treez-text-field';

    let page;

    beforeAll(async () => {
        page = await TestUtils.createBrowserPage();
        await page.coverage.startJSCoverage();

    });

    beforeEach(async () => {
        await TestUtils.clearBody(page);
        await TestUtils.createCustomElement(page, id, 'TreezTextField', '../../src/components/text/field/treezTextField.js');
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
                element.label = 'labelMock';

                removeExistingChildren(element);
                const methodCalls = prepareMocks(element);

                element.connectedCallback();

                const methodsAreCalled = (methodCalls['__createTextFieldLabel'] === true) &&
                    (methodCalls['__createTextField'] === true) &&
                    (methodCalls['updateElements'] === null) &&
                    (methodCalls['disableElements'] === false) &&
                    (methodCalls['hideElements'] === false);

                console.log('methods are called:' + methodsAreCalled);

                return methodsAreCalled;

                function prepareMocks(element) {
                    const methodCalls = {};

                    element.__createTextFieldLabel = () => {
                        methodCalls['__createTextFieldLabel'] = true;
                    };

                    element.__createTextField = () => {
                        methodCalls['__createTextField'] = true;
                    };

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
                    element.__textField = undefined;

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

                let textIsSet = element.__textField.value === 'newValueMock';

                return textIsSet;

            }, {id});
            expect(success).toBe(true);

        });

        it('updateWidth', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                element.updateWidth('88%');

                let textIsSet = element.__textField.style.width === '88%';

                return textIsSet;

            }, {id});
            expect(success).toBe(true);

        });

        it('disableElements', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                element.disableElements(true);

                let areaIsDisabled = element.__textField.disabled === true;

                return areaIsDisabled;

            }, {id});
            expect(success).toBe(true);

        });

        it('hideElements', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);
                element.label = 'myLabel';

                element.hideElements(true);

                let labelIsHidden = element.__label.style.display === 'none';
                let textFieldIsHidden = element.__textField.style.display === 'none';

                return labelIsHidden && textFieldIsHidden;

            }, {id});
            expect(success).toBe(true);

        });

    });

    describe('Private API', ()=>{

        it('__textFieldChanged', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                element.__textField.value = 'foo';

                let valueIsNotSetBefore = element.value === null;

                element.__textFieldChanged();

                let valueIsSetAfter = element.value === 'foo';

                return valueIsNotSetBefore && valueIsSetAfter;

            }, {id});
            expect(success).toBe(true);

        });

        it('__createTextFieldLabel', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                while (element.firstChild) {
                    element.firstChild.remove();
                }
                element.__label = undefined;

                element.__createTextFieldLabel();

                let label = element.__label;
                let labelIsCreated = label.constructor.name === 'HTMLLabelElement';
                let labelIsAttached = element.firstChild === label;

                return labelIsCreated && labelIsAttached;

            }, {id});
            expect(success).toBe(true);

        });

        it('__createTextField', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);
                while (element.firstChild) {
                    element.firstChild.remove();
                }
                element.__textField = undefined;

                element.__createTextField();

                let textField = element.__textField;
                let textFieldIsCreated = textField.constructor.name === 'HTMLInputElement';
                let textFieldIsAttached = element.firstChild === textField;

                return textFieldIsCreated && textFieldIsAttached;

            }, {id});
            expect(success).toBe(true);

        });

    });

    afterAll(async () => {

        const jsCoverage = await page.coverage.stopJSCoverage();

        puppeteerToIstanbul.write([...jsCoverage]);
        //also see https://github.com/istanbuljs/puppeteer-to-istanbul
        //run following command to create index.html inside coverage folder:
        //nyc report --reporter=html

        await TestUtils.close(page);
    });

});

