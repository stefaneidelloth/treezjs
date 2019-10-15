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

import TreezFilePath from '../../../src/components/file/treezFilePath.js';

import TestUtils from '../../testUtils.js';

import puppeteerToIstanbul from 'puppeteer-to-istanbul';

jest.setTimeout(100000);

describe('TreezFilePath', ()=>{   
    
    var id = 'treez-file-path';

    var page;      

    beforeAll(async () => { 
        page = await TestUtils.createBrowserPage(); 
        await page.coverage.startJSCoverage();
        
    }); 

    beforeEach(async () => {
        await TestUtils.clearBody(page);
        await TestUtils.createCustomElement(page, id, 'TreezFilePath', '../../src/components/file/treezFilePath.js');
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

                var rightSpan = container.lastChild;
                var browseButton = rightSpan.firstChild;
                var browseButtonIsCreated = browseButton.type === 'button';

                var executeButton = rightSpan.lastChild;
                var executeButtonIsCreated = executeButton.type === 'button';
               

                return  methodsAreCalled && 
                        labelIsSet &&
                        containerIsCreated &&                 
                        textFieldIsCreated &&
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

        
        
    });   
    
    describe('Private API', ()=>{         

        it('__browseFilePath', async ()=>{

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

                element.__browseFilePath();

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

