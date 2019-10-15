import CustomElementsMock from '../../customElementsMock.js';

import TreezSection from '../../../src/components/section/treezSection.js';

import TestUtils from '../../testUtils.js';

import puppeteerToIstanbul from 'puppeteer-to-istanbul';

jest.setTimeout(100000);

describe('TreezSection', ()=>{

    const id = 'treez-section';

    let page;

    beforeAll(async () => {
        page = await TestUtils.createBrowserPage();
        await page.coverage.startJSCoverage();

    });

    beforeEach(async () => {
        await TestUtils.clearBody(page);
        await TestUtils.createCustomElement(page, id, 'TreezSection', '../../src/components/section/treezSection.js');
    });

    describe('State after construction', ()=>{

        it('id',  async ()=>{
            const property = await page.$eval('#' + id, element => element.id);
            expect(property).toBe(id);
        });

    });

    describe('Public API', ()=>{

        describe('connectedCallback',   ()=> {

            it('is initially expanded',  async ()=> {

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    removeExistingChildren(element);
                    const methodCalls = prepareMocks(element);

                    var sectionContent = document.createElement('div');
                    element.appendChild(sectionContent);

                    element.connectedCallback();

                    let header = element.__sectionHeader;
                    let headerIsCreated = header.constructor.name === 'TreezSectionHeader';
                    console.log('header is created: ' + headerIsCreated);

                    let headerIsInserted = element.firstChild === header;
                    console.log('header is inserted: ' + headerIsInserted);

                    let label = header.firstChild;
                    let labelIsCreated = label.constructor.name === 'HTMLSpanElement';
                    console.log('label is created: ' + labelIsCreated);

                    let toolbar = header.lastChild;
                    let toolbarIsCreated = toolbar.constructor.name === 'HTMLSpanElement';
                    console.log('toolbar is created: ' + toolbarIsCreated);

                    const methodsAreCalled = (methodCalls['__processSectionActions'] === true) &&
                                             (methodCalls['__toggleExpansion'] === undefined);


                    console.log('methods are called:' + methodsAreCalled);

                    return headerIsCreated &&
                        headerIsInserted &&
                        labelIsCreated &&
                        toolbarIsCreated &&
                        methodsAreCalled;

                    function prepareMocks(element) {
                        const methodCalls = {};

                        element.__processSectionActions = () => {
                            methodCalls['__processSectionActions'] = true;
                        };

                        element.__toggleExpansion = () => {
                            methodCalls['__toggleExpansion'] = true;
                        };

                        return methodCalls;
                    }

                    function removeExistingChildren(element) {

                        element.__sectionHeader = undefined;

                        while (element.firstChild) {
                            element.firstChild.remove();
                        }
                    }

                }, {id});
                expect(success).toBe(true);
            });

            it('is initially collapsed',  async ()=> {

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);
                    element.__isInitiallyExpanded = false;

                    removeExistingChildren(element);
                    const methodCalls = prepareMocks(element);

                    var sectionContent = document.createElement('div');
                    element.appendChild(sectionContent);

                    element.connectedCallback();

                    const methodsAreCalled = (methodCalls['__processSectionActions'] === true) &&
                        (methodCalls['__toggleExpansion'] === true);

                    return methodsAreCalled;

                    function prepareMocks(element) {
                        const methodCalls = {};

                        element.__processSectionActions = () => {
                            methodCalls['__processSectionActions'] = true;
                        };

                        element.__toggleExpansion = () => {
                            methodCalls['__toggleExpansion'] = true;
                        };

                        return methodCalls;
                    }

                    function removeExistingChildren(element) {

                        element.__sectionHeader = undefined;

                        while (element.firstChild) {
                            element.firstChild.remove();
                        }
                    }
                }, {id});
                expect(success).toBe(true);
            });

        });

        describe('attributeChangedCallback',  ()=>{

            it('label', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    element.attributeChangedCallback('label', 'oldValueMock','newValueMock');
                    let headerTextIsSet = element.__sectionHeader.innerText === 'newValueMock';
                    return headerTextIsSet;

                }, {id});
                expect(success).toBe(true);

            });

            it('collapsed', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    element.attributeChangedCallback('collapsed', 'oldValueMock','false');
                    let isExpandedIsSetToTrue = element.__isInitiallyExpanded === false;

                    element.attributeChangedCallback('collapsed', 'oldValueMock', null);
                    let isExpandedIsSetToFalse = element.__isInitiallyExpanded === true;

                    return isExpandedIsSetToTrue && isExpandedIsSetToFalse;

                }, {id});
                expect(success).toBe(true);

            });

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

        it('expand', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                var content = document.createElement('div');
                element.appendChild(content);

                element.__sectionContent.style.display = 'none';
                element.__sectionHeader.classList.add('collapsed');

                let contentIsNotVisibleBefore = element.__sectionContent.style.display === 'none';
                let headerIsCollapsedBefore = element.__sectionHeader.classList.contains('collapsed') === true;

                element.expand();

                let contentIsVisibleAfter = element.__sectionContent.style.display === 'block';
                let headerIsCollapsedAfter = element.__sectionHeader.classList.contains('collapsed') === false;

                return contentIsNotVisibleBefore && headerIsCollapsedBefore &&
                    contentIsVisibleAfter && headerIsCollapsedAfter;

            }, {id});
            expect(success).toBe(true);

        });

        it('collapse', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                var content = document.createElement('div');
                element.appendChild(content);

                let contentIsVisibleBefore = element.__sectionContent.style.display !== 'none';
                let headerIsNotCollapsedBefore = element.__sectionHeader.classList.contains('collapsed') === false;

                element.collapse();

                let contentIsNotVisibleAfter = element.__sectionContent.style.display === 'none';
                let headerIsCollapsedAfter = element.__sectionHeader.classList.contains('collapsed') === true;

                return contentIsVisibleBefore && headerIsNotCollapsedBefore &&
                    contentIsNotVisibleAfter && headerIsCollapsedAfter;

            }, {id});
            expect(success).toBe(true);

        });

    });

    describe('Private API', ()=>{

        it('__toggleExpansion', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                let methodCalls = {};
                element.expand = ()=>{
                    methodCalls['expand'] = true;
                };
                element.collapse = ()=>{
                    methodCalls['collapse'] = true;
                };

                let isExpandedBefore = element.isCollapsed === false;
                element.__toggleExpansion();
                let isCollapsedAfter =  methodCalls['collapse'] === true && methodCalls['expand'] === undefined;;

                element.__sectionHeader.classList.add('collapsed');
                element.__toggleExpansion();
                let isExpandedAfterTwoToggles = methodCalls['expand'] === true;

                return isExpandedBefore && isCollapsedAfter && isExpandedAfterTwoToggles;

            }, {id});
            expect(success).toBe(true);

        });

        it('__processSectionActions', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                let methodCalls = {};
                element.__processSectionAction = () => {
                    methodCalls['__processSectionAction'] = true;
                };

                let action = document.createElement('treez-section-action');
                element.appendChild(action);

                element.__processSectionActions('toolbarMock');

                let methodIsCalled = methodCalls['__processSectionAction'] === true;

                return methodIsCalled;

            }, {id});
            expect(success).toBe(true);

        });


        describe('__processSectionAction', ()=>{

            it('with image', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    let methodCalls = [];

                    let toolbarMock = document.createElement('div');

                    let sectionAction = document.createElement('treez-section-action');
                    sectionAction.image = 'add.png';
                    sectionAction.label = 'myLabel';
                    sectionAction.addAction(()=>{ methodCalls['firstAction'] = true;});
                    sectionAction.addAction(()=>{ methodCalls['secondAction'] = true;});

                    element.__processSectionAction(sectionAction, toolbarMock);

                    let image = toolbarMock.firstChild;
                    let imageIsCreated = image.constructor.name === 'HTMLImageElement';
                    let srcIsSet = image.src === 'http://localhost:4444/icons/add.png';
                    let titleIsSet = image.title === 'myLabel';

                    image.click();

                    let methodsAreCalled = methodCalls['firstAction'] === true &&
                                            methodCalls['secondAction'] === true;

                    return imageIsCreated && srcIsSet && methodsAreCalled && titleIsSet;

                }, {id});
                expect(success).toBe(true);

            });

            it('without image', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    let toolbarMock = document.createElement('div');

                    let sectionAction = document.createElement('treez-section-action');

                    element.__processSectionAction(sectionAction, toolbarMock);

                    let image = toolbarMock.firstChild;
                    let imageIsCreated = image.constructor.name === 'HTMLImageElement';
                    let srcIsSet = image.src === 'http://localhost:4444/icons/root.png';

                    return imageIsCreated && srcIsSet;

                }, {id});
                expect(success).toBe(true);

            });

        });

        describe('get __sectionContent', ()=> {

            it('without content', async () => {

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);
                    let action = document.createElement('treez-section-action');
                    element.appendChild(action);

                    return element.__sectionContent === null;

                }, {id});
                expect(success).toBe(true);

            });

            it('with content', async () => {

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);
                    let action = document.createElement('treez-section-action');
                    element.appendChild(action);

                    let content = document.createElement('div');
                    element.appendChild(content);

                    return element.__sectionContent === content;

                }, {id});
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

