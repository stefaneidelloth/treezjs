import CustomElementsMock from '../../customElementsMock.js';
import LabeledTreezElement from '../../../src/components/labeledTreezElement.js';
jest.mock('../../../src/components/labeledTreezElement.js', function(){
        var constructor = jest.fn();
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
    
    var id = 'treez-abstract-path';

    var page;      

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
            var property = await page.$eval('#' + id, element=> element.id);       
            expect(property).toBe(id);
         });           
        
    });

    describe('Public API', ()=>{  

        describe('updateElements', ()=>{

            it('undefined results in empty string', async ()=>{           
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    var textField = document.createElement('input');
                    textField.value = 'oldValue';
                    element.__textField = textField;
    
                    var isNotSetBefore = element.__textField.value === 'oldValue';
                    element.updateElements(undefined);
                    var isEmptyStringAfter = element.__textField.value === '';
    
                    return isNotSetBefore &&
                        isEmptyStringAfter;
                },{id});
                expect(success).toBe(true);
            });  

            it('normal value', async ()=>{           
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    var textField = document.createElement('input');
                    textField.value = 'oldValue';
                    element.__textField = textField;
    
                    var isNotSetBefore = element.__textField.value === 'oldValue';
                    var titleIsNotSetBefore = element.title === '';

                    element.updateElements('newValue');
                    
                    var isSetAfter = element.__textField.value === 'newValue';

                    console.log('full path: ' + element.fullPath)
                    var titleIsSetAter = textField.title === '' + element.fullPath;
    
                    return isNotSetBefore &&
                        titleIsNotSetBefore &&
                        isSetAfter &&
                        titleIsSetAter;
                },{id});
                expect(success).toBe(true);
            });  

        });       

        it('disableElements', async ()=>{
           
            var success = await page.evaluate(({id})=>{
                var element = document.getElementById(id);
                
                var textField = document.createElement('input');               
                element.__textField = textField;

                var button = document.createElement('button');
                element.__browseButton = button;

                var isNotDisabledBefore = element.__textField.disabled === false;
                console.log('is not disabled before: ' + isNotDisabledBefore);

                var browseButtonIsVisiableBefore = element.__browseButton.style.display === '';
                console.log('browse button is visible before: ' + browseButtonIsVisiableBefore);

                element.disableElements(true);

                var isDisabledAfter = element.__textField.disabled === true;
                console.log('is disabled after: ' + isDisabledAfter);

                var browseButtonIsNotVisiableAfter = element.__browseButton.style.display === 'none';
                console.log('browse button is not visible: ' + browseButtonIsNotVisiableAfter);

                return isNotDisabledBefore && browseButtonIsVisiableBefore &&
                    isDisabledAfter && browseButtonIsNotVisiableAfter;
            },{id});
            expect(success).toBe(true);                 

        }); 

        it('hideElements', async ()=>{
        
            var success = await page.evaluate(({id})=>{
                var element = document.getElementById(id);

                var label = document.createElement('label');               
                element.__label = label;

                var container = document.createElement('div');               
                element.__container = container;              
                
                var labelIsNotHiddenBefore = element.__label.style.display === '';
                var containerIsNotHiddenBefore = element.__container.style.display === '';
                
                element.hideElements(true);
                var labelIsHiddenAfter = element.__label.style.display === 'none';
                var containerIsHiddenAfter = element.__container.style.display === 'none';
                return labelIsNotHiddenBefore && containerIsNotHiddenBefore &&
                    labelIsHiddenAfter && containerIsHiddenAfter;
            },{id});
            expect(success).toBe(true);             

        }); 
        
        it('textFieldChanged', async ()=>{
           
            var success = await page.evaluate(({id})=>{
                var element = document.getElementById(id);

                var textField = document.createElement('input');  
                textField.value = 'newValue';             
                element.__textField = textField;

                console.log('element value before: ' + element.value);
                var valueIsNotSetBefore = element.value === null;

                element.textFieldChanged();

                var valueIsSetAfter = element.value === 'newValue';
               

                return valueIsNotSetBefore && valueIsSetAfter;

            },{id});
            expect(success).toBe(true);                       

        }); 

        it('execute', async ()=>{   

            var success = await page.evaluate(({id})=>{
                var element = document.getElementById(id);

                var terminalMock = { 
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

                console.log('full path: ' + element.fullPath);

                element.execute();

                var terminalIsCalled = terminalMock.command === 'commandMock';
                console.log('terminal is called: ' + terminalIsCalled);

                var errorHandlerIsDefined = terminalMock.errorHandler !== undefined;
                console.log('error handler is defined: ' + errorHandlerIsDefined);

                return terminalIsCalled && errorHandlerIsDefined;

            },{id});
            expect(success).toBe(true);

        }); 
        
        describe('injectPathMap', ()=>{

            it('without path map provider', async ()=>{

                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);

                    var path = 'c:/foo/baa';
                    var pathWithInjections = element.injectPathMap(path);
    
                    return pathWithInjections === path;
    
                },{id});
                expect(success).toBe(true);
    
            }); 

            describe('with path map provider', ()=>{

                it('path includes sub path from map', async ()=>{

                    var success = await page.evaluate(({id})=>{
                        var element = document.getElementById(id);
                        var pathMap = [{name: 'projectDir', fullPath: 'c:/foo'}];
                        element.__pathMapProvider = {pathMap: pathMap};

                        var path = 'c:/foo/baa';
                        var pathWithInjections = element.injectPathMap(path);
        
                        return pathWithInjections === '{$projectDir$}/baa';
        
                    },{id});
                    expect(success).toBe(true);
        
                }); 

                it('path does not include sub path from map', async ()=>{

                    var success = await page.evaluate(({id})=>{
                        var element = document.getElementById(id);
                        var pathMap = [{name: 'projectDir', fullPath: 'c:/qux'}];
                        element.__pathMapProvider = {pathMap: pathMap};

                        var path = 'c:/foo/baa';
                        var pathWithInjections = element.injectPathMap(path);
        
                        return pathWithInjections === path;
        
                    },{id});
                    expect(success).toBe(true);
        
                }); 
    
            }); 

        }); 

        describe('replacePathVariables', async ()=>{

            it('falsy path', ()=>{
                var pathWithInjectedVariables = TreezAbstractPath.replacePathVariables('', 'pathMapMock');    
                expect(pathWithInjectedVariables).toBe('');                 
            }); 

            it('normal usage', ()=>{
                var pathMap = [
                    { name: 'workingDir', 
                      value: 'c:/foo'
                    },
                    { name: 'subDir', 
                      value: '{$workingDir$}/baa'
                    }
                ];
                
                var path = '{$subDir$}/qux.exe';
                var pathWithInjectedVariables = TreezAbstractPath.replacePathVariables(path, pathMap);  

                expect(pathWithInjectedVariables).toBe('c:/foo/baa/qux.exe');                  
            }); 

            it('missing variable', ()=>{
                var pathMap = [
                    { name: 'subDir', 
                      value: '{$workingDir$}/baa'
                    }
                ];

                var path = '{$subDir$}/qux.exe';

                var methodCalls = {};
                var warnMethod = console.warn;
                console.warn = (message)=>{
                    methodCalls['warn'] = message;
                }

                var pathWithInjectedVariables = TreezAbstractPath.replacePathVariables(path, pathMap); 

                console.warn = warnMethod;
                
                expect(pathWithInjectedVariables).toBe('{$workingDir$}/baa/qux.exe'); 
                expect(methodCalls['warn']).toBeDefined();                
                
            }); 

        }); 

        describe('get fullDirectory', ()=>{

            it('full path is falsy', async ()=>{

                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    element.value = null;
                    console.log('full path: ' + element.fullPath);

                    return element.fullDirectory === null; 
    
                },{id});
                expect(success).toBe(true);
    
            }); 

            it('full path is directory', async ()=>{

                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    element.value = 'c:/foo/baa';
                    console.log('full path: ' + element.fullPath);

                    return element.fullDirectory === 'c:/foo/baa'; 
    
                },{id});
                expect(success).toBe(true);
    
            }); 

            it('full path is directory with ending slash', async ()=>{

                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    element.value = 'c:/foo/baa/';
                    console.log('full path: ' + element.fullPath);

                    return element.fullDirectory === 'c:/foo/baa'; 
    
                },{id});
                expect(success).toBe(true);
    
            }); 

            it('full path is file path', async ()=>{

                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    element.value = 'c:/foo/baa/qux.txt';
                    console.log('full path: ' + element.fullPath);

                    return element.fullDirectory === 'c:/foo/baa'; 
    
                },{id});
                expect(success).toBe(true);
    
            });            

        });        

        describe('get fullParentDirectory', ()=>{

            it('full path is falsy', async ()=>{

                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    element.value = null;
                    console.log('full path: ' + element.fullPath);

                    return element.fullParentDirectory === null; 
    
                },{id});
                expect(success).toBe(true);
    
            }); 

            it('full path is directory', async ()=>{

                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    element.value = 'c:/foo/baa';
                    console.log('full path: ' + element.fullPath);

                    return element.fullParentDirectory === 'c:/foo'; 
    
                },{id});
                expect(success).toBe(true);
    
            }); 

            it('full path is directory with ending slash', async ()=>{

                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    element.value = 'c:/foo/baa/';
                    console.log('full path: ' + element.fullPath);

                    return element.fullParentDirectory === 'c:/foo'; 
    
                },{id});
                expect(success).toBe(true);
    
            }); 

            it('full path is file path', async ()=>{

                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    element.value = 'c:/foo/baa/qux.txt';
                    console.log('full path: ' + element.fullPath);

                    return element.fullParentDirectory === 'c:/foo/baa'; 
    
                },{id});
                expect(success).toBe(true);
    
            });            

        });        

        it('set pathMapProvider', async ()=>{

            var success = await page.evaluate(({id})=>{
                var element = document.getElementById(id);

                var textField = document.createElement('input');
                element.__textField = textField;

                var path = '{$workingDir$}/foo';
                element.value = path;
                console.log('full path: ' + element.fullPath);

                var providerIsUndefinedBefore = element.__pathMapProvider === undefined;
                var titleIsPathBefore = element.__textField.title === path;

                var pathMapProviderMock = {
                    pathMap: [{name:'workingDir', value: 'c:/baa'}]
                }
                element.pathMapProvider = pathMapProviderMock;

                console.log('full path with provider: ' + element.fullPath);

                var providerIsSetAfter = element.__pathMapProvider === pathMapProviderMock;
                var titleIsUpdated = element.__textField.title === 'c:/baa/foo';

                return providerIsUndefinedBefore && titleIsPathBefore &&
                    providerIsSetAfter && titleIsUpdated;

            },{id});
            expect(success).toBe(true);

        }); 

        describe('get fullPath', async ()=>{
        
            it('without path map provider', async ()=>{

                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    element.value = 'c:/foo';
    
                    return element.fullPath === element.value;
    
                },{id});
                expect(success).toBe(true);
    
            }); 

            it('with path map provider', async ()=>{

                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    element.value = '{$workingDir$}/baa';

                    var pathMapProviderMock = {
                        pathMap: [{name: 'workingDir', value: 'c:/foo'}]
                    };
                    element.__pathMapProvider = pathMapProviderMock;

                    console.log('full path: ' + element.fullPath);
                        
                    return element.fullPath === 'c:/foo/baa';
    
                },{id});
                expect(success).toBe(true);
    
            }); 
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

