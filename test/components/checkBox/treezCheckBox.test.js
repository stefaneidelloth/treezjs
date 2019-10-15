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

import TreezCheckBox from '../../../src/components/checkbox/treezCheckBox.js';

import TestUtils from '../../testUtils.js';

import puppeteerToIstanbul from 'puppeteer-to-istanbul';

jest.setTimeout(10000);

describe('TreezCheckBox', ()=>{   
    
    let id = 'treez-check-box';

    let page;      

    beforeAll(async () => { 
        page = await TestUtils.createBrowserPage(); 
        await page.coverage.startJSCoverage();
        
    }); 

    beforeEach(async () => {
        await TestUtils.clearBody(page);
        await TestUtils.createCustomElement(page, id, 'TreezCheckBox', '../../src/components/checkBox/treezCheckBox.js');
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

                let methodsAreCalled = (methodCalls['updateElements'] === true) &&
                (methodCalls['disableElements'] === false) &&
                (methodCalls['hideElements'] === false);
                console.log('methods are called:' + methodsAreCalled);

                let event = document.createEvent('HTMLEvents');
                event.initEvent('change', false, true);
                element.__checkBox.dispatchEvent(event);

                let changedMethodIsCalled = methodCalls['__checkBoxChanged'] === true;

                let containerIsCreated = element.childNodes.length === 1;
                console.log('container is created:' + containerIsCreated);

                let container = element.firstChild;
                let checkBox = container.firstChild;
                let checkBoxIsCreated = checkBox.type === 'checkbox';
                console.log('checkBox is created:' + checkBoxIsCreated);

                let label = container.lastChild;
                let labelIsSet = label.innerText === 'labelText';
                console.log('label is set:' + labelIsSet);               

                return containerIsCreated && 
                    checkBoxIsCreated &&
                    labelIsSet &&
                    methodsAreCalled &&
                    changedMethodIsCalled;

                function removeExistingChildren(element){
                    element.__checkBox = undefined;
                    while(element.firstChild){
                        element.firstChild.remove();
                    } 
                }                        
                
                function prepareMocks(element){
                    let methodCalls = {};
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

                    element.__checkBoxChanged = () =>{
                        methodCalls['__checkBoxChanged'] = true;
                    };

                    return methodCalls;
                }   

            },{id});
            expect(success).toBe(true);                   

        });
       
        it('updateElements', async ()=>{           
            let success = await page.evaluate(({id})=>{
                let element = document.getElementById(id);

                let isNotCheckedBefore = element.__checkBox.checked === false;
                element.updateElements(true);
                let isCheckedAfter = element.__checkBox.checked === true;

                return isNotCheckedBefore &&
                    isCheckedAfter;
            },{id});
            expect(success).toBe(true);
        });

        it('updateContentWidth', async ()=>{
            let success = await page.evaluate(({id})=>{
                let element = document.getElementById(id);

                let methodCalls = {};
                element.updateWidthFor = (element, width) =>{
                    methodCalls['updateWidthFor'] = element;
                };

                element.updateContentWidth('widthMock');
                return   methodCalls['updateWidthFor'] === element.__checkBox;
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
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);

                    let isNotDisabledBefore = element.__checkBox.disabled === false;
                    element.disableElements(true);
                    let isDisabledAfter = element.__checkBox.disabled === true;

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

                    let isNotHiddenBefore = element.__container.style.display === '';
                    element.hideElements(true);
                    let isHiddenAfter = element.__container.style.display === 'none';
                    return isNotHiddenBefore &&
                        isHiddenAfter;
                },{id});
                expect(success).toBe(true);
            });
        });
        
        it('convertFromStringValue', async ()=>{
           
            let success = await page.evaluate(({id})=>{
                let element = document.getElementById(id);

                let falseValue = element.convertFromStringValue(null); //only null is interpreted as false

                let trueValue1 = element.convertFromStringValue('false');

                let trueValue2 = element.convertFromStringValue('');

                let trueValue3 = element.convertFromStringValue('true');

                return (falseValue === false) &&
                        (trueValue1 === true) &&
                        (trueValue2 === true) &&
                        (trueValue3 === true);

            },{id});
            expect(success).toBe(true);                       

        }); 
        
        it('convertToStringValue', async ()=>{

            let success = await page.evaluate(({id})=>{
                let element = document.getElementById(id);

                let emptyString1 = element.convertToStringValue(true); 

                let emptyString2 = element.convertToStringValue(1); 

                let nullValue = element.convertToStringValue(false);                

                return (emptyString1 === '') &&
                        (emptyString2 === '') &&
                        (nullValue === null);

            },{id});
            expect(success).toBe(true);

        }); 
        
    });   
    
    describe('Private API', ()=>{  
       
        it('__checkBoxChanged', async ()=>{
           
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);

                    let valueisFalseBefore = element.value === false;
                    element.__checkBox.checked = true;
                    let valueIsFalseBeforeUpdate = element.value === false;

                    element.__checkBoxChanged();

                    let valueIsTrueAfterUpdate = element.value === true;

                    return valueisFalseBefore &&
                            valueIsFalseBeforeUpdate &&
                            valueIsTrueAfterUpdate;
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

