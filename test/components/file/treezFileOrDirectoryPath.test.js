import CustomElementsMock from '../../customElementsMock.js';
import TreezAbstractPath from '../../../src/components/file/treezAbstractPath.js';
jest.mock('../../../src/components/file/treezAbstractPath.js', function(){
        var constructor = jest.fn();
		constructor.mockImplementation(
			function(){	  
				return this;				
            }
        );       
           
        return constructor;
	}
);

import TreezFileOrDirectoryPath from '../../../src/components/file/treezFileOrDirectoryPath.js';

import TestUtils from '../../testUtils.js';

import puppeteerToIstanbul from 'puppeteer-to-istanbul';

jest.setTimeout(100000);

describe('TreezFileOrDirectoryPath', ()=>{   
    
    var id = 'treez-file-or-directory-path';

    var page;      

    beforeAll(async () => { 
        page = await TestUtils.createBrowserPage(); 
        await page.coverage.startJSCoverage();
        
    }); 

    beforeEach(async () => {
        await TestUtils.clearBody(page);
        await TestUtils.createCustomElement(page, id, 'TreezFileOrDirectoryPath', '../../src/components/file/treezFileOrDirectoryPath.js');
    });
    
    describe('State after construction', ()=>{

        it('id',  async ()=>{   
            var property = await page.$eval('#' + id, element=> element.id);       
            expect(property).toBe(id);
         });           
        
    });

    describe('Public API', ()=>{   
       
        it('connectedCallback', async ()=>{           
            var success = await page.evaluate(({id})=>{
                var element = document.getElementById(id);
                element.label = 'labelText';

                removeExistingChildren(element);
                var methodCalls = prepareMocks(element);

                element.connectedCallback();

                console.log('call to updateElements with:' + methodCalls['updateElements']);

                var methodsAreCalled = (methodCalls['updateElements'] === null) &&
                                        (methodCalls['disableElements'] === false) &&
                                        (methodCalls['hideElements'] === false);
                console.log('methods are called:' + methodsAreCalled);

                var label = element.firstChild;
                var labelIsSet = label.innerText === 'labelText';
                console.log('label is set:' + labelIsSet);

                var containerIsCreated = element.childNodes.length === 2;
                console.log('container is created:' + containerIsCreated);

                var container = element.lastChild;                 

                var leftSpan = container.firstChild;
                var textField = leftSpan.firstChild;
                var textFieldIsCreated = textField.type === 'text';
                console.log('text field is created:' + textFieldIsCreated);

                var rightSpan = container.lastChild;

                var isFileButton = rightSpan.firstChild;
                var isFileButtionIsCreated = isFileButton.type === 'button';
                console.log('isFile button is created:' + isFileButtionIsCreated);

                var browseButton = rightSpan.childNodes[1];
                var browseButtonIsCreated = browseButton.type === 'button';
                console.log('brwose button is created:' + browseButtonIsCreated);

                var executeButton = rightSpan.lastChild;
                var executeButtonIsCreated = executeButton.type === 'button';
                console.log('execute button is created:' + executeButtonIsCreated);
               

                return  methodsAreCalled && 
                        labelIsSet &&
                        containerIsCreated &&                 
                        textFieldIsCreated &&
                        isFileButtionIsCreated &&
                        browseButtonIsCreated &&
                        executeButtonIsCreated;
                   

                function removeExistingChildren(element){
                    element.__label = undefined;
                    element.__container = undefined;
                    while(element.firstChild){
                        element.firstChild.remove();
                    } 
                }                        
                
                function prepareMocks(element){
                    var methodCalls = {};                   
                    element.label = 'labelText';
                    element.updateElements = (value) =>{
                        methodCalls['updateElements'] = value;
                    };
    
                    element.disableElements = (disabled) =>{
                        methodCalls['disableElements'] = disabled;
                    };
    
                    element.hideElements = (hidden) =>{
                        methodCalls['hideElements'] = hidden;
                    };
                    return methodCalls;
                }   

            },{id});
            expect(success).toBe(true);                   

        }); 
        
        it('disableElements', async ()=>{
           
            var success = await page.evaluate(({id})=>{
                var element = document.getElementById(id);
                
                var textField = document.createElement('input');               
                element.__textField = textField;

                var button = document.createElement('button');
                element.__browseButton = button;

                var textFieldIsNotDisabledBefore = element.__textField.disabled === false;
                console.log('text field is not disabled before: ' + textFieldIsNotDisabledBefore);

                var isFileButtonIsNotVisibleBefore = element.__isFileButton.style.display === '';
                console.log('isFile buttion is not visible before: ' + isFileButtonIsNotVisibleBefore);

                var browseButtonIsVisiableBefore = element.__browseButton.style.display === '';
                console.log('browse button is visible before: ' + browseButtonIsVisiableBefore);

                element.disableElements(true);

                var textFieldIsDisabledAfter = element.__textField.disabled === true;
                console.log('text field is disabled after: ' + textFieldIsDisabledAfter);

                var isFileButtonIsNotVisibleAfter = element.__isFileButton.style.display === 'none';
                console.log('isFile button is not visible after: ' + isFileButtonIsNotVisibleAfter);

                var browseButtonIsNotVisiableAfter = element.__browseButton.style.display === 'none';
                console.log('browse button is not visible after: ' + browseButtonIsNotVisiableAfter);

                return textFieldIsNotDisabledBefore && isFileButtonIsNotVisibleBefore && browseButtonIsVisiableBefore && 
                textFieldIsDisabledAfter && isFileButtonIsNotVisibleAfter && browseButtonIsNotVisiableAfter;
            },{id});
            expect(success).toBe(true);                 

        }); 

        
        
    });   
    
    describe('Private API', ()=>{         

        describe('__browseFileOrDirectoryPath', ()=>{

            it('file mode', async ()=>{

                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
    
                    var terminalMock = { 
                        directoryPath: undefined                    
                    };
    
                    var resultMock = 'c:/foo/baa.txt';
    
                    terminalMock.browseFilePath =  (directoryPath) => {
                        terminalMock.directoryPath = directoryPath;
                        return {then: (delegate)=>{
                            delegate(resultMock)
                        }};
                    };             
                    window.treezTerminal = terminalMock;
    
                    element.value = 'c:/qux/foo.txt';
                    console.log('filePath before: ' + element.value);
    
                    element.pathMapProvider = {pathMap: [{name: 'workingDir', fullPath: 'c:/foo'}]};

                    element.__isFileMode = true;
    
                    element.__browseFileOrDirectoryPath();
    
                    console.log('directory Path for dialog: ' + terminalMock.directoryPath);
                    var terminalIsCalled = terminalMock.directoryPath === 'c:/qux';
                    console.log('terminal is called: ' + terminalIsCalled);
    
                    console.log('filePath after: ' + element.value);
    
                    var pathMapIsInjected = element.value === '{$workingDir$}/baa.txt';
                    console.log('pathMap is injected: ' + pathMapIsInjected);                
    
                    return terminalIsCalled && pathMapIsInjected;
    
                },{id});
                expect(success).toBe(true);        
    
            });

            it('directory mode', async ()=>{

                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
    
                    var terminalMock = { 
                        directoryPath: undefined                    
                    };
    
                    var resultMock = 'c:/lib/myDir';
                    terminalMock.browseDirectoryPath =  (directoryPath) => {
                        terminalMock.directoryPath = directoryPath;
                        return {then: (delegate)=>{
                            delegate(resultMock)
                        }};
                    };             
                    window.treezTerminal = terminalMock;
    
                    element.pathMapProvider = {pathMap: [
                            {name: 'workingDir', value: 'c:/foo', fullPath: 'c:/foo'},
                            {name: 'libDir', value: 'c:/lib', fullPath: 'c:/lib'}
                        ]
                    };
    
                    element.value = '{$workingDir$}/qux';
                    element.__isFileMode = false;

                    console.log('value before: ' + element.value);               
    
                    element.__browseFileOrDirectoryPath();
    
                    console.log('directory for dialog: ' + terminalMock.directoryPath);
                    var terminalIsCalled = terminalMock.directoryPath === 'c:/foo';
    
                    console.log('terminal is called: ' + terminalIsCalled);
    
                    console.log('value after: ' + element.value);
    
                    var pathMapIsInjectedToValue = element.value === '{$libDir$}/myDir'
                    
    
                    return terminalIsCalled && pathMapIsInjectedToValue;
    
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

