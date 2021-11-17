import CustomElementsMock from '../../customElementsMock.js';
import LabeledTreezElement from '../../../src/components/labeledTreezElement.js';
jest.mock('../../../src/components/labeledTreezElement.js', function(){
        let constructor = jest.fn();
		constructor.mockImplementation(
			function(){	  
				return this;				
            }
        );
        constructor.observedAttributes = ['mockedObservedAttribute'];
           
        return constructor;
	}
);

import TreezAbstractPath from '../../../src/components/file/treezAbstractPath.js';

import TestUtils from '../../testUtils.js';

import puppeteerToIstanbul from 'puppeteer-to-istanbul';

jest.setTimeout(10000);

describe('TreezAbstractPath', ()=>{   
    
    let id = 'treez-abstract-path';

    let page;      

    beforeAll(async () => { 
        page = await TestUtils.createBrowserPage(); 
        await page.coverage.startJSCoverage();
    }); 

    beforeEach(async () => {
        await TestUtils.clearBody(page);
        await TestUtils.createCustomElement(page, id, 'TreezAbstractPath', '../../src/components/file/treezAbstractPath.js');
    });
    
    describe('State after construction', ()=>{

        it('id',  async ()=>{   
            let property = await page.$eval('#' + id, element=> element.id);       
            expect(property).toBe(id);
         });           
        
    });

    describe('Public API', ()=>{  

        describe('updateElements', ()=>{

            it('undefined results in empty string', async ()=>{           
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    let textField = document.createElement('input');
                    textField.value = 'oldValue';
                    element.__textField = textField;
    
                    let isNotSetBefore = element.__textField.value === 'oldValue';
                    element.updateElements(undefined);
                    let isEmptyStringAfter = element.__textField.value === '';
    
                    return isNotSetBefore &&
                        isEmptyStringAfter;
                },{id});
                expect(success).toBe(true);
            });  

            it('normal value', async ()=>{           
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    let textField = document.createElement('input');
                    textField.value = 'oldValue';
                    element.__textField = textField;
    
                    let isNotSetBefore = element.__textField.value === 'oldValue';
                    let titleIsNotSetBefore = element.title === '';

                    element.updateElements('newValue');
                    
                    let isSetAfter = element.__textField.value === 'newValue';

                    console.log('full path: ' + element.resolvedPath);
                    let titleIsSetAter = textField.title === '' + element.resolvedPath;
    
                    return isNotSetBefore &&
                        titleIsNotSetBefore &&
                        isSetAfter &&
                        titleIsSetAter;
                },{id});
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
                return   methodCalls['updateWidthFor'] === element.__container;
            },{id});
            expect(success).toBe(true);
        });

        describe('disableElements',  ()=> {

            it('undefined', async () => {
                let success = await page.evaluate(({id}) => {
                    let element = document.getElementById(id);
                    try {
                        element.disableElements(undefined);
                        return false;
                    } catch (error) {
                        return true;
                    }
                }, {id});
                expect(success).toBe(true);
            });

            it('common usage', async () => {
                let success = await page.evaluate(({id}) => {
                    let element = document.getElementById(id);

                    let textField = document.createElement('input');
                    element.__textField = textField;

                    let button = document.createElement('button');
                    element.__browseButton = button;

                    let isNotDisabledBefore = element.__textField.disabled === false;
                    console.log('is not disabled before: ' + isNotDisabledBefore);

                    let browseButtonIsVisiableBefore = element.__browseButton.style.display === '';
                    console.log('browse button is visible before: ' + browseButtonIsVisiableBefore);

                    element.disableElements(true);

                    let isDisabledAfter = element.__textField.disabled === true;
                    console.log('is disabled after: ' + isDisabledAfter);

                    let browseButtonIsNotVisiableAfter = element.__browseButton.style.display === 'none';
                    console.log('browse button is not visible: ' + browseButtonIsNotVisiableAfter);

                    return isNotDisabledBefore && browseButtonIsVisiableBefore &&
                        isDisabledAfter && browseButtonIsNotVisiableAfter;
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
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);

                    let label = document.createElement('label');
                    element.__label = label;

                    let container = document.createElement('div');
                    element.__container = container;

                    let labelIsNotHiddenBefore = element.__label.style.display === '';
                    let containerIsNotHiddenBefore = element.__container.style.display === '';

                    element.hideElements(true);
                    let labelIsHiddenAfter = element.__label.style.display === 'none';
                    let containerIsHiddenAfter = element.__container.style.display === 'none';
                    return labelIsNotHiddenBefore && containerIsNotHiddenBefore &&
                        labelIsHiddenAfter && containerIsHiddenAfter;
                },{id});
                expect(success).toBe(true);
            });
        });
        
        it('textFieldChanged', async ()=>{
           
            let success = await page.evaluate(({id})=>{
                let element = document.getElementById(id);

                let textField = document.createElement('input');  
                textField.value = 'newValue';             
                element.__textField = textField;

                console.log('element value before: ' + element.value);
                let valueIsNotSetBefore = element.value === null;

                element.textFieldChanged();

                let valueIsSetAfter = element.value === 'newValue';
               

                return valueIsNotSetBefore && valueIsSetAfter;

            },{id});
            expect(success).toBe(true);                       

        }); 

        it('execute', async ()=>{   

            let success = await page.evaluate(({id})=>{
                let element = document.getElementById(id);

                let terminalMock = { 
                    command: undefined,
                    finishedHanlder: undefined,
                    errorHandler: undefined
                };

                terminalMock.executeWithoutWait =  (command, finishedHandler, errorHandler) => {
                    terminalMock.command = command;
                    terminalMock.finishedHandler = finishedHandler;
                    terminalMock.errorHandler = errorHandler;
                }             
                window.treezTerminal = terminalMock;

                element.value = 'commandMock';

                console.log('full path: ' + element.resolvedPath);

                element.execute();

                let terminalIsCalled = terminalMock.command === 'commandMock';
                console.log('terminal is called: ' + terminalIsCalled);

                let executionErrorMock = 'executionErrorMock';

                let methodCalls = {};
                let alert = window.alert;
                window.alert = (value)=>{
                    methodCalls['alert'] = value;
                };

                terminalMock.errorHandler(executionErrorMock);
                window.alert = alert;

                let alertIsCalled = methodCalls['alert'] === executionErrorMock;

                let errorHandlerIsDefined = terminalMock.errorHandler !== undefined;
                console.log('error handler is defined: ' + errorHandlerIsDefined);

                return terminalIsCalled && errorHandlerIsDefined && alertIsCalled;

            },{id});
            expect(success).toBe(true);

        }); 
        
        describe('injectPathMap', ()=>{

            it('without path map provider', async ()=>{

                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);

                    let path = 'c:/foo/baa';
                    let pathWithInjections = element.injectPathMap(path);
    
                    return pathWithInjections === path;
    
                },{id});
                expect(success).toBe(true);
    
            }); 

            describe('with path map provider', ()=>{

                it('path includes sub path from map', async ()=>{

                    let success = await page.evaluate(({id})=>{
                        let element = document.getElementById(id);
                        element.label = 'myPath';
                        let pathMap = [{name: 'projectDir', resolvedPath: 'c:/foo'},{name: 'myPath', resolvedPath: 'd:/baa'}];
                        element.__pathMapProvider = {pathMap: pathMap};

                        let path = 'c:/foo/baa';
                        let pathWithInjections = element.injectPathMap(path);
        
                        return pathWithInjections === '{$projectDir$}/baa';
        
                    },{id});
                    expect(success).toBe(true);
        
                });

                it('path includes several sub paths from map', async ()=>{

                    let success = await page.evaluate(({id})=>{
                        let element = document.getElementById(id);

                        let pathMap = [{name: 'projectDir', resolvedPath: 'c:/foo'},{name: 'myPath', resolvedPath: 'c:/foo/baa'}];
                        element.__pathMapProvider = {pathMap: pathMap};

                        let path = 'c:/foo/baa/qux';
                        let pathWithInjections = element.injectPathMap(path);

                        return pathWithInjections === '{$myPath$}/qux';

                    },{id});
                    expect(success).toBe(true);

                });

                it('path does not include sub path from map', async ()=>{

                    let success = await page.evaluate(({id})=>{
                        let element = document.getElementById(id);
                        let pathMap = [{name: 'projectDir', resolvedPath: 'c:/qux'}];
                        element.__pathMapProvider = {pathMap: pathMap};

                        let path = 'c:/foo/baa';
                        let pathWithInjections = element.injectPathMap(path);
        
                        return pathWithInjections === path;
        
                    },{id});
                    expect(success).toBe(true);
        
                }); 
    
            }); 

        }); 

        describe('replacePathVariables', ()=>{

            it('falsy path', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    let treezAbstractPath = element.constructor;
                    let pathWithInjectedVariables = treezAbstractPath.replacePathVariables('', 'pathMapMock');
                    return pathWithInjectedVariables === '';
                },{id});
                expect(success).toBe(true);
            }); 

            it('normal usage', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    let treezAbstractPath = element.constructor;

                    let pathMap = [
                        { name: 'workingDir',
                            value: 'c:/foo'
                        },
                        { name: 'subDir',
                            value: '{$workingDir$}/baa'
                        }
                    ];

                    let path = '{$subDir$}/qux.exe';
                    let pathWithInjectedVariables = treezAbstractPath.replacePathVariables(path, pathMap);

                    return pathWithInjectedVariables === 'c:/foo/baa/qux.exe';
                },{id});
                expect(success).toBe(true);

            }); 

            it('missing variable', async  ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    let treezAbstractPath = element.constructor;

                    let pathMap = [
                        { name: 'subDir',
                            value: '{$workingDir$}/baa'
                        }
                    ];

                    let path = '{$subDir$}/qux.exe';

                    let methodCalls = {};
                    let warnMethod = console.warn;
                    console.warn = (message)=>{
                        methodCalls['warn'] = message;
                    }

                    let pathWithInjectedVariables = treezAbstractPath.replacePathVariables(path, pathMap);

                    console.warn = warnMethod;

                    return (pathWithInjectedVariables === '{$workingDir$}/baa/qux.exe') &&
                        (methodCalls['warn'] !== undefined);
                },{id});
                expect(success).toBe(true);
                
            }); 

        }); 

        describe('get fullDirectory', ()=>{

            it('full path is falsy', async ()=>{

                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    element.value = null;
                    console.log('full path: ' + element.resolvedPath);

                    return element.fullDirectory === null; 
    
                },{id});
                expect(success).toBe(true);
    
            }); 

            it('full path is directory', async ()=>{

                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    element.value = 'c:/foo/baa';
                    console.log('full path: ' + element.resolvedPath);

                    return element.fullDirectory === 'c:/foo/baa'; 
    
                },{id});
                expect(success).toBe(true);
    
            }); 

            it('full path is directory with ending slash', async ()=>{

                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    element.value = 'c:/foo/baa/';
                    console.log('full path: ' + element.resolvedPath);

                    return element.fullDirectory === 'c:/foo/baa'; 
    
                },{id});
                expect(success).toBe(true);
    
            }); 

            it('full path is file path', async ()=>{

                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    element.value = 'c:/foo/baa/qux.txt';
                    console.log('full path: ' + element.resolvedPath);

                    return element.fullDirectory === 'c:/foo/baa'; 
    
                },{id});
                expect(success).toBe(true);
    
            });            

        });        

        describe('get fullParentDirectory', ()=>{

            it('full path is falsy', async ()=>{

                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    element.value = null;
                    console.log('full path: ' + element.resolvedPath);

                    return element.fullParentDirectory === null; 
    
                },{id});
                expect(success).toBe(true);
    
            }); 

            it('full path is directory', async ()=>{

                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    element.value = 'c:/foo/baa';
                    console.log('full path: ' + element.resolvedPath);

                    return element.fullParentDirectory === 'c:/foo'; 
    
                },{id});
                expect(success).toBe(true);
    
            }); 

            it('full path is directory with ending slash', async ()=>{

                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    element.value = 'c:/foo/baa/';
                    console.log('full path: ' + element.resolvedPath);

                    return element.fullParentDirectory === 'c:/foo'; 
    
                },{id});
                expect(success).toBe(true);
    
            }); 

            it('full path is file path', async ()=>{

                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    element.value = 'c:/foo/baa/qux.txt';
                    console.log('full path: ' + element.resolvedPath);

                    return element.fullParentDirectory === 'c:/foo/baa'; 
    
                },{id});
                expect(success).toBe(true);
    
            });            

        });

        describe('get isFile', ()=>{

            it('without value', async ()=>{

                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    element.value = null;
                    return element.isFile === false;
                },{id});
                expect(success).toBe(true);

            });

            it('file', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    element.value = 'c:/foo.txt';
                    return element.isFile === true;
                },{id});
                expect(success).toBe(true);
            });

            it('directory', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    element.value = 'c:/foo';
                    return element.isFile === false;
                },{id});
                expect(success).toBe(true);
            });

        });

        it('set pathMapProvider', async ()=>{

            let success = await page.evaluate(({id})=>{
                let element = document.getElementById(id);

                let textField = document.createElement('input');
                element.__textField = textField;

                let path = '{$workingDir$}/foo';
                element.value = path;
                console.log('full path: ' + element.resolvedPath);

                let providerIsUndefinedBefore = element.__pathMapProvider === undefined;
                let titleIsPathBefore = element.__textField.title === path;

                let pathMapProviderMock = {
                    pathMap: [{name:'workingDir', value: 'c:/baa'}]
                }
                element.pathMapProvider = pathMapProviderMock;

                console.log('full path with provider: ' + element.resolvedPath);

                let providerIsSetAfter = element.__pathMapProvider === pathMapProviderMock;
                let titleIsUpdated = element.__textField.title === 'c:/baa/foo';

                return providerIsUndefinedBefore && titleIsPathBefore &&
                    providerIsSetAfter && titleIsUpdated;

            },{id});
            expect(success).toBe(true);

        }); 

        describe('get resolvedPath', ()=>{
        
            it('without path map provider', async ()=>{

                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    element.value = 'c:/foo';
    
                    return element.resolvedPath === element.value;
    
                },{id});
                expect(success).toBe(true);
    
            }); 

            it('with path map provider', async ()=>{

                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    element.value = '{$workingDir$}/baa';

                    let pathMapProviderMock = {
                        pathMap: [{name: 'workingDir', value: 'c:/foo'}]
                    };
                    element.__pathMapProvider = pathMapProviderMock;

                    console.log('full path: ' + element.resolvedPath);
                        
                    return element.resolvedPath === 'c:/foo/baa';
    
                },{id});
                expect(success).toBe(true);
    
            }); 
        });       
        
    });

    describe('Private API', ()=>{

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

