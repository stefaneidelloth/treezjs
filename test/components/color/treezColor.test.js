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

import TreezCheckBox from '../../../src/components/checkbox/treezCheckBox.js';

import TestUtils from '../../testUtils.js';

import puppeteerToIstanbul from 'puppeteer-to-istanbul';

jest.setTimeout(10000);

describe('TreezCheckBox', ()=>{   
    
    var id = 'treez-check-box';

    var page;      

    beforeAll(async () => { 
        page = await TestUtils.createBrowserPage(); 
        await page.coverage.startJSCoverage();
        
    }); 

    beforeEach(async () => {
        await TestUtils.clearBody(page);
        await TestUtils.createCustomElement(page, id, 'TreezCheckBox', '../../src/components/checkbox/treezCheckBox.js');
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

                //remove existing children
                element.__checkBox = undefined;
                while(element.firstChild){
                    element.firstChild.remove();
                }                

                //prepare mocks 
                var methodCalls = {};
                element.value = true;
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

                //recreate children
                element.connectedCallback();

                //checks
                var containerIsCreated = element.childNodes.length === 1;

                var container = element.firstChild;
                var checkBox = container.firstChild;
                var checkBoxIsCreated = checkBox.type === 'checkbox';

                var label = container.lastChild;
                var labelIsSet = label.innerText === 'labelText';

                var methodsAreCalled = (methodCalls['updateElements'] === true) &&
                                        (methodCalls['disableElements'] === false) &&
                                        (methodCalls['hideElements'] === false);

                return containerIsCreated && 
                    checkBoxIsCreated &&
                    labelIsSet &&
                    methodsAreCalled;

            },{id});
            expect(success).toBe(true);                   

        });
       
        it('updateElements', async ()=>{           
            var success = await page.evaluate(({id})=>{
                var element = document.getElementById(id);

                var isNotCheckedBefore = element.__checkBox.checked === false;
                element.updateElements(true);
                var isCheckedAfter = element.__checkBox.checked === true;

                return isNotCheckedBefore &&
                    isCheckedAfter;
            },{id});
            expect(success).toBe(true);
        });  

        it('disableElements', async ()=>{
           
            var success = await page.evaluate(({id})=>{
                var element = document.getElementById(id);

                var isNotDisabledBefore = element.__checkBox.disabled === false;
                element.disableElements(true);
                var isDisabledAfter = element.__checkBox.disabled === true;

                return isNotDisabledBefore &&
                    isDisabledAfter;
            },{id});
            expect(success).toBe(true);                 

        }); 

        it('hideElements', async ()=>{
        
            var success = await page.evaluate(({id})=>{
                var element = document.getElementById(id);

                //TODO: mock hide method of TreezLabeledElement ... once
                //jest directly supports the test of custom web elements
                //For now it does not seem to mock stuff in browser
                
                var isNotHiddenBefore = element.__container.style.display === '';
                element.hideElements(true);
                var isHiddenAfter = element.__container.style.display === 'none';
                return isNotHiddenBefore &&
                    isHiddenAfter;
            },{id});
            expect(success).toBe(true);             

        }); 
        
        it('convertFromStringValue', async ()=>{
           
            var success = await page.evaluate(({id})=>{
                var element = document.getElementById(id);

                var falseValue = element.convertFromStringValue(null); //only null is interpreted as false

                var trueValue1 = element.convertFromStringValue('false');

                var trueValue2 = element.convertFromStringValue('');

                var trueValue3 = element.convertFromStringValue('true');

                return (falseValue === false) &&
                        (trueValue1 === true) &&
                        (trueValue2 === true) &&
                        (trueValue3 === true);

            },{id});
            expect(success).toBe(true);                       

        }); 
        
        it('convertToStringValue', async ()=>{

            var success = await page.evaluate(({id})=>{
                var element = document.getElementById(id);

                var emptyString1 = element.convertToStringValue(true); 

                var emptyString2 = element.convertToStringValue(1); 

                var nullValue = element.convertToStringValue(false);                

                return (emptyString1 === '') &&
                        (emptyString2 === '') &&
                        (nullValue === null);

            },{id});
            expect(success).toBe(true);

        }); 
        
    });   
    
    describe('Private API', ()=>{  
       
        it('__checkBoxChanged', async ()=>{
           
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);

                    var valueisFalseBefore = element.value === false;
                    element.__checkBox.checked = true;
                    var valueIsFalseBeforeUpdate = element.value === false;

                    element.__checkBoxChanged();

                    var valueIsTrueAfterUpdate = element.value === true;

                    return valueisFalseBefore &&
                            valueIsFalseBeforeUpdate &&
                            valueIsTrueAfterUpdate;
                },{id});
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

