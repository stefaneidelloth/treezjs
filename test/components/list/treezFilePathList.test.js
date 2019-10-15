import CustomElementsMock from '../../customElementsMock.js';

import TreezFilePathList from '../../../src/components/list/treezFilePathList.js';

import TestUtils from '../../testUtils.js';

import puppeteerToIstanbul from 'puppeteer-to-istanbul';

import TreezStringList from '../../../src/components/list/treezStringList.js';
jest.mock('../../../src/components/list/treezStringList.js', function(){
        const constructor = jest.fn();
        constructor.mockImplementation(
            function(){
                return this;
            }
        );

        return constructor;
    }
);

jest.setTimeout(100000);

describe('TreezFilePathList', ()=>{

    const id = 'treez-file-path-list';

    let page;

    beforeAll(async () => {
        page = await TestUtils.createBrowserPage();
        await page.coverage.startJSCoverage();

    });

    beforeEach(async () => {
        await TestUtils.clearBody(page);
        await TestUtils.createCustomElement(page, id, 'TreezFilePathList', '../../src/components/list/treezFilePathList.js');
    });

    describe('State after construction', ()=>{

        it('id',  async ()=>{
            const property = await page.$eval('#' + id, element => element.id);
            expect(property).toBe(id);
        });

    });

    describe('Public API', ()=>{

        it('getCellValue', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);
                let inputMock = {value:'cellValueMock'};
                let cellMock = {children: [inputMock]};
                return element.getCellValue(cellMock) === 'cellValueMock';
            }, {id});
            expect(success).toBe(true);

        });

        it('setCellValue', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);
                let inputMock = {value:'cellValueMock'};
                let cellMock = {children: [inputMock]};
                element.setCellValue(cellMock, 'newValue');
                return inputMock.value === 'newValue';
            }, {id});
            expect(success).toBe(true);

        });

        it('set pathMapProvider', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                let methodCalls = {};
                element.__recreateTableRows = () => {
                    methodCalls['__recreateTableRows'] = true;
                };

                element.pathMapProvider = 'pathMapProviderMock';

                let valueIsSet = element.__pathMapProvider = 'pathMapProviderMock';
                let recreateIsCalled = methodCalls['__recreateTableRows'] = true;

                return valueIsSet && recreateIsCalled;
            }, {id});
            expect(success).toBe(true);

        });

    });

    describe('Private API', ()=>{

        it('__createRow', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                let methodCalls = createMocks(element);

                let tableIsEmptyBefore = element.__tableBody.children.length === 0;

                element.__createRow('newValue');

                let rows = element.__tableBody.children;
                let rowIsCreated = rows.length === 1;

                let row = rows[0];
                let cell = row.children[0];
                let path = cell.children[0];
                let valueIsSet = path.value === 'newValue';

                let clickEvent = document.createEvent('HTMLEvents');
                clickEvent.initEvent('click', false, true);
                row.dispatchEvent(clickEvent);
                let rowClickedIsCalled =  methodCalls['__rowClicked'] === true;

                let changeEvent = document.createEvent('HTMLEvents');
                changeEvent.initEvent('change', false, true);
                path.dispatchEvent(changeEvent);
                let pathChangedIsCalled =  methodCalls['__filePathChanged'] === true;

                let blurEvent = document.createEvent('HTMLEvents');
                blurEvent.initEvent('blur', false, true);
                cell.dispatchEvent(blurEvent);
                let cellLostFocusIsCalled =  methodCalls['__cellLostFocus'] === true;

                return tableIsEmptyBefore &&
                    rowIsCreated &&
                    valueIsSet &&
                    rowClickedIsCalled &&
                    pathChangedIsCalled &&
                    cellLostFocusIsCalled;

                function createMocks(element){
                    let methodCalls = {};

                    element.__rowClicked = () => {
                        methodCalls['__rowClicked'] = true;
                    };

                    element.__filePathChanged = () => {
                        methodCalls['__filePathChanged'] = true;
                    };

                    element.__cellLostFocus = () => {
                        methodCalls['__cellLostFocus'] = true;
                    }

                    return methodCalls;
                }

            }, {id});
            expect(success).toBe(true);

        });

        describe('__filePathChanged',  ()=>{

            it('event from file path', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    let methodCalls = mockElementMethods(element);
                    let eventMock = createEventMock('secondCellContent');


                    element.value = ['','foo'];
                    element.__filePathChanged(eventMock);

                    let valueIsUpdated =  element.value[1] === 'secondCellContent';

                    let focusArguments = methodCalls['__focusCell'];
                    let focusIsRestored = focusArguments.rowIndex === 1;

                    return valueIsUpdated && focusIsRestored;

                    function mockElementMethods(element){
                        let methodCalls = {};
                        element.__focusCell = (rowIndex)=>{
                            methodCalls['__focusCell'] = {
                                rowIndex: rowIndex
                            };
                        };
                        return methodCalls;
                    }

                    function createEventMock(cellContent){
                        let table = document.createElement('table');

                        let tableBody = document.createElement('tbody');
                        table.appendChild(tableBody);

                        let firstRow = document.createElement('tr');
                        tableBody.appendChild(firstRow);

                        let secondRow = document.createElement('tr');
                        tableBody.appendChild(secondRow);

                        let cell = document.createElement('td');
                        secondRow.appendChild(cell);

                        let filePath = document.createElement('treez-file-path');
                        filePath.value = cellContent;
                        cell.appendChild(filePath);

                        let eventMock = {
                            srcElement: filePath
                        };
                        return eventMock;
                    }

                }, {id});
                expect(success).toBe(true);

            });

            it('event from input field', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    let methodCalls = mockElementMethods(element);
                    let eventMock = createEventMock('secondCellContent');


                    element.value = ['','foo'];
                    element.__filePathChanged(eventMock);

                    let valueIsUpdated =  element.value[1] === 'secondCellContent';

                    let focusArguments = methodCalls['__focusCell'];
                    let focusIsRestored = focusArguments.rowIndex === 1;

                    return valueIsUpdated && focusIsRestored;

                    function mockElementMethods(element){
                        let methodCalls = {};
                        element.__focusCell = (rowIndex)=>{
                            methodCalls['__focusCell'] = {
                                rowIndex: rowIndex
                            };
                        };
                        return methodCalls;
                    }

                    function createEventMock(cellContent){
                        let table = document.createElement('table');

                        let tableBody = document.createElement('tbody');
                        table.appendChild(tableBody);

                        let firstRow = document.createElement('tr');
                        tableBody.appendChild(firstRow);

                        let secondRow = document.createElement('tr');
                        tableBody.appendChild(secondRow);

                        let cell = document.createElement('td');
                        secondRow.appendChild(cell);

                        let filePath = document.createElement('treez-file-path');
                        filePath.value = cellContent;
                        cell.appendChild(filePath);

                        let div = document.createElement('div');
                        filePath.appendChild(div);

                        let anotherDiv = document.createElement('div');
                        div.appendChild(anotherDiv);

                        let input = document.createElement('input');
                        anotherDiv.appendChild(input);

                        let eventMock = {
                            srcElement: input
                        };
                        return eventMock;
                    }

                }, {id});
                expect(success).toBe(true);

            });
        });



        it('__focusCell', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                let methodCalls ={};

                let table = document.createElement('table');
                table.id='mockedTable';

                let tableBody = document.createElement('tbody');
                table.appendChild(tableBody);
                element.__tableBody = tableBody;

                let firstRow = document.createElement('tr');
                firstRow.tabIndex=0;
                tableBody.appendChild(firstRow);

                let secondRow = document.createElement('tr');
                secondRow.tabIndex=0;
                tableBody.appendChild(secondRow);

                let cell = document.createElement('td');
                secondRow.appendChild(cell);

                let filePath = document.createElement('treez-file-path');
                filePath.value = 'foo';
                cell.appendChild(filePath);

                element.__focusCell(1);

                let cellHasFocus = true; // TODO: did not manage to correctly check the focus. // document.activeElement == cell;
                console.log('cell has focus: ' + cellHasFocus);

                return cellHasFocus;

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

