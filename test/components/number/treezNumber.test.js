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

import TreezNumber from '../../../src/components/number/treezNumber.js';

import TestUtils from '../../testUtils.js';

import puppeteerToIstanbul from 'puppeteer-to-istanbul';
import { labeledStatement } from '@babel/types';

jest.setTimeout(100000);

describe('TreezNumber', ()=>{   
    
    var id = 'treez-number';

    var page;      

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
            var property = await page.$eval('#' + id, element=> element.id);       
            expect(property).toBe(id);
         });
        
    });

    describe('Public API', ()=>{  
       
        it('connectedCallback', async ()=>{           
            var success = await page.evaluate(({id})=>{
                var element = document.getElementById(id);

                removeExistingChildren(element);
                var methodCalls = prepareMocks(element);

                element.connectedCallback();

                console.log('call to updateElements with: ' + methodCalls['updateElements']);
               
                var methodsAreCalled = Number.isNaN(methodCalls['updateElements']) &&
                                        (methodCalls['disableElements'] === false) &&
                                        (methodCalls['hideElements'] === false);
                console.log('methods are called:' + methodsAreCalled);              

                var label = element.firstChild;
                var labelIsSet = label.innerText === 'labelText';
                console.log('label is set:' + labelIsSet);  

                var numberInput = element.lastChild;
                var numberInputIsCreated = numberInput.type === 'number';
                console.log('number input is created:' + numberInputIsCreated);

                var inputWidthIsSet = element.inputWidth === '100px';
                console.log('inputWidth is set: ' + inputWidthIsSet);

                var minIsSet = element.min === Number.MIN_SAFE_INTEGER;
                console.log('min is set: ' + minIsSet);

                var maxIsSet = element.max === Number.MAX_SAFE_INTEGER;
                console.log('max is set: ' + maxIsSet);

                return  methodsAreCalled &&                           
                        labelIsSet &&
                        numberInputIsCreated &&
                        inputWidthIsSet &&
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

        describe('attributeChangedCallback', ()=>{

            it('min', async ()=>{
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    var numberInput = element.__numberInput;
    
                    console.log('min before: ' + numberInput.min);
                    var minIsDefaultBefore = numberInput.min === '' + Number.MIN_SAFE_INTEGER;
                    console.log('min is default before: ' + minIsDefaultBefore);                    
    
                    element.attributeChangedCallback('min','oldStringValueMock','newStringValueMock');

                    console.log('min after: ' + numberInput.min);
                    var minIsDefinedAfter = numberInput.min === 'newStringValueMock';
                    console.log('min is defined after: ' + minIsDefinedAfter);                     
    
                    return minIsDefaultBefore &&
                        minIsDefinedAfter;
                },{id});
                expect(success).toBe(true);

            });

            it('max', async ()=>{
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    var numberInput = element.__numberInput;
    
                    console.log('max before: ' + numberInput.max);
                    var maxIsDefaultBefore = numberInput.max === '' + Number.MAX_SAFE_INTEGER;
    
                    element.attributeChangedCallback('max','oldStringValueMock','newStringValueMock');

                    console.log('max after: ' + numberInput.max);
                    var maxIsDefinedAfter = numberInput.max === 'newStringValueMock';                  
    
                    return maxIsDefaultBefore &&
                        maxIsDefinedAfter;
                },{id});
                expect(success).toBe(true);
            });

            it('inputWidth', async ()=>{
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    var numberInput = element.__numberInput;
    
                    console.log('inputWidth before: ' + numberInput.style.width);
                    var inputWidthIsDefaultBefore = numberInput.style.width === '100px';
    
                    element.attributeChangedCallback('input-width','oldStringValueMock','50%');

                    console.log('inputWidth after: ' + numberInput.style.width);
                    var inputWidthIsDefinedAfter = numberInput.style.width === '50%';                  
    
                    return inputWidthIsDefaultBefore &&
                        inputWidthIsDefinedAfter;
                },{id});
                expect(success).toBe(true);
            });
        });

        it('updateElements', async ()=>{     
            
            var success = await page.evaluate(({id})=>{
                var element = document.getElementById(id);

                console.log('number input value before: ' + element.__numberInput.value);

                var valueIsEmptyStringBefore = element.__numberInput.value === '';
                
                element.updateElements(33.3);

                console.log('number input value after: ' + element.__numberInput.value);
                var valueIsDefinedAfter = element.__numberInput.value === '33.3';

                return valueIsEmptyStringBefore &&
                    valueIsDefinedAfter;
            },{id});
            expect(success).toBe(true);
            
        });  

        describe('convertFromStringValue', ()=>{

            it('normal value', async ()=>{                 
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    var value = element.convertFromStringValue('44.4'); 
                    return value === 44.4;
                },{id});
                expect(success).toBe(true);                
            });  

            it('extra zeros', async ()=>{                 
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    var value = element.convertFromStringValue('44.4000'); 
                    return value === 44.4;
                },{id});
                expect(success).toBe(true);                
            });     
            
            it('undefined', async ()=>{                 
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    var value = element.convertFromStringValue(undefined); 
                    return Number.isNaN(value);
                },{id});
                expect(success).toBe(true);                
            });       

            it('null', async ()=>{                 
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    var value = element.convertFromStringValue(null); 
                    return Number.isNaN(value);
                },{id});
                expect(success).toBe(true);                
            });       

            it('empty string', async ()=>{                 
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    var value = element.convertFromStringValue(''); 
                    return Number.isNaN(value);
                },{id});
                expect(success).toBe(true);                
            });       

        });

        describe('convertToStringValue', ()=>{

            it('normal value', async ()=>{  
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    var stringValue = element.convertToStringValue(55.5); 
                    return stringValue === '55.5'; 
                },{id});
                expect(success).toBe(true);                
            });  

            it('undefined is converted to empty string', async ()=>{  
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    var stringValue = element.convertToStringValue(undefined); 
                    return stringValue === ''; 
                },{id});
                expect(success).toBe(true);                
            });  


            it('null is converted to empty string', async ()=>{  
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    var stringValue = element.convertToStringValue(null); 
                    return stringValue === ''; 
                },{id});
                expect(success).toBe(true);                
            });  

            it('Number.NaN is converted to empty string', async ()=>{  
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    var stringValue = element.convertToStringValue(Number.NaN); 
                    return stringValue === ''; 
                },{id});
                expect(success).toBe(true);                
            });  

            it('trailing extra zeros are cut', async ()=>{  
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    var stringValue = element.convertToStringValue(55.5000000); 
                    return stringValue === '55.5'; 
                },{id});
                expect(success).toBe(true);                
            });  

            it('scientific notation is preferred if it is shorter than direct notation', async ()=>{  
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    var stringValue = element.convertToStringValue(10000); 
                    return stringValue === '1e4'; 
                },{id});
                expect(success).toBe(true);                
            });  

            it('scientific notation is not used if it has same length as direct notation', async ()=>{  
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    var stringValue = element.convertToStringValue(100.0); 
                    return stringValue === '100'; 
                },{id});
                expect(success).toBe(true);                
            });  

        });       

        it('disableElements', async ()=>{
           
            var success = await page.evaluate(({id})=>{
                var element = document.getElementById(id);

                var isNotDisabledBefore = element.__numberInput.disabled === false;
                element.disableElements(true);
                var isDisabledAfter = element.__numberInput.disabled === true;

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
                
                var labelIsNotHiddenBefore = element.__label.style.display === '';
                var inputIsNotHiddenBefore = element.__numberInput.style.display === '';
                element.hideElements(true);
                var labelIsHiddenAfter = element.__label.style.display === 'none';
                var inputIsHiddenAfter = element.__numberInput.style.display === 'none';
                return labelIsNotHiddenBefore && inputIsNotHiddenBefore &&
                labelIsHiddenAfter && inputIsHiddenAfter;
            },{id});
            expect(success).toBe(true);             

        });     

        it('updateWidth', async ()=>{
        
            var success = await page.evaluate(({id})=>{
                var element = document.getElementById(id);
              
                var numberInput = element.__numberInput;

                console.log('width before:' + element.style.width);

                var widthIsNotDefinedBefore = element.style.width === '';
                
                element.updateWidth('50%');

                var widthIsDefinedAfter = element.style.width === '50%';
               
                return widthIsNotDefinedBefore && 
                    widthIsDefinedAfter;
            },{id});
            expect(success).toBe(true);             

        }); 
        
        describe('validateValue', ()=>{

            it('value > max', async ()=>{                
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    element.max = 100;
                    var validationState = element.validateValue(101);
                    return validationState.isValid === false;                    
                },{id});
                expect(success).toBe(true);                
            }); 
            
            it('value > MAX_SAFE_INTEGER', async ()=>{                
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    element.max = Number.MAX_SAFE_INTEGER;
                    var validationState = element.validateValue(Number.MAX_SAFE_INTEGER+1);
                    console.log('validation message:' + validationState.errorMessage);

                    return (validationState.isValid === false) && 
                        validationState.errorMessage.includes('MAX_SAFE_INTEGER');                    

                },{id});
                expect(success).toBe(true);                
            });  

            it('value = max', async ()=>{                
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    element.max = 100;
                    var validationState = element.validateValue(100);
                    return validationState.isValid === true;                    
                },{id});
                expect(success).toBe(true);                
            });  

            it('value < min', async ()=>{                 
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    element.min = 0;
                    var validationState = element.validateValue(-1);
                    return validationState.isValid === false; 
                },{id});
                expect(success).toBe(true);
            });

            it('value < MIN_SAFE_INTEGER', async ()=>{                
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    element.min = Number.MIN_SAFE_INTEGER;
                    var validationState = element.validateValue(Number.MIN_SAFE_INTEGER-1);
                    return (validationState.isValid === false) && 
                        validationState.errorMessage.includes('MIN_SAFE_INTEGER');                    

                },{id});
                expect(success).toBe(true);                
            });  
                
            it('value = min', async ()=>{                 
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    element.min = 0;
                    var validationState = element.validateValue(0);
                    return validationState.isValid === true; 
                },{id});
                expect(success).toBe(true);
            }); 

            it('min < value < max', async ()=>{                 
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    element.min = 0;
                    element.max = 100;
                    var validationState = element.validateValue(33);                   
                    return validationState.isValid === true; 
                },{id});
                expect(success).toBe(true);                
            });
            
        });  
        
    });
       
    
    describe('Private API', ()=>{  
       
        describe('__numberInputChanged', async ()=>{

            it('value is valid', async ()=>{
           
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);

                    console.log('value before: ' + element.value)
                    var valueIsNaNBefore = Number.isNaN(element.value);

                    var methodCalls ={}
                    element.validateValue = (value) =>{
                        methodCalls['validateValue'] = value;
                        return {
                            isValid: true, 
                            errorMessage: undefined
                        };
                    };
                  
                    element.__numberInput.value = '33.3';
                    var valueIsNaNBeforeUpdate = Number.isNaN(element.value);

                    element.__numberInputChanged();

                    var valueIsSetAfterUpdate = element.value === 33.3;
                    var validationIsCalled = methodCalls['validateValue'] === 33.3;

                    return valueIsNaNBefore &&
                    valueIsNaNBeforeUpdate &&
                    valueIsSetAfterUpdate &&
                    validationIsCalled;
                },{id});
                expect(success).toBe(true);

            });

            it('value is not valid', async ()=>{
           
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);

                    var valueIsNaNBefore = Number.isNaN(element.value);

                    var methodCalls ={}
                    element.validateValue = (value) =>{
                        methodCalls['validateValue'] = value;
                        return {
                            isValid: false, 
                            errorMessage: 'validationErrorMessageMock'
                        };
                    };
                  
                    element.__numberInput.value = '33.3';
                    var valueIsNaNBeforeUpdate = Number.isNaN(element.value);

                    element.__numberInputChanged();

                    var valueIsNaNAfterUpdate = Number.isNaN(element.value);
                    var validationIsCalled = methodCalls['validateValue'] === 33.3;

                    return valueIsNaNBefore &&
                    valueIsNaNBeforeUpdate &&
                    valueIsNaNAfterUpdate &&
                    validationIsCalled;
                },{id});
                expect(success).toBe(true);

            });


        });

        it('__showErrorState', async ()=>{
            var success = await page.evaluate(({id})=>{
                var element = document.getElementById(id);
                var numberInput = element.__numberInput;

                element.__showErrorState('errorMessage');
                var isOrange = numberInput.style.backgroundColor === 'orange';
                var hasTitle = numberInput.title === 'errorMessage';
               
                return isOrange && hasTitle; 
            },{id});
            expect(success).toBe(true);    
        });

        it('__resetErrorState', async ()=>{
            var success = await page.evaluate(({id})=>{
                var element = document.getElementById(id);
                var numberInput = element.__numberInput;

                numberInput.style.backgroundColor ='blue';
                numberInput.title = 'foo';

                element.__resetErrorState();
                var isWhite = numberInput.style.backgroundColor === 'white';
                var hasNoTitle = numberInput.title === '';
               
                return isWhite && hasNoTitle; 
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

