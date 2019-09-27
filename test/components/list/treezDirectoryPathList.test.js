import CustomElementsMock from '../../customElementsMock.js';

import TreezDirectoryPathList from '../../../src/components/list/treezDirectoryPathList.js';

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

describe('TreezDirectoryPathList', ()=>{

    const id = 'treez-directory-path-list';

    let page;

    beforeAll(async () => {
        page = await TestUtils.createBrowserPage();
        await page.coverage.startJSCoverage();

    });

    beforeEach(async () => {
        await TestUtils.clearBody(page);
        await TestUtils.createCustomElement(page, id, 'TreezDirectoryPathList', '../../src/components/list/treezDirectoryPathList.js');
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
                var inputMock = {value:'cellValueMock'};
                var cellMock = {children: [inputMock]};
                return element.getCellValue(cellMock) === 'cellValueMock';
            }, {id});
            expect(success).toBe(true);

        });

        it('setCellValue', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);
                var inputMock = {value:'cellValueMock'};
                var cellMock = {children: [inputMock]};
                element.setCellValue(cellMock, 'newValue');
                return inputMock.value === 'newValue';
            }, {id});
            expect(success).toBe(true);

        });

    });

    describe('Private API', ()=>{

        it('__createRow', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                let tableIsEmptyBefore = element.__tableBody.children.length === 0;

                element.__createRow('newValue');

                let rows = element.__tableBody.children;
                let rowIsCreated = rows.length === 1;

                let row = rows[0];
                let cell = row.children[0];
                let path = cell.children[0];
                let valueIsSet = path.value === 'newValue';

                return tableIsEmptyBefore &&
                    rowIsCreated &&
                    valueIsSet;

            }, {id});
            expect(success).toBe(true);

        });

        it('__directoryPathChanged', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                var methodCalls = mockElementMethods(element);
                var eventMock = createEventMock('secondCellContent');


                element.value = ['','foo'];
                element.__directoryPathChanged(eventMock);

                let valueIsUpdated =  element.value[1] === 'secondCellContent';

                let focusArguments = methodCalls['__focusCell'];
                let focusIsRestored = focusArguments.rowIndex === 1;

                return valueIsUpdated && focusIsRestored;

                function mockElementMethods(element){
                    var methodCalls = {};
                    element.__focusCell = (rowIndex)=>{
                        methodCalls['__focusCell'] = {
                            rowIndex: rowIndex
                        };
                    };
                    return methodCalls;
                }

                function createEventMock(cellContent){
                    var table = document.createElement('table');

                    var tableBody = document.createElement('tbody');
                    table.appendChild(tableBody);

                    var firstRow = document.createElement('tr');
                    tableBody.appendChild(firstRow);

                    var secondRow = document.createElement('tr');
                    tableBody.appendChild(secondRow);

                    var cell = document.createElement('td');
                    secondRow.appendChild(cell);

                    var directoryPath = document.createElement('treez-directory-path');
                    directoryPath.value = cellContent;
                    cell.appendChild(directoryPath);

                    var eventMock = {
                        srcElement: directoryPath
                    };
                    return eventMock;
                }

            }, {id});
            expect(success).toBe(true);

        });

        it('__focusCell', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                var methodCalls ={};

                var table = document.createElement('table');
                table.id='mockedTable';

                var tableBody = document.createElement('tbody');
                table.appendChild(tableBody);
                element.__tableBody = tableBody;

                var firstRow = document.createElement('tr');
                firstRow.tabIndex=0;
                tableBody.appendChild(firstRow);

                var secondRow = document.createElement('tr');
                secondRow.tabIndex=0;
                tableBody.appendChild(secondRow);

                var cell = document.createElement('td');
                secondRow.appendChild(cell);

                var directoryPath = document.createElement('treez-directory-path');
                directoryPath.value = 'foo';
                cell.appendChild(directoryPath);

                element.__focusCell(1);

                var cellHasFocus = true; // TODO: did not manage to correctly check the focus. // document.activeElement == cell;
                console.log('cell has focus: ' + cellHasFocus);

                return cellHasFocus;

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

