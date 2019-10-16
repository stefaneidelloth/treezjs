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

import TreezNumber from '../../../src/components/number/treezNumber.js';

import TestUtils from '../../testUtils.js';

import puppeteerToIstanbul from 'puppeteer-to-istanbul';
import { labeledStatement } from '@babel/types';

jest.setTimeout(100000);

describe('TreezNumber', ()=>{   
    
    let id = 'treez-number';

    let page;      

    beforeAll(async () => { 
        page = await TestUtils.createBrowserPage(); 
        await page.coverage.startJSCoverage();
        
    }); 

    beforeEach(async () => {
        await TestUtils.clearBody(page);
        await TestUtils.createCustomElement(page, id, 'TreezNumber', '../../src/components/number/treezNumber.js');
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

                removeExistingChildren(element);
                let methodCalls = prepareMocks(element);

                element.connectedCallback();
               
                let methodsAreCalled = methodCalls['update'] === true;
                console.log('methods are called:' + methodsAreCalled);

                let event = document.createEvent('HTMLEvents');
                event.initEvent('change', false, true);
                element.__numberInput.dispatchEvent(event);

                let numberInputChangedIsCalled =  methodCalls['__numberInputChanged'] === true;

                let label = element.firstChild;
                let labelIsSet = label.innerText === 'labelText';
                console.log('label is set:' + labelIsSet);  

                let numberInput = element.lastChild;
                let numberInputIsCreated = numberInput.type === 'number';
                console.log('number input is created:' + numberInputIsCreated);

                let minIsSet = element.min === Number.MIN_SAFE_INTEGER;
                console.log('min is set: ' + minIsSet);

                let maxIsSet = element.max === Number.MAX_SAFE_INTEGER;
                console.log('max is set: ' + maxIsSet);

                return  methodsAreCalled &&                           
                        labelIsSet &&
                        numberInputIsCreated &&
                        minIsSet &&
                        maxIsSet;                   

                function removeExistingChildren(element){
                    element.__label = undefined;
                    element.__numberInput = undefined;
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

                    element.__numberInputChanged = () =>{
                        methodCalls['__numberInputChanged'] === true;
                    };

                    return methodCalls;
                }   

            },{id});
            expect(success).toBe(true);                   

        });

        describe('attributeChangedCallback', ()=>{

            it('min', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    let numberInput = element.__numberInput;
    
                    console.log('min before: ' + numberInput.min);
                    let minIsDefaultBefore = numberInput.min === '' + Number.MIN_SAFE_INTEGER;
                    console.log('min is default before: ' + minIsDefaultBefore);                    
    
                    element.attributeChangedCallback('min','oldStringValueMock','newStringValueMock');

                    console.log('min after: ' + numberInput.min);
                    let minIsDefinedAfter = numberInput.min === 'newStringValueMock';
                    console.log('min is defined after: ' + minIsDefinedAfter);                     
    
                    return minIsDefaultBefore &&
                        minIsDefinedAfter;
                },{id});
                expect(success).toBe(true);

            });

            it('max', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    let numberInput = element.__numberInput;
    
                    console.log('max before: ' + numberInput.max);
                    let maxIsDefaultBefore = numberInput.max === '' + Number.MAX_SAFE_INTEGER;
    
                    element.attributeChangedCallback('max','oldStringValueMock','newStringValueMock');

                    console.log('max after: ' + numberInput.max);
                    let maxIsDefinedAfter = numberInput.max === 'newStringValueMock';                  
    
                    return maxIsDefaultBefore &&
                        maxIsDefinedAfter;
                },{id});
                expect(success).toBe(true);
            });

        });

        it('updateElements', async ()=>{     
            
            let success = await page.evaluate(({id})=>{
                let element = document.getElementById(id);

                console.log('number input value before: ' + element.__numberInput.value);

                let valueIsEmptyStringBefore = element.__numberInput.value === '';
                
                element.updateElements(33.3);

                console.log('number input value after: ' + element.__numberInput.value);
                let valueIsDefinedAfter = element.__numberInput.value === '33.3';

                return valueIsEmptyStringBefore &&
                    valueIsDefinedAfter;
            },{id});
            expect(success).toBe(true);
            
        });  

        describe('convertFromStringValue', ()=>{

            it('normal value', async ()=>{                 
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    let value = element.convertFromStringValue('44.4'); 
                    return value === 44.4;
                },{id});
                expect(success).toBe(true);                
            });  

            it('extra zeros', async ()=>{                 
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    let value = element.convertFromStringValue('44.4000'); 
                    return value === 44.4;
                },{id});
                expect(success).toBe(true);                
            });     
            
            it('undefined', async ()=>{                 
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    let value = element.convertFromStringValue(undefined); 
                    return Number.isNaN(value);
                },{id});
                expect(success).toBe(true);                
            });       

            it('null', async ()=>{                 
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    let value = element.convertFromStringValue(null); 
                    return Number.isNaN(value);
                },{id});
                expect(success).toBe(true);                
            });       

            it('empty string', async ()=>{                 
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    let value = element.convertFromStringValue(''); 
                    return Number.isNaN(value);
                },{id});
                expect(success).toBe(true);                
            });       

        });

        describe('convertToStringValue', ()=>{

            it('normal value', async ()=>{  
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    let stringValue = element.convertToStringValue(55.5); 
                    return stringValue === '55.5'; 
                },{id});
                expect(success).toBe(true);                
            });  

            it('undefined is converted to empty string', async ()=>{  
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    let stringValue = element.convertToStringValue(undefined); 
                    return stringValue === ''; 
                },{id});
                expect(success).toBe(true);                
            });  


            it('null is converted to empty string', async ()=>{  
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    let stringValue = element.convertToStringValue(null); 
                    return stringValue === ''; 
                },{id});
                expect(success).toBe(true);                
            });  

            it('Number.NaN is converted to empty string', async ()=>{  
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    let stringValue = element.convertToStringValue(Number.NaN); 
                    return stringValue === ''; 
                },{id});
                expect(success).toBe(true);                
            });  

            it('trailing extra zeros are cut', async ()=>{  
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    let stringValue = element.convertToStringValue(55.5000000); 
                    return stringValue === '55.5'; 
                },{id});
                expect(success).toBe(true);                
            });  

            it('scientific notation is preferred if it is shorter than direct notation', async ()=>{  
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    let stringValue = element.convertToStringValue(10000); 
                    return stringValue === '1e4'; 
                },{id});
                expect(success).toBe(true);                
            });  

            it('scientific notation is not used if it has same length as direct notation', async ()=>{  
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    let stringValue = element.convertToStringValue(100.0); 
                    return stringValue === '100'; 
                },{id});
                expect(success).toBe(true);                
            });  

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
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);

                    let isNotDisabledBefore = element.__numberInput.disabled === false;
                    element.disableElements(true);
                    let isDisabledAfter = element.__numberInput.disabled === true;

                    return isNotDisabledBefore &&
                        isDisabledAfter;
                },{id});
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

                    //TODO: mock hide method of TreezLabeledElement ... once
                    //jest directly supports the test of custom web elements
                    //For now it does not seem to mock stuff in browser

                    let labelIsNotHiddenBefore = element.__label.style.display === '';
                    let inputIsNotHiddenBefore = element.__numberInput.style.display === '';
                    element.hideElements(true);
                    let labelIsHiddenAfter = element.__label.style.display === 'none';
                    let inputIsHiddenAfter = element.__numberInput.style.display === 'none';
                    return labelIsNotHiddenBefore && inputIsNotHiddenBefore &&
                        labelIsHiddenAfter && inputIsHiddenAfter;
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
                return   methodCalls['updateWidthFor'] === element.__numberInput;
            },{id});
            expect(success).toBe(true);
        });

        it('updateWidth', async ()=>{
        
            let success = await page.evaluate(({id})=>{
                let element = document.getElementById(id);
              
                let numberInput = element.__numberInput;

                console.log('width before:' + element.style.width);

                let widthIsNotDefinedBefore = element.style.width === '';
                
                element.updateWidth('50%');

                let widthIsDefinedAfter = element.style.width === '50%';
               
                return widthIsNotDefinedBefore && 
                    widthIsDefinedAfter;
            },{id});
            expect(success).toBe(true);             

        }); 
        
        describe('validateValue', ()=>{

            it('value > max', async ()=>{                
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    element.max = 100;
                    let validationState = element.validateValue(101);
                    return validationState.isValid === false;                    
                },{id});
                expect(success).toBe(true);                
            }); 
            
            it('value > MAX_SAFE_INTEGER', async ()=>{                
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    element.max = Number.MAX_SAFE_INTEGER;
                    let validationState = element.validateValue(Number.MAX_SAFE_INTEGER+1);
                    console.log('validation message:' + validationState.errorMessage);

                    return (validationState.isValid === false) && 
                        validationState.errorMessage.includes('MAX_SAFE_INTEGER');                    

                },{id});
                expect(success).toBe(true);                
            });  

            it('value = max', async ()=>{                
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    element.max = 100;
                    let validationState = element.validateValue(100);
                    return validationState.isValid === true;                    
                },{id});
                expect(success).toBe(true);                
            });  

            it('value < min', async ()=>{                 
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    element.min = 0;
                    let validationState = element.validateValue(-1);
                    return validationState.isValid === false; 
                },{id});
                expect(success).toBe(true);
            });

            it('value < MIN_SAFE_INTEGER', async ()=>{                
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    element.min = Number.MIN_SAFE_INTEGER;
                    let validationState = element.validateValue(Number.MIN_SAFE_INTEGER-1);
                    return (validationState.isValid === false) && 
                        validationState.errorMessage.includes('MIN_SAFE_INTEGER');                    

                },{id});
                expect(success).toBe(true);                
            });  
                
            it('value = min', async ()=>{                 
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    element.min = 0;
                    let validationState = element.validateValue(0);
                    return validationState.isValid === true; 
                },{id});
                expect(success).toBe(true);
            }); 

            it('min < value < max', async ()=>{                 
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    element.min = 0;
                    element.max = 100;
                    let validationState = element.validateValue(33);                   
                    return validationState.isValid === true; 
                },{id});
                expect(success).toBe(true);                
            });
            
        });  
        
    });
       
    
    describe('Private API', ()=>{  
       
        describe('__numberInputChanged', ()=>{

            it('value is valid', async ()=>{
           
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);

                    console.log('value before: ' + element.value)
                    let valueIsNaNBefore = Number.isNaN(element.value);

                    let methodCalls ={}
                    element.validateValue = (value) =>{
                        methodCalls['validateValue'] = value;
                        return {
                            isValid: true, 
                            errorMessage: undefined
                        };
                    };
                  
                    element.__numberInput.value = '33.3';
                    let valueIsNaNBeforeUpdate = Number.isNaN(element.value);

                    let eventMock = {stopPropagation: () =>{}};
                    element.__numberInputChanged(eventMock);

                    let valueIsSetAfterUpdate = element.value === 33.3;
                    let validationIsCalled = methodCalls['validateValue'] === 33.3;

                    return valueIsNaNBefore &&
                    valueIsNaNBeforeUpdate &&
                    valueIsSetAfterUpdate &&
                    validationIsCalled;
                },{id});
                expect(success).toBe(true);

            });

            it('value is not valid', async ()=>{
           
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);

                    let valueIsNaNBefore = Number.isNaN(element.value);

                    let methodCalls ={}
                    element.validateValue = (value) =>{
                        methodCalls['validateValue'] = value;
                        return {
                            isValid: false, 
                            errorMessage: 'validationErrorMessageMock'
                        };
                    };
                  
                    element.__numberInput.value = '33.3';
                    let valueIsNaNBeforeUpdate = Number.isNaN(element.value);

                    let eventMock = {stopPropagation: () =>{}};
                    element.__numberInputChanged(eventMock);

                    let valueIsNaNAfterUpdate = Number.isNaN(element.value);
                    let validationIsCalled = methodCalls['validateValue'] === 33.3;

                    return valueIsNaNBefore &&
                    valueIsNaNBeforeUpdate &&
                    valueIsNaNAfterUpdate &&
                    validationIsCalled;
                },{id});
                expect(success).toBe(true);

            });

        });

        it('__showErrorState', async ()=>{
            let success = await page.evaluate(({id})=>{
                let element = document.getElementById(id);
                let numberInput = element.__numberInput;

                element.__showErrorState('errorMessage');
                let isOrange = numberInput.style.backgroundColor === 'orange';
                let hasTitle = numberInput.title === 'errorMessage';
               
                return isOrange && hasTitle; 
            },{id});
            expect(success).toBe(true);    
        });

        it('__resetErrorState', async ()=>{
            let success = await page.evaluate(({id})=>{
                let element = document.getElementById(id);
                let numberInput = element.__numberInput;

                numberInput.style.backgroundColor ='blue';
                numberInput.title = 'foo';

                element.__resetErrorState();
                let isWhite = numberInput.style.backgroundColor === 'white';
                let hasNoTitle = numberInput.title === '';
               
                return isWhite && hasNoTitle; 
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

