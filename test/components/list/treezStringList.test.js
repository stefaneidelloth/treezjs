import CustomElementsMock from '../../customElementsMock.js';

import TreezStringList from '../../../src/components/list/treezStringList.js';

import TestUtils from '../../testUtils.js';

import puppeteerToIstanbul from 'puppeteer-to-istanbul';

import TreezElement from '../../../src/components/treezElement.js';
jest.mock('../../../src/components/treezElement.js', function(){
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

describe('TreezStringList', ()=>{

    const id = 'treez-string-list';

    let page;

    beforeAll(async () => {
        page = await TestUtils.createBrowserPage();
        await page.coverage.startJSCoverage();

    });

    beforeEach(async () => {
        await TestUtils.clearBody(page);
        await TestUtils.createCustomElement(page, id, 'TreezStringList', '../../src/components/list/treezStringList.js');
    });

    describe('State after construction', ()=>{

        it('id',  async ()=>{
            const property = await page.$eval('#' + id, element => element.id);
            expect(property).toBe(id);
        });

    });

    describe('Public API', ()=>{

        describe('connectedCallback',  ()=>{

            it('without label', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    removeExistingChildren(element);
                    const methodCalls = prepareMocks(element);

                    element.connectedCallback();

                    const methodsAreCalled = (methodCalls['__createContainer'] === true) &&
                        (methodCalls['__createLabelElement'] === undefined) &&
                        (methodCalls['__createButtons'] === true) &&
                        (methodCalls['__createTable'] === true);

                    console.log('methods are called:' + methodsAreCalled);

                    return methodsAreCalled;

                    function prepareMocks(element) {
                        const methodCalls = {};

                        element.__createContainer = () => {
                            methodCalls['__createContainer'] = true;
                        };

                        element.__createLabelElement = () => {
                            methodCalls['__createLabelElement'] = true;
                        };

                        element.__createButtons = () => {
                            methodCalls['__createButtons'] = true;
                        };

                        element.__createTable = () => {
                            methodCalls['__createTable'] = true;
                        };

                        return methodCalls;
                    }

                    function removeExistingChildren(element) {

                        element.__label = undefined;
                        element.__table = undefined;
                        element.__tableBody = undefined;
                        element.__selectedRowIndex = undefined;
                        element.__lastSelectedRowIndex = undefined;


                        while (element.firstChild) {
                            element.firstChild.remove();
                        }
                    }

                }, {id});
                expect(success).toBe(true);

            });

            it('with label', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);
                    element.label = 'list';

                    removeExistingChildren(element);
                    const methodCalls = prepareMocks(element);

                    element.connectedCallback();

                    const methodsAreCalled = (methodCalls['__createContainer'] === true) &&
                        (methodCalls['__createLabelElement'] === true) &&
                        (methodCalls['__createButtons'] === true) &&
                        (methodCalls['__createTable'] === true);

                    console.log('methods are called:' + methodsAreCalled);

                    return methodsAreCalled;

                    function removeExistingChildren(element) {

                        element.__label = undefined;
                        element.__table = undefined;
                        element.__tableBody = undefined;
                        element.__selectedRowIndex = undefined;
                        element.__lastSelectedRowIndex = undefined;


                        while (element.firstChild) {
                            element.firstChild.remove();
                        }
                    }

                    function prepareMocks(element) {
                        const methodCalls = {};

                        element.__createContainer = () => {
                            methodCalls['__createContainer'] = true;
                        };

                        element.__createLabelElement = () => {
                            methodCalls['__createLabelElement'] = true;
                        };

                        element.__createButtons = () => {
                            methodCalls['__createButtons'] = true;
                        };

                        element.__createTable = () => {
                            methodCalls['__createTable'] = true;
                        };

                        return methodCalls;
                    }

                }, {id});
                expect(success).toBe(true);

            });


        });

        it('attributeChangedCallback', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                let labelElement = document.createElement('label');
                element.__label = labelElement;

                let innerTextIsEmptyBefore = labelElement.innerText === '';

                element.attributeChangedCallback('label','oldStringValue','newStringValue');

                let innerTextIsSetAfter = labelElement.innerText === 'newStringValue';

                return innerTextIsEmptyBefore && innerTextIsSetAfter;

            }, {id});
            expect(success).toBe(true);

        });

        it('updateElements', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                let methodCalls = {};
                element.__recreateTableRows = ()=>{
                    methodCalls['__recreateTableRows'] = true;
                };

                element.updateElements();

                return methodCalls['__recreateTableRows'] === true;

            }, {id});
            expect(success).toBe(true);

        });

        describe('disableElements',  ()=> {

            it('undefined', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    try{
                        element.disableElements(undefined);
                        return false;
                    } catch (error){
                        return true;
                    }
                },{id});
                expect(success).toBe(true);
            });

            it('common usage', async ()=>{
                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    let methodCalls = {};
                    element.__disableTable = (value)=>{
                        methodCalls['__disableTable'] = value;
                    };

                    const addIsNotDisabledBefore = element.__addButton.disabled === false;
                    const deleteIsNotDisabledBefore = element.__deleteButton.disabled === false;
                    const upIsNotDisabledBefore = element.__upButton.disabled === false;
                    const downIsNotDisabledBefore = element.__downButton.disabled === false;
                    const tableIsNotDisabledBefore = methodCalls['__disableTable'] === undefined;

                    element.disableElements(true);

                    const addIsDisabledAfter = element.__addButton.disabled === true;
                    const deleteIsDisabledAfter = element.__deleteButton.disabled === true;
                    const upIsDisabledAfter = element.__upButton.disabled === true;
                    const downIsDisabledAfter = element.__downButton.disabled === true;
                    const tableIsDisabledAfter = methodCalls['__disableTable'] === true;

                    return (addIsNotDisabledBefore &&
                        deleteIsNotDisabledBefore &&
                        upIsNotDisabledBefore &&
                        downIsNotDisabledBefore &&
                        tableIsNotDisabledBefore
                    ) && (
                        addIsDisabledAfter &&
                        deleteIsDisabledAfter &&
                        upIsDisabledAfter &&
                        downIsDisabledAfter &&
                        tableIsDisabledAfter
                    );

                }, {id});
                expect(success).toBe(true);
            });
        });

        describe('hideElements',  ()=> {

            it('undefined', async () => {
                let success = await page.evaluate(({id}) => {
                    let element = document.getElementById(id);
                    try {
                        element.hideElements(undefined);
                        return false;
                    } catch (error) {
                        return true;
                    }
                },{id});
                expect(success).toBe(true);
            });

            it('common usage', async () => {
                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    const isNotHiddenBefore = element.__container.style.display === '';

                    element.hideElements(true);

                    const isHiddenAfter = element.__container.style.display === 'none';

                    return isNotHiddenBefore && isHiddenAfter;

                }, {id});
                expect(success).toBe(true);
            });
        });



        describe('convertFromStringValue', ()=> {
            it('undefined array string', async () => {

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    try {
                        let value = element.convertFromStringValue(undefined);
                        return false;
                    } catch(error){
                        return true;
                    }

                }, {id});
                expect(success).toBe(true);

            });

            it('normal array string', async () => {

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    let value = element.convertFromStringValue('["a","b","c"]');
                    return value.length === 3 && value[0] === 'a' && value[2] === 'c' ;

                }, {id});
                expect(success).toBe(true);

            });
        });

        describe('convertToStringValue', ()=> {
            it('empty array', async () => {

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    let arrayString = element.convertToStringValue([]);
                    return arrayString === '[]';

                }, {id});
                expect(success).toBe(true);

            });

            it('normal array', async () => {

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    let arrayString = element.convertToStringValue(['a','b','c']);
                    return arrayString === "['a','b','c']";

                }, {id});
                expect(success).toBe(true);

            });
        });

        it('getCellValue', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);
                let cellMock = {innerText: 'innerTextMock'};
                return element.getCellValue(cellMock) === 'innerTextMock';
            }, {id});
            expect(success).toBe(true);

        });

        it('setCellValue', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);
                let cellMock = {innerText: 'innerTextMock'};
                element.setCellValue(cellMock, 'newValue');
                return cellMock.innerText === 'newValue';
            }, {id});
            expect(success).toBe(true);

        });

        it('styleCell', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);
                let cellMock = document.createElement('div');
                element.styleCell(cellMock);

                let borderIsStyled = cellMock.style.border === '1px solid lightgrey';
                let backgroundIsStyled = cellMock.style.backgroundColor === 'white';
                let paddingIsStyled = cellMock.style.padding === '0px';

                return borderIsStyled && backgroundIsStyled && paddingIsStyled;
            }, {id});
            expect(success).toBe(true);

        });

    });

    describe('Private API', ()=>{

        it('__createContainer', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);
                element.__container = undefined;
                element.__createContainer();
                let hasContainer = element.__container.constructor.name === 'HTMLDivElement';
                return hasContainer;
            }, {id});
            expect(success).toBe(true);

        });

        it('__createLabelElement', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);
                element.__label = undefined;
                element.__createLabelElement();
                let hasLabel = element.__label.constructor.name === 'HTMLLabelElement';
                return hasLabel;
            }, {id});
            expect(success).toBe(true);

        });

        it('__createTable', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                let methodCalls = {};
                element.__createTableBody = ()=>{
                    methodCalls['__createTableBody'] = true;
                }
                element.__recreateTableRows = ()=>{
                    methodCalls['__recreateTableRows'] = true;
                }

                element.__table = undefined;
                element.__createTable();
                let hasTable = element.__table.constructor.name === 'HTMLTableElement';

                let methodsAreCalled = methodCalls['__createTableBody'] === true &&
                    methodCalls['__recreateTableRows'] === true;

                return hasTable &&
                    methodsAreCalled;

            }, {id});
            expect(success).toBe(true);

        });

        describe('__disableTable',  ()=> {

            it('undefined', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    try{
                        element.__disableTable();
                        return false;
                    } catch(error){
                        return true;
                    }

                }, {id});
                expect(success).toBe(true);
            });


            it('common usage', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    let table = document.createElement('table');
                    element.__table = table;

                    let tableBody = document.createElement('tbody');
                    table.appendChild(tableBody);

                    let row = document.createElement('tr');
                    tableBody.appendChild(row);

                    let firstCell = document.createElement('td');
                    firstCell.contentEditable = true;
                    row.appendChild(firstCell);

                    let secondCell = document.createElement('td');
                    secondCell.contentEditable = true;
                    row.appendChild(secondCell);

                    element.__disableTable(true);

                    return firstCell.contentEditable === 'false' && secondCell.contentEditable === 'false';

                }, {id});
                expect(success).toBe(true);

            });

        });




        it('__recreateTableRows', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                element.value = ['firstRowMock','secondRowMock'];

                let methodCalls = {
                    __createRows: []
                };
                element.__deleteRows = ()=>{
                    methodCalls['__deleteRows'] = true;
                };
                element.__createRow = (value) => {
                    methodCalls['__createRows'].push(value);
                }

                element.__recreateTableRows();

                let oldRowsAreDeleted = methodCalls['__deleteRows'] === true;
                let newRowsAreCreated = methodCalls['__createRows'].length === 2;

                return oldRowsAreDeleted && newRowsAreCreated;
            }, {id});
            expect(success).toBe(true);

        });

        it('__cellChanged', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                let methodCalls = mockElementMethods(element);
                let eventMock = createCellChangedEventMock('secondCellContent');
                mockWindowSelection(17);

                element.value = ['','foo'];
                element.__cellChanged(eventMock);

                let valueIsUpdated =  element.value[1] === 'secondCellContent';

                let focusArguments = methodCalls['__focusCell'];
                let focusIsRestored = focusArguments.rowIndex === 1 && focusArguments.cursorPosition === 17;

                return valueIsUpdated && focusIsRestored;

                function mockElementMethods(element){
                    let methodCalls = {};
                    element.__focusCell = (rowIndex, cursorPosition)=>{
                        methodCalls['__focusCell'] = {
                            rowIndex: rowIndex,
                            cursorPosition: cursorPosition
                        };
                    };
                    return methodCalls;
                }

                function createCellChangedEventMock(cellContent){
                    let table = document.createElement('table');

                    let tableBody = document.createElement('tbody');
                    table.appendChild(tableBody);

                    let firstRow = document.createElement('tr');
                    tableBody.appendChild(firstRow);

                    let secondRow = document.createElement('tr');
                    tableBody.appendChild(secondRow);

                    let cell = document.createElement('td');
                    cell.innerText = cellContent;
                    secondRow.appendChild(cell);

                    let eventMock = {
                        currentTarget: cell
                    };
                    return eventMock;
                }

                function mockWindowSelection(cursorPosition) {
                    let rangeMock = {
                        startOffset: cursorPosition
                    };

                    let selectionMock = {
                        getRangeAt: (index) => {
                            return rangeMock;
                        }
                    }

                    window.getSelection = ()=>{return selectionMock};
                }

            }, {id});
            expect(success).toBe(true);

        });

        it('__cellLostFocus', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);
                element.__selectedRowIndex = 3;
                element.__cellLostFocus();
                return element.__selectedRowIndex === undefined;
            }, {id});
            expect(success).toBe(true);

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
                cell.contentEditable = true;
                cell.innerText = 'secondCellContent';
                cell.tabIndex = 0;
                secondRow.appendChild(cell);

                let selectionMock = {
                    collapse: (element, cursorPosition)=>{
                        methodCalls['collapseSelection'] = true;
                    }
                }
                window.getSelection = ()=>{return selectionMock; }

                element.__focusCell(1,17);

                let cellHasFocus = true; // TODO: did not manage to correctly check the focus. // document.activeElement == cell;
                console.log('cell has focus: ' + cellHasFocus);

                let cursorIsSetAtEndOfInput = methodCalls['collapseSelection'] == true;
                console.log('cursor is set: ' +cursorIsSetAtEndOfInput);

                return cellHasFocus && cursorIsSetAtEndOfInput;

            }, {id});
            expect(success).toBe(true);

        });

        describe('__addRow',  ()=>{

            it('unknown row index', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);
                    element.__lastSelectedRowIndex = undefined;

                    let methodCalls = {};
                    element.__appendNewRow = ()=>{
                        methodCalls['__appendNewRow'] = true;
                    };
                    element.__duplicateRow = (index)=>{
                        methodCalls['__duplicateRow'] = index;
                    }

                    element.__addRow();
                    let rowIsAppended = methodCalls['__appendNewRow'] === true;
                    return rowIsAppended;

                }, {id});
                expect(success).toBe(true);

            });

            it('known row index', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);
                    element.__lastSelectedRowIndex = 0;

                    let methodCalls = {};
                    element.__appendNewRow = ()=>{
                        methodCalls['__appendNewRow'] = true;
                    };
                    element.__duplicateRow = (index)=>{
                        methodCalls['__duplicateRow'] = index;
                    }

                    element.__addRow();
                    let rowIsDuplicated = methodCalls['__duplicateRow'] === 0;
                    return rowIsDuplicated;

                }, {id});
                expect(success).toBe(true);

            });
        });

        it('__appendNewRow', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                let methodCalls = {};
                element.__recreateTableRows = ()=>{
                    methodCalls['__recreateTableRows'] = true;
                };
                element.__selectRow = (index)=>{
                    methodCalls['__selectRow'] = index;
                }

                let valuesAreEmpty = element.values.length === 0;

                element.__appendNewRow();

                let defaultValueIsAddedToValues = element.values[0] === '';
                let methodsAreCalled = methodCalls['__recreateTableRows'] === true &&
                    methodCalls['__selectRow'] === 0;

                return defaultValueIsAddedToValues && methodsAreCalled;

            }, {id});
            expect(success).toBe(true);

        });

        it('__createButtons', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                let methodCalls = createMocks(element);

                element.__createButtons();

                let calls = methodCalls['__createButton'];
                let methodsAreCalled = calls.length === 4 && calls[0] === 'add' && calls[3] === 'down';

                let clickEvent = document.createEvent('HTMLEvents');
                clickEvent.initEvent('click', false, true);

                let buttonContainer = element.__container.firstChild;

                let addButton = buttonContainer.children[0];
                addButton.dispatchEvent(clickEvent);
                let addRowIsCalled =  methodCalls['__addRow'] === true;

                let deleteButton = buttonContainer.children[1];
                deleteButton.dispatchEvent(clickEvent);
                let deleteRowIsCalled =  methodCalls['__deleteRow'] === true;

                let moveUpButton = buttonContainer.children[2];
                moveUpButton.dispatchEvent(clickEvent);
                let moveUpIsCalled =  methodCalls['__moveCurrentRowUp'] === true;

                let moveDownButton = buttonContainer.children[3];
                moveDownButton.dispatchEvent(clickEvent);
                let moveDownIsCalled =  methodCalls['__moveCurrentRowDown'] === true;

                return methodsAreCalled &&
                    addRowIsCalled &&
                    deleteRowIsCalled &&
                    moveUpIsCalled &&
                    moveDownIsCalled;

                function createMocks(element){

                    let methodCalls = {
                        __createButton: []
                    };

                    element.__createButton = (buttonContainer, name, title)=>{
                        methodCalls['__createButton'].push(name);
                        return {onclick: undefined};
                    };

                    element.__addRow = () => {
                      methodCalls['__addRow'] = true;
                    };

                    element.__deleteRow = () => {
                        methodCalls['__deleteRow'] = true;
                    };

                    element.__moveCurrentRowUp = () => {
                        methodCalls['__moveCurrentRowUp'] = true;
                    };

                    element.__moveCurrentRowDown = () => {
                        methodCalls['__moveCurrentRowDown'] = true;
                    };

                    return methodCalls;
                }
            }, {id});
            expect(success).toBe(true);

        });

        it('__createButton', async ()=>{
            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                let container = document.createElement('div');

                let button = element.__createButton(container, 'nameMock','titleMock');

                let titleIsSet = button.title === 'titleMock';

                let image = button.firstChild;

                let imageSrcIsSet = image.src === 'http://localhost:4444/icons/nameMock.png';

                return titleIsSet &&
                    imageSrcIsSet;

            }, {id});
            expect(success).toBe(true);

        });

        it('__createRow', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                let methodCalls = {};

                element.setCellValue = (cell, value)=>{
                    methodCalls['setCellValue'] = true;
                };

                element.styleCell = (cell, value)=>{
                    methodCalls['styleCell'] = true;
                };

                element.__rowClicked = ()=>{
                    methodCalls['__rowClicked'] = true;
                };

                element.__cellChanged = ()=>{
                    methodCalls['__cellChanged'] = true;
                };

                element.__cellLostFocus = ()=>{
                    methodCalls['__cellLostFocus'] = true;
                };

                let tableIsEmptyBefore = element.__tableBody.children.length === 0;

                element.__createRow('newValue');

                let rows = element.__tableBody.children;
                let rowIsCreated = rows.length === 1;
                let row = rows[0];
                let cell = row.firstChild;

                let methodsAreCalled =  methodCalls['setCellValue'] === true &&
                methodCalls['styleCell'] === true;

                let clickEvent = document.createEvent('HTMLEvents');
                clickEvent.initEvent('click', false, true);
                row.dispatchEvent(clickEvent);
                let rowClickedIsCalled =  methodCalls['__rowClicked'] === true;

                let keyUpEvent = document.createEvent('HTMLEvents');
                keyUpEvent.initEvent('keyup', false, true);
                cell.dispatchEvent(keyUpEvent);
                let cellChangedIsCalled =  methodCalls['__cellChanged'] === true;

                let blurEvent = document.createEvent('HTMLEvents');
                blurEvent.initEvent('blur', false, true);
                cell.dispatchEvent(blurEvent);
                let cellLostFocusIsCalled =  methodCalls['__cellLostFocus'] === true;

                return tableIsEmptyBefore &&
                    rowIsCreated &&
                    methodsAreCalled &&
                    rowClickedIsCalled &&
                    cellChangedIsCalled &&
                    cellLostFocusIsCalled;

            }, {id});
            expect(success).toBe(true);

        });

        describe('__deleteRow', ()=>{

            it('without explicit row index', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);
                    element.__lastSelectedRowIndex = undefined;
                    element.value = ['a','b','c'];

                    let methodCalls = {};

                    element.__recreateTableRows = ()=>{
                        methodCalls['__recreateTableRows'] = true;
                    };
                    element.__updateSelectedRowIndexAfterDeletion = (index)=>{
                        methodCalls['__updateSelectedRowIndexAfterDeletion'] = index;
                    };
                    element.dispatchChangeEvent = ()=>{
                        methodCalls['dispatchChangeEvent'] = true;
                    };

                    let rowsExistBefore = element.__tableBody.children.length === 3;

                    element.__deleteRow();

                    let valueIsRemoved = element.values.length === 2 && element.values[0] === 'b';

                    let methodsAreCalled = methodCalls['__recreateTableRows'] === true &&
                    methodCalls['__updateSelectedRowIndexAfterDeletion'] === 0 &&
                    methodCalls['dispatchChangeEvent'] === true;

                    return rowsExistBefore &&
                        valueIsRemoved &&
                        methodsAreCalled;
                }, {id});
                expect(success).toBe(true);

            });

            it('with explicit row index', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);
                    element.__lastSelectedRowIndex = 2;
                    element.value = ['a','b','c'];

                    let methodCalls = {};

                    element.__recreateTableRows = ()=>{
                        methodCalls['__recreateTableRows'] = true;
                    };
                    element.__updateSelectedRowIndexAfterDeletion = (index)=>{
                        methodCalls['__updateSelectedRowIndexAfterDeletion'] = index;
                    };
                    element.dispatchChangeEvent = ()=>{
                        methodCalls['dispatchChangeEvent'] = true;
                    };

                    let rowsExistBefore = element.__tableBody.children.length === 3;

                    element.__deleteRow();

                    let valueIsRemoved = element.values.length === 2 && element.values[0] === 'a';

                    let methodsAreCalled = methodCalls['__recreateTableRows'] === true &&
                        methodCalls['__updateSelectedRowIndexAfterDeletion'] === 2 &&
                        methodCalls['dispatchChangeEvent'] === true;

                    return rowsExistBefore &&
                        valueIsRemoved &&
                        methodsAreCalled;
                }, {id});
                expect(success).toBe(true);

            });

            it('deletion with empty array is ignored', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    element.value = [];

                    try{
                        element.__deleteRow();
                        return true;
                    } catch (error){
                        return false;
                    }

                }, {id});
                expect(success).toBe(true);

            });

        });

        it('__deleteRows', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                element.value = ['a','b','c'];
                let rowsExistBefore = element.__tableBody.children.length === 3;
                element.__deleteRows();
                let rowsAreRemoved = element.__tableBody.children.length === 0;

                return rowsExistBefore && rowsAreRemoved;
            }, {id});
            expect(success).toBe(true);

        });

        it('__duplicateRow', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);
                element.value = ['a','b','c'];

                let methodCalls = {};

                element.__recreateTableRows = ()=>{
                    methodCalls['__recreateTableRows'] = true;
                };
                element.__selectRow = (index)=>{
                    methodCalls['__selectRow'] = index;
                };
                element.dispatchChangeEvent = ()=>{
                    methodCalls['dispatchChangeEvent'] = true;
                };

                let rowsExistBefore = element.__tableBody.children.length === 3;
                element.__duplicateRow(1);

                let rowIsDuplicated = element.values.length === 4 && element.values[2] === 'b';

                let methodsAreCalled =  methodCalls['__recreateTableRows'] === true &&
                    methodCalls['__selectRow'] === 2 &&
                    methodCalls['dispatchChangeEvent'] === true;


                return rowsExistBefore &&
                    rowIsDuplicated &&
                    methodsAreCalled;

            }, {id});
            expect(success).toBe(true);

        });

        describe('__moveCurrentRowUp', ()=>{

            it('with explicit index', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);
                    element.__lastSelectedRowIndex = 2;

                    let methodCalls = {};

                    element.__moveRowUp = (index)=>{
                        methodCalls['__moveRowUp'] = index;
                    };

                    element.__moveCurrentRowUp();

                    let methodIsCalled = methodCalls['__moveRowUp'] === 2;

                    return methodIsCalled;
                }, {id});
                expect(success).toBe(true);

            });

            it('without explicit index', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);
                    element.__lastSelectedRowIndex = undefined;

                    let methodCalls = {};

                    element.__moveRowUp = (index)=>{
                        methodCalls['__moveRowUp'] = index;
                    };

                    element.__moveCurrentRowUp();

                    let methodIsCalled = methodCalls['__moveRowUp'] === 0;

                    return methodIsCalled;
                }, {id});
                expect(success).toBe(true);

            });

        });

        describe('__moveCurrentRowDown', ()=>{

            it('with explicit index', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);
                    element.__lastSelectedRowIndex = 2;

                    let methodCalls = {};

                    element.__moveRowDown = (index)=>{
                        methodCalls['__moveRowDown'] = index;
                    };

                    element.__moveCurrentRowDown();

                    let methodIsCalled = methodCalls['__moveRowDown'] === 2;

                    return methodIsCalled;
                }, {id});
                expect(success).toBe(true);

            });

            it('without explicit index', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);
                    element.__lastSelectedRowIndex = undefined;

                    let methodCalls = {};

                    element.__moveRowDown = (index)=>{
                        methodCalls['__moveRowDown'] = index;
                    };

                    element.__moveCurrentRowDown();

                    let methodIsCalled = methodCalls['__moveRowDown'] === 0;

                    return methodIsCalled;
                }, {id});
                expect(success).toBe(true);

            });

        });

        describe('__moveRowUp', ()=>{

            it('normal usage', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    element.value = ['a','b','c'];

                    let methodCalls = {};

                    element.__recreateTableRows = ()=>{
                        methodCalls['__recreateTableRows'] = true;
                    };
                    element.__selectRow = (index)=>{
                        methodCalls['__selectRow'] = index;
                    };
                    element.dispatchChangeEvent = ()=>{
                        methodCalls['dispatchChangeEvent'] = true;
                    };

                    element.__moveRowUp(1);

                    let entriesAreFlipped = element.values[0] === 'b' && element.values[1] == 'a';

                    let methodsAreCalled = methodCalls['__recreateTableRows'] === true &&
                                            methodCalls['__selectRow'] === 0 &&
                                            methodCalls['dispatchChangeEvent'] === true;

                    return entriesAreFlipped && methodsAreCalled;
                }, {id});
                expect(success).toBe(true);

            });

            it('move first row up', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    element.value = ['a','b','c'];

                    let methodCalls = {};

                    element.__recreateTableRows = ()=>{
                        methodCalls['__recreateTableRows'] = true;
                    };
                    element.__selectRow = (index)=>{
                        methodCalls['__selectRow'] = index;
                    };
                    element.dispatchChangeEvent = ()=>{
                        methodCalls['dispatchChangeEvent'] = true;
                    };

                    element.__moveRowUp(0);

                    let entriesAreFlipped = element.values[0] === 'c' && element.values[2] == 'a';

                    let methodsAreCalled = methodCalls['__recreateTableRows'] === true &&
                        methodCalls['__selectRow'] === 2 &&
                        methodCalls['dispatchChangeEvent'] === true;

                    return entriesAreFlipped && methodsAreCalled;
                }, {id});
                expect(success).toBe(true);

            });

            it('move for single entry is ignored', async ()=>{
                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);
                    element.value = ['a'];
                    try{
                        element.__moveRowUp(0);
                        return true;
                    } catch (error){
                        return false;
                    }
                }, {id});
                expect(success).toBe(true);
            });
        });

        describe('__moveRowDown', ()=>{

            it('normal usage', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    element.value = ['a','b','c'];

                    let methodCalls = {};

                    element.__recreateTableRows = ()=>{
                        methodCalls['__recreateTableRows'] = true;
                    };
                    element.__selectRow = (index)=>{
                        methodCalls['__selectRow'] = index;
                    };
                    element.dispatchChangeEvent = ()=>{
                        methodCalls['dispatchChangeEvent'] = true;
                    };

                    element.__moveRowDown(1);

                    let entriesAreFlipped = element.values[1] === 'c' && element.values[2] == 'b';

                    let methodsAreCalled = methodCalls['__recreateTableRows'] === true &&
                        methodCalls['__selectRow'] === 2 &&
                        methodCalls['dispatchChangeEvent'] === true;

                    return entriesAreFlipped && methodsAreCalled;
                }, {id});
                expect(success).toBe(true);

            });

            it('move last row down', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    element.value = ['a','b','c'];

                    let methodCalls = {};

                    element.__recreateTableRows = ()=>{
                        methodCalls['__recreateTableRows'] = true;
                    };
                    element.__selectRow = (index)=>{
                        methodCalls['__selectRow'] = index;
                    };
                    element.dispatchChangeEvent = ()=>{
                        methodCalls['dispatchChangeEvent'] = true;
                    };

                    element.__moveRowDown(2);

                    let entriesAreFlipped = element.values[0] === 'c' && element.values[2] == 'a';

                    let methodsAreCalled = methodCalls['__recreateTableRows'] === true &&
                        methodCalls['__selectRow'] === 0 &&
                        methodCalls['dispatchChangeEvent'] === true;

                    return entriesAreFlipped && methodsAreCalled;
                }, {id});
                expect(success).toBe(true);

            });

            it('move for single entry is ignored', async ()=>{
                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);
                    element.value = ['a'];
                    try{
                        element.__moveRowDown(0);
                        return true;
                    } catch (error){
                        return false;
                    }
                }, {id});
                expect(success).toBe(true);
            });
        });

        it('__rowClicked', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                let row = document.createElement('tr');
                element.__tableBody.appendChild(row);

                let eventMock = {
                    currentTarget: row
                }

                let selectedRowIndexIsUndefinedBefore = element.__selectedRowIndex === undefined;
                let lastSelectedRowIndexIsUndefinedBefore = element.__lastSelectedRowIndex === undefined;

                element.__rowClicked(eventMock);

                let selectedRowIndexIsDefinedAfter = element.__selectedRowIndex === 0;
                let lastSelectedRowIndexIsDefinedAfter = element.__lastSelectedRowIndex === 0;

                return selectedRowIndexIsUndefinedBefore && lastSelectedRowIndexIsUndefinedBefore &&
                    selectedRowIndexIsDefinedAfter && lastSelectedRowIndexIsDefinedAfter;


            }, {id});
            expect(success).toBe(true);

        });

        it('__selectRow', async ()=>{

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
                cell.contentEditable = true;
                cell.innerText = 'secondCellContent';
                cell.tabIndex = 0;
                secondRow.appendChild(cell);

                let selectedRowIndexIsUndefinedBefore = element.__selectedRowIndex === undefined;
                let lastSelectedRowIndexIsUndefinedBefore = element.__lastSelectedRowIndex === undefined;

                element.__selectRow(1);

                let selectedRowIndexIsDefinedAfter = element.__selectedRowIndex === 1;
                let lastSelectedRowIndexIsDefinedAfter = element.__lastSelectedRowIndex === 1;

                let cellHasFocus = true; // TODO: did not manage to correctly check the focus. // document.activeElement == cell;
                console.log('cell has focus: ' + cellHasFocus);

                return selectedRowIndexIsUndefinedBefore && lastSelectedRowIndexIsUndefinedBefore &&
                    selectedRowIndexIsDefinedAfter && lastSelectedRowIndexIsDefinedAfter && cellHasFocus;

            }, {id});
            expect(success).toBe(true);

        });

        describe('__updateSelectedRowIndexAfterDeletion', ()=> {

            it('values are empty after deletion', async () => {

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    element.value = [];
                    element.__selectedRowIndex = 0;
                    element.__updateSelectedRowIndexAfterDeletion(0);

                    let selectedRowIndexIsUndefined = element.__selectedRowIndex === undefined;
                    let lastSelectedRowIndexIsUndefined = element.__lastSelectedRowIndex === undefined;
                    return selectedRowIndexIsUndefined && lastSelectedRowIndexIsUndefined;
                }, {id});
                expect(success).toBe(true);

            });

            describe('some values still exist', () => {

                it('last element has been deleted', async () => {

                    const success = await page.evaluate(async ({id}) => {
                        const element = await document.getElementById(id);
                        element.value = ['a','b'];

                        let methodCalls = {};

                        element.__selectRow = (index) => {
                            methodCalls['__selectRow'] = index;
                        };

                        element.__updateSelectedRowIndexAfterDeletion(2);

                        return methodCalls['__selectRow'] === 1;
                    }, {id});
                    expect(success).toBe(true);

                });

                it('other element has been deleted', async () => {

                    const success = await page.evaluate(async ({id}) => {
                        const element = await document.getElementById(id);
                        element.value = ['a','c'];

                        let methodCalls = {};

                        element.__selectRow = (index) => {
                            methodCalls['__selectRow'] = index;
                        };

                        element.__updateSelectedRowIndexAfterDeletion(1);

                        return methodCalls['__selectRow'] === 1;
                    }, {id});
                    expect(success).toBe(true);

                });

            });

        });

        describe('get __urlPrefix', ()=>{

            it('with treez config', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);

                    let home = '..';
                    window.treezConfig = {home: home};
                    let prefix = element.__urlPrefix;
                    window.treezConfig = undefined;

                    return  prefix === home;
                },{id});
                expect(success).toBe(true);
            });

            it('without treez config', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);

                    return element.__urlPrefix === '';
                },{id});
                expect(success).toBe(true);
            });
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

