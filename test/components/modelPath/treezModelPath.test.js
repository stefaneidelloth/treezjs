import CustomElementsMock from '../../customElementsMock.js';

import TreezModelPath from '../../../src/components/modelPath/treezModelPath.js';

import TestUtils from '../../testUtils.js';

import puppeteerToIstanbul from 'puppeteer-to-istanbul';

import LabeledTreezElement from '../../../src/components/labeledTreezElement.js';
jest.mock('../../../src/components/labeledTreezElement.js', function(){
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

describe('TreezModelPath', ()=>{

    const id = 'treez-model-path';

    let page;

    beforeAll(async () => {
        page = await TestUtils.createBrowserPage();
        await page.coverage.startJSCoverage();

    });

    beforeEach(async () => {
        await TestUtils.clearBody(page);
        await TestUtils.createCustomElement(page, id, 'TreezModelPath', '../../src/components/modelPath/treezModelPath.js');
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

                const methodsAreCalled = (methodCalls['__updateOptionsAndRelativeRoot'] === true) &&
                    (methodCalls['update'] === true);

                console.log('methods are called: ' + methodsAreCalled);

                let event = document.createEvent('HTMLEvents');
                event.initEvent('change', false, true);
                element.__comboBox.dispatchEvent(event);

                let comboBoxChangedIsCalled = methodCalls['__comboBoxChanged'] === true;

                let labelIsCreated = element.__label.constructor.name === 'HTMLLabelElement';
                console.log('label is created: ' + labelIsCreated);

                let relativeRootLabelIsCreated = element.__relativeRootLabel.constructor.name === 'HTMLSpanElement';
                console.log('relative root label is created: ' + relativeRootLabelIsCreated);

                let comboBoxIsCreated = element.__comboBox.constructor.name === 'HTMLSelectElement';
                console.log('combo box is created: ' + comboBoxIsCreated);

                return methodsAreCalled &&
                    comboBoxChangedIsCalled &&
                    labelIsCreated &&
                    relativeRootLabelIsCreated &&
                    comboBoxIsCreated;

                function prepareMocks(element) {
                    const methodCalls = {};

                    element.__updateOptionsAndRelativeRoot = () => {
                        methodCalls['__updateOptionsAndRelativeRoot'] = true;
                    };

                    element.update = () => {
                        methodCalls['update'] = true;
                    };

                    element.__comboBoxChanged = () => {
                        methodCalls['__comboBoxChanged'] = true;
                    };

                    return methodCalls;
                }

                function removeExistingChildren(element) {

                    element.__label = undefined;
                    element.__relativeRootLabel = undefined;
                    element.__comboBox = undefined;

                    while (element.firstChild) {
                        element.firstChild.remove();
                    }
                }

            }, {id});
            expect(success).toBe(true);


        });

        describe('updateElements',  ()=>{

            it('new value is defined', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    element.convertToStringValue = value => value;

                    let newValueMock = 'newValueMock';
                    let option = document.createElement('option');
                    option.innerText = newValueMock;
                    element.__comboBox.appendChild(option);

                    element.updateElements(newValueMock);

                    return element.__comboBox.value === newValueMock;

                }, {id});
                expect(success).toBe(true);

            });

            it('new value is null', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    element.convertToStringValue = value => value;

                    let option = document.createElement('option');
                    option.innerText = 'foo';
                    element.__comboBox.appendChild(option);
                    element.__comboBox.value = 'foo';
                    element.updateElements(null);

                    return element.__comboBox.value === '';

                }, {id});
                expect(success).toBe(true);

            });
        });

        it('updateContentWidth', async ()=>{
            let success = await page.evaluate(({id})=>{
                let element = document.getElementById(id);

                let methodCalls = {};
                element.updateWidthFor = (element, width) =>{
                    methodCalls['updateWidthFor'] = element;
                };

                element.updateContentWidth('widthMock');
                return   methodCalls['updateWidthFor'] === element.__comboBox;
            },{id});
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

                    let comboBoxIsNotDisabledBefore = element.__comboBox.disabled === false;

                    element.disableElements(true);

                    let comboBoxIsDisabledAfter = element.__comboBox.disabled === true;

                    return comboBoxIsNotDisabledBefore &&
                        comboBoxIsDisabledAfter;

                }, {id});
                expect(success).toBe(true);
            });
        });

        describe('hideElements', () => {

            it('undefined', async () => {
                let success = await page.evaluate(({id}) => {
                    let element = document.getElementById(id);
                    try {
                        element.hideElements(undefined);
                        return false;
                    } catch (error) {
                        return true;
                    }
                }, {id});
                expect(success).toBe(true);
            });

            it('common usage', async () => {
                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    const labelIsNotHiddenBefore = element.__label.style.display === '';
                    const comboBoxIsNotHiddenBefore = element.__comboBox.style.display === '';

                    element.hideElements(true);

                    const labelIsHiddenAfter = element.__label.style.display === 'none';
                    const comboBoxIsHiddenAfter = element.__comboBox.style.display === 'none';

                    return labelIsNotHiddenBefore && comboBoxIsNotHiddenBefore &&
                        labelIsHiddenAfter && comboBoxIsHiddenAfter;

                }, {id});
                expect(success).toBe(true);
            });
        });

        describe('convertFromStringValue', ()=> {

            it('falsy value', async () => {

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    let value = element.convertFromStringValue(undefined);
                    return value === null;

                }, {id});
                expect(success).toBe(true);

            });

            describe('with relative root', () => {

                it('absolute path', async () => {

                    const success = await page.evaluate(async ({id}) => {
                        const element = await document.getElementById(id);

                        element.relativeRootAtom = {
                            treePath: 'root.results',
                            children: []
                        };

                        let value = element.convertFromStringValue('root.results.foo');
                        return value === 'root.results.foo';

                    }, {id});
                    expect(success).toBe(true);

                });

                it('relative path', async () => {

                    const success = await page.evaluate(async ({id}) => {
                        const element = await document.getElementById(id);

                        element.relativeRootAtom = {
                            treePath: 'root.results',
                            children: []
                        };

                        let value = element.convertFromStringValue('.foo');
                        return value === 'root.results.foo';

                    }, {id});
                    expect(success).toBe(true);

                });

            });

            it('without relative root', async () => {

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);
                    element.rootPath = 'root.results';

                    let value = element.convertFromStringValue('root.foo');
                    return value === 'root.foo';

                }, {id});
                expect(success).toBe(true);

            });
        });

        describe('convertToStringValue', ()=> {
            it('falsy value', async () => {

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    let value = element.convertToStringValue(undefined);
                    return value === null;

                }, {id});
                expect(success).toBe(true);

            });

            it('with relative root', async () => {

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    element.relativeRootAtom = {
                        treePath: 'root.results',
                        children: []
                    };

                    let relativePath = element.convertToStringValue('root.results.foo');
                    return relativePath === '.foo';

                }, {id});
                expect(success).toBe(true);

            });

            it('without relative root', async () => {

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);


                    let relativePath = element.convertToStringValue('root.results.foo');
                    return relativePath === 'root.results.foo';

                }, {id});
                expect(success).toBe(true);

            });
        });

        it('get atomClasses', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                element.__atomClasses = ['atomClassMock'];
                let classes = element.atomClasses

                return classes[0] === 'atomClassMock';

            }, {id});
            expect(success).toBe(true);

        });

        it('set atomClasses', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                let methodCalls = {};
                element.__updateOptionsAndRelativeRoot = () =>{
                    methodCalls['__updateOptionsAndRelativeRoot'] = true;
                };

                element.atomClasses = ['atomClassMock'];

                let valueIsSet = element.__atomClasses[0] === 'atomClassMock';
                let methodIsCalled = methodCalls['__updateOptionsAndRelativeRoot'] === true;

                return valueIsSet && methodIsCalled;

            }, {id});
            expect(success).toBe(true);

        });

        it('get atomFunctionNames', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);
                element.__atomFunctionNames = ['functionNameMock'];
                let names = element.atomFunctionNames;
                return names[0] === 'functionNameMock';

            }, {id});
            expect(success).toBe(true);

        });

        it('set atomFunctionNames', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                let methodCalls = {};
                element.__updateOptionsAndRelativeRoot = () =>{
                    methodCalls['__updateOptionsAndRelativeRoot'] = true;
                };

                element.atomFunctionNames = ['functionNameMock'];

                let valueIsSet = element.__atomFunctionNames[0] === 'functionNameMock';
                let methodIsCalled = methodCalls['__updateOptionsAndRelativeRoot'] === true;

                return valueIsSet && methodIsCalled;

            }, {id});
            expect(success).toBe(true);

        });

        describe('get root',  ()=>{

            it('with relative root atom', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    element.relativeRootAtom = {
                        treePath:'root',
                        children: []
                    };

                    return element.root.treePath === 'root';

                }, {id});
                expect(success).toBe(true);

            });

            it('from parent atom', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    element.__parentAtom = {root: {treePath:'parentRoot'}};

                    return element.root.treePath === 'parentRoot';
                }, {id});
                expect(success).toBe(true);

            });

            it('without root', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    return element.root === null;
                }, {id});
                expect(success).toBe(true);

            });

        });

        describe('get rootPath', ()=>{

            it('without root', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    return element.rootPath === '';
                }, {id});
                expect(success).toBe(true);

            });

            it('with root', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);
                    element.relativeRootAtom = {
                        treePath:'root',
                        children: []
                    };
                    return element.rootPath === 'root';
                }, {id});
                expect(success).toBe(true);


            });
        });

    });

    describe('Private API', ()=>{


        it('__comboBoxChanged', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                let methodCalls = mockElementMethods(element);

                element.value = 'baa';
                
                let option = document.createElement('option');
                option.innerText = 'foo';
                element.__comboBox.appendChild(option);
                element.__comboBox.value = 'foo';

                element.__comboBoxChanged();

                let valueIsUpdated =  element.value === 'foo';
                let methodIsCalled = methodCalls['convertFromStringValue'] === 'foo';

                return valueIsUpdated && methodIsCalled;

                function mockElementMethods(element){
                    let methodCalls = {};
                    element.convertFromStringValue = (value)=>{
                        methodCalls['convertFromStringValue'] = value;
                        return value;
                    };
                    return methodCalls;
                }

            }, {id});
            expect(success).toBe(true);

        });

        it('__updateOptionsAndRelativeRoot', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                element.__parentAtom = {root: 'rootMock'};

                let methodCalls = {};
                element.__getAvailableModelPaths = () => {
                    methodCalls['__getAvailableModelPaths'] = true;
                    return ['root.a','root.b'];
                };
                element.__tryToGetUpdatedModelPath = () => {
                    methodCalls['__tryToGetUpdatedModelPath'] = true;
                    return 'root.a';
                };
                element.convertFromStringValue = (value) => {
                    methodCalls['convertFromStringValue'] = value;
                    return value;
                };
                element.__removeOptions = () => {
                    methodCalls['__removeOptions'] = true;
                };
                element.__createOptions = (modelPaths) => {
                    methodCalls['__createOptions'] = true;
                };
                element.__updateRelativeRootLabel = (modelPaths) => {
                    methodCalls['__updateRelativeRootLabel'] = true;
                };

                element.__updateOptionsAndRelativeRoot();

                let methodsAreCalled =  (methodCalls['__getAvailableModelPaths'] === true) &&
                                        (methodCalls['__tryToGetUpdatedModelPath'] === true) &&
                                        (methodCalls['convertFromStringValue'] === 'root.a') &&
                                        (methodCalls['__removeOptions'] === true) &&
                                        (methodCalls['__createOptions'] === true) &&
                                        (methodCalls['__updateRelativeRootLabel'] === true);
                return methodsAreCalled;

            }, {id});
            expect(success).toBe(true);

        });

        describe('__tryToGetUpdatedModelPath', ()=>{

            it('without old model path', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);
                    let modelPath = element.__tryToGetUpdatedModelPath(undefined);
                    return modelPath === null;
                }, {id});
                expect(success).toBe(true);

            });

            describe('with old model path', ()=>{

                it('new available paths are empty', async ()=>{

                    const success = await page.evaluate(async ({id}) => {
                        const element = await document.getElementById(id);
                        element.value = 'root.foo';
                        let modelPath = element.__tryToGetUpdatedModelPath([]);
                        return modelPath === null;
                    }, {id});
                    expect(success).toBe(true);

                });

                it('single available path', async ()=>{

                    const success = await page.evaluate(async ({id}) => {
                        const element = await document.getElementById(id);
                        element.value = 'root.foo';
                        let modelPath = element.__tryToGetUpdatedModelPath(['root.baa']);
                        return modelPath === 'root.baa';
                    }, {id});
                    expect(success).toBe(true);

                });

                it('new available paths do not contain old path', async ()=>{

                    const success = await page.evaluate(async ({id}) => {
                        const element = await document.getElementById(id);
                        element.value = 'root.foo';
                        let modelPath = element.__tryToGetUpdatedModelPath(['root.baa','root.qux']);
                        return modelPath === null;
                    }, {id});
                    expect(success).toBe(true);

                });

                it('old path is shorter than new root path', async ()=>{

                    const success = await page.evaluate(async ({id}) => {
                        const element = await document.getElementById(id);


                        element.relativeRootAtom = {
                            treePath: 'myRoot.bla.blub',
                            children: []
                        };

                        let option = document.createElement('option');
                        option.innerText = 'root.foo';
                        element.__comboBox.appendChild(option);

                        element.value = 'root.foo';

                        let modelPath = element.__tryToGetUpdatedModelPath(['root.baa','root.qux']);
                        return modelPath === null;
                    }, {id});
                    expect(success).toBe(true);

                });

                it('new available paths contain old path', async ()=>{

                    const success = await page.evaluate(async ({id}) => {
                        const element = await document.getElementById(id);
                        element.value = 'root.foo';
                        let modelPath = element.__tryToGetUpdatedModelPath(['root.baa','root.foo']);
                        return modelPath === 'root.foo';
                    }, {id});
                    expect(success).toBe(true);

                });

                it('new available paths contain old path as relative path', async () => {

                    const success = await page.evaluate(async ({id}) => {
                        const element = await document.getElementById(id);
                        element.relativeRootAtom = {
                            treePath: 'root',
                            children: []
                        };
                        element.value = 'root.foo';
                        let path = element.__tryToGetUpdatedModelPath(['.baa','.foo']);
                        return path === '.foo';
                    }, {id});
                    expect(success).toBe(true);

                });

            });

        });

        describe('__updateRelativeRootLabel', ()=>{

            it('is using relative root', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);
                    element.relativeRootAtom = {
                        treePath: 'relative.root.path',
                        children: []
                    };

                    element.__relativeRootLabel.style.display = 'none';
                    element.__relativeRootLabel.textContent = '';
                    element.__relativeRootLabel.style.display = 'none';
                    element.__updateRelativeRootLabel();
                    let isSetAfter = element.__relativeRootLabel.textContent === 'relative.root.path';
                    let isVisibleAfter = element.__relativeRootLabel.style.display === 'inline-block';

                    return isSetAfter && isVisibleAfter;
                }, {id});
                expect(success).toBe(true);

            });

            it('is not using relative root', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    element.__relativeRootLabel.textContent = 'root.foo';
                    element.__relativeRootLabel.style.display = 'inline-block';

                    let isSetBefore = element.__relativeRootLabel.textContent === 'root.foo';
                    let isVisibleBefore = element.__relativeRootLabel.style.display === 'inline-block';

                    element.__updateRelativeRootLabel();

                    let isNotSetAfter = element.__relativeRootLabel.textContent === '';
                    let isNotVisibleAfter = element.__relativeRootLabel.style.display === 'none';

                    return isSetBefore && isVisibleBefore &&
                        isNotSetAfter &&  isNotVisibleAfter;
                }, {id});
                expect(success).toBe(true);

            });

        });

        it('__removeOptions', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                let dummyChild = document.createElement('option');
                element.__comboBox.appendChild(dummyChild);

                let hasChildrenBefore = element.__comboBox.children.length > 0;

                element.__removeOptions();

                let hasNoChildrenAfter = element.__comboBox.children.length === 0;

                return hasChildrenBefore && hasNoChildrenAfter;
            }, {id});
            expect(success).toBe(true);

        });

        it('__createOptions', async ()=>{

            const success = await page.evaluate(async ({id}) => {
                const element = await document.getElementById(id);

                let hasNoChildrenBefore = element.__comboBox.children.length === 0;

                element.__createOptions(['root.a','root.b']);

                let hasChildrenAfter = element.__comboBox.children.length === 2;

                return hasNoChildrenBefore && hasChildrenAfter;
            }, {id});
            expect(success).toBe(true);

        });

        describe('__getAvailableModelPaths',  ()=>{

            it('by classes', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    element.__atomClasses = ['AtomClassMock'];

                    let methodCalls = {};
                    element.__addAvailablePathByClass = ()=>{
                        methodCalls['__addAvailablePathByClass'] = true;
                        return ['root.available.path.by.class'];
                    };
                    element.__addAvailablePathByInterface = ()=>{
                        methodCalls['__addAvailablePathByInterface'] = true;
                        return ['root.available.path.by.interface'];
                    };

                    let childMock = {children: []};
                    let atomMock = {children: [childMock]};

                    let paths = element.__getAvailableModelPaths(atomMock, false, undefined);

                    let methodIsCalled = methodCalls['__addAvailablePathByClass'] === true &&
                    methodCalls['__addAvailablePathByInterface'] === undefined;;

                    return methodIsCalled && paths[0] === 'root.available.path.by.class';
                }, {id});
                expect(success).toBe(true);

            });

            it('by interface', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    element.__atomFunctionNames = ['atomFunctionNameMock'];

                    let methodCalls = {};
                    element.__addAvailablePathByClass = ()=>{
                        methodCalls['__addAvailablePathByClass'] = true;
                        return ['root.available.path.by.class'];
                    };
                    element.__addAvailablePathByInterface = ()=>{
                        methodCalls['__addAvailablePathByInterface'] = true;
                        return ['root.available.path.by.interface'];
                    };

                    let childMock = {children: []};
                    let atomMock = {children: [childMock]};

                    let paths = element.__getAvailableModelPaths(atomMock, false, undefined);

                    let methodIsCalled = methodCalls['__addAvailablePathByInterface'] === true &&
                        methodCalls['__addAvailablePathByClass'] === undefined;;

                    return methodIsCalled && paths[0] === 'root.available.path.by.interface';
                }, {id});
                expect(success).toBe(true);

            });

            it('specifying classes and interface throws error', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    element.__atomClasses = ['AtomClassMock'];
                    element.__atomFunctionNames = ['atomFunctionNameMock'];

                    let childMock = {children: []};
                    let atomMock = {children: [childMock]};

                    try {
                        element.__getAvailableModelPaths(atomMock, false, undefined);
                        return false;
                    } catch (error){
                        return true;
                    }

                }, {id});
                expect(success).toBe(true);

            });

            it('specifying no classes and no interface throws error', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    let childMock = {children: []};
                    let atomMock = {children: [childMock]};

                    try {
                        element.__getAvailableModelPaths(atomMock, false, undefined);
                        return false;
                    } catch (error){
                        return true;
                    }

                }, {id});
                expect(success).toBe(true);

            });

            it('has to be enabled', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    element.__atomFunctionNames = ['atomFunctionNameMock'];

                    let methodCalls = {};
                    element.__addAvailablePathByClass = ()=>{
                        methodCalls['__addAvailablePathByClass'] = true;
                        return ['root.available.path.by.class'];
                    };
                    element.__addAvailablePathByInterface = ()=>{
                        methodCalls['__addAvailablePathByInterface'] = true;
                        return ['root.available.path.by.interface'];
                    };

                    let childMock = {children: [], isEnabled: true};
                    let disabledChildMock = {children: [], isEnabled: false};
                    let atomMock = {children: [childMock, disabledChildMock]};

                    let paths = element.__getAvailableModelPaths(atomMock, true, undefined);

                    return  paths[0] === 'root.available.path.by.interface';
                }, {id});
                expect(success).toBe(true);

            });

        });

        describe('__addAvailablePathByClass', ()=>{

            describe('matching class',  ()=>{

                it('without filter', async ()=>{

                    const success = await page.evaluate(async ({id}) => {
                        const element = await document.getElementById(id);

                        let methodCalls = {};
                        element.__addPathForChild = (paths, child)=>{
                            return ['found.path.mock'];
                        };

                        class DummyAtom{
                            constructor(name){
                                this.name = name;
                            }
                        }

                        let childMock = new DummyAtom('first');

                        let paths = [];
                        paths = element.__addAvailablePathByClass(paths, childMock, [DummyAtom], undefined);

                        let pathIsIncluded =  paths[0] === 'found.path.mock';
                        return pathIsIncluded;

                    }, {id});
                    expect(success).toBe(true);

                });

                it('passing filter', async ()=>{

                    const success = await page.evaluate(async ({id}) => {
                        const element = await document.getElementById(id);

                        let methodCalls = {};
                        element.__addPathForChild = (paths, child)=>{
                            return ['found.path.mock'];
                        };

                        class DummyAtom{
                            constructor(name){
                                this.name = name;
                            }
                        }

                        let childMock = new DummyAtom('first');

                        let filterDelegate = (child)=>{
                            return child.name === 'first';
                        }

                        let paths = [];
                        paths = element.__addAvailablePathByClass(paths, childMock, [DummyAtom], filterDelegate);

                        let pathIsIncluded =  paths[0] === 'found.path.mock';
                        return pathIsIncluded;

                    }, {id});
                    expect(success).toBe(true);

                });

                it('failing filter', async ()=>{

                    const success = await page.evaluate(async ({id}) => {
                        const element = await document.getElementById(id);

                        let methodCalls = {};
                        element.__addPathForChild = (paths, child)=>{
                            return ['found.path.mock'];
                        };

                        class DummyAtom{
                            constructor(name){
                                this.name = name;
                            }
                        }

                        let childMock = new DummyAtom('first');

                        let filterDelegate = (child)=>{
                            return child.name === 'second';
                        }

                        let paths = [];
                        paths = element.__addAvailablePathByClass(paths, childMock, [DummyAtom], filterDelegate);

                        let pathIsNotIncluded =  paths.length === 0;
                        return pathIsNotIncluded;

                    }, {id});
                    expect(success).toBe(true);

                });

            });

            it('no class match', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    let methodCalls = {};
                    element.__addPathForChild = (paths, child)=>{
                        return ['found.path.mock'];
                    };

                    class DummyAtom{
                        constructor(name){
                            this.name = name;
                        }
                    }

                    class FooAtom{
                        constructor(name){
                            this.name = name;
                        }
                    }

                    let childMock = new DummyAtom('first');

                    let paths = [];
                    paths = element.__addAvailablePathByClass(paths, childMock, [FooAtom], undefined);

                    let pathIsNotIncluded =  paths.length === 0;
                    return pathIsNotIncluded;

                }, {id});
                expect(success).toBe(true);

            });

        });

        describe('__addAvailablePathByInterface', ()=>{

            describe('has interface',  ()=>{

                it('without filter',  async()=>{

                    const success = await page.evaluate(async ({id}) => {
                        const element = await document.getElementById(id);

                        let methodCalls = {};
                        element.__addPathForChild = (paths, child)=>{
                            return ['found.path.mock'];
                        };
                        element.__containsAllFunctions = () =>{
                            return true;
                        };

                        let paths = [];
                        paths = element.__addAvailablePathByInterface(paths, 'childMock', ['firstMethod','secondMethod'], undefined);

                        let pathIsIncluded =  paths[0] === 'found.path.mock';
                        return pathIsIncluded;

                    }, {id});
                    expect(success).toBe(true);

                });

                it('passing filter',  async()=>{

                    const success = await page.evaluate(async ({id}) => {
                        const element = await document.getElementById(id);

                        let methodCalls = {};
                        element.__addPathForChild = (paths, child)=>{
                            return ['found.path.mock'];
                        };
                        element.__containsAllFunctions = () =>{
                            return true;
                        };

                        let filterDelegate = (child)=>{
                            return true;
                        };

                        let paths = [];
                        paths = element.__addAvailablePathByInterface(paths, 'childMock', ['firstMethod','secondMethod'], filterDelegate);

                        let pathIsIncluded =  paths[0] === 'found.path.mock';
                        return pathIsIncluded;

                    }, {id});
                    expect(success).toBe(true);

                });

                it('failing filter',  async()=>{

                    const success = await page.evaluate(async ({id}) => {
                        const element = await document.getElementById(id);

                        let methodCalls = {};
                        element.__addPathForChild = (paths, child)=>{
                            return ['found.path.mock'];
                        };
                        element.__containsAllFunctions = () =>{
                            return true;
                        };

                        let filterDelegate = (child)=>{
                            return false;
                        };

                        let paths = [];
                        paths = element.__addAvailablePathByInterface(paths, 'childMock', ['firstMethod','secondMethod'], filterDelegate);

                        let pathIsNotIncluded =  paths.length === 0;
                        return pathIsNotIncluded;

                    }, {id});
                    expect(success).toBe(true);

                });


            });

            it('does not have interface',  async()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    let methodCalls = {};
                    element.__addPathForChild = (paths, child)=>{
                        return ['found.path.mock'];
                    };
                    element.__containsAllFunctions = () =>{
                        return false;
                    };

                    let paths = [];
                    paths = element.__addAvailablePathByInterface(paths, 'childMock', ['firstMethod','secondMethod'], undefined);

                    let pathIsNotIncluded =  paths.length === 0;
                    return pathIsNotIncluded;

                }, {id});
                expect(success).toBe(true);

            });

        });

        describe('__addPathForChild', ()=>{

            it('with relative root', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    element.relativeRootAtom = {
                        treePath: 'root.foo',
                        children: []
                    };

                    let childMock = {treePath: 'root.foo.child'};
                    let paths = element.__addPathForChild([],childMock);

                    return paths[0] === '.child';
                }, {id});
                expect(success).toBe(true);

            });

            it('without relative root', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    let childMock = {treePath: 'root.foo.child'};
                    let paths = element.__addPathForChild([],childMock);

                    return paths[0] === 'root.foo.child';
                }, {id});
                expect(success).toBe(true);

            });

        });

        describe('__containsAllFunctions', ()=>{

            it('has all functions', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    let childMock = {
                        firstFunction: ()=>{},
                        secondFunction: ()=>{}
                    }
                    return element.__containsAllFunctions(childMock,['firstFunction','secondFunction']);
                }, {id});
                expect(success).toBe(true);

            });

            it('is missing some function', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);

                    let childMock = {
                        firstFunction: ()=>{}
                    }
                    return !element.__containsAllFunctions(childMock,['firstFunction','secondFunction']);
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

