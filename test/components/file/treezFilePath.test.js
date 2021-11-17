import CustomElementsMock from '../../customElementsMock.js';
import TreezAbstractPath from '../../../src/components/file/treezAbstractPath.js';
jest.mock('../../../src/components/file/treezAbstractPath.js', function(){
        let constructor = jest.fn();
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
    
    let id = 'treez-file-path';

    let page;      

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
            let property = await page.$eval('#' + id, element=> element.id);       
            expect(property).toBe(id);
         });           
        
    });

    describe('Public API', ()=>{   
       
        it('connectedCallback', async ()=>{           
            let success = await page.evaluate(({id})=>{
                let element = document.getElementById(id);
                element.label = 'labelText';

                removeExistingChildren(element);
                let methodCalls = prepareMocks(element);

                element.connectedCallback();

                console.log('call to updateElements with:' + methodCalls['updateElements']);

                let methodsAreCalled = (methodCalls['update'] === true);
                console.log('methods are called:' + methodsAreCalled);

                let event = document.createEvent('HTMLEvents');
                event.initEvent('change', false, true);
                element.__textField.dispatchEvent(event);
                let textFieldChangedIsCalled = methodCalls['textFieldChanged'] === true;

                let clickEvent = document.createEvent('HTMLEvents');
                clickEvent.initEvent('click', false, true);

                element.__browseButton.dispatchEvent(clickEvent);
                let browseFilePathIsCalled = methodCalls['__browseFilePath'] === true;

                element.__executeButton.dispatchEvent(clickEvent);
                let executeIsCalled = methodCalls['execute'] === true;

                let label = element.firstChild;
                let labelIsSet = label.innerText === 'labelText';
                console.log('label is set:' + labelIsSet);

                let containerIsCreated = element.childNodes.length === 2;
                console.log('container is created:' + containerIsCreated);

                let container = element.lastChild;                 

                let leftSpan = container.firstChild;
                let textField = leftSpan.firstChild;
                let textFieldIsCreated = textField.type === 'text';

                let rightSpan = container.lastChild;
                let browseButton = rightSpan.firstChild;
                let browseButtonIsCreated = browseButton.type === 'button';

                let executeButton = rightSpan.lastChild;
                let executeButtonIsCreated = executeButton.type === 'button';               

                return  methodsAreCalled &&
                        textFieldChangedIsCalled &&
                        browseFilePathIsCalled &&
                        executeIsCalled &&
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
                    let methodCalls = {};                   
                    element.label = 'labelText';

                    element.update = () =>{
                        methodCalls['update'] = true;
                    };

                    element.textFieldChanged = () =>{
                        methodCalls['textFieldChanged'] = true;
                    };
    
                    element.__browseFilePath = () =>{
                        methodCalls['__browseFilePath'] = true;
                    };
    
                    element.execute = () =>{
                        methodCalls['execute'] = true;
                    };
                    return methodCalls;
                }   

            },{id});
            expect(success).toBe(true);                   

        });       

        
        
    });   
    
    describe('Private API', ()=>{         

        it('__browseFilePath', async ()=>{

            let success = await page.evaluate(({id})=>{
                let element = document.getElementById(id);

                let terminalMock = { 
                    directoryPath: undefined                    
                };

                let resultMock = 'c:/foo/baa.txt';

                terminalMock.browseFilePath =  (directoryPath) => {
                    terminalMock.directoryPath = directoryPath;
                    return {then: (delegate)=>{
                        delegate(resultMock)
                    }};
                };             
                window.treezTerminal = terminalMock;

                element.value = 'c:/qux/foo.txt';
                console.log('filePath before: ' + element.value);

                element.pathMapProvider = {pathMap: [{name: 'workingDir', resolvedPath: 'c:/foo'}]};

                element.__browseFilePath();

                console.log('directory Path for dialog: ' + terminalMock.directoryPath);
                let terminalIsCalled = terminalMock.directoryPath === 'c:/qux';
                console.log('terminal is called: ' + terminalIsCalled);

                console.log('filePath after: ' + element.value);

                let pathMapIsInjected = element.value === '{$workingDir$}/baa.txt';
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

