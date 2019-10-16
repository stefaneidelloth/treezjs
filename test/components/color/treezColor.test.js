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

import Color from '../../../src/components/color/color.js'; //TODO: mock after jest supports testing custom components

import TreezColor from '../../../src/components/color/treezColor.js';

import TestUtils from '../../testUtils.js';

import puppeteerToIstanbul from 'puppeteer-to-istanbul';

jest.setTimeout(100000);

describe('TreezColor', ()=>{   
    
    let id = 'treez-color';

    let page;      

    beforeAll(async () => { 
        page = await TestUtils.createBrowserPage(); 
        await page.coverage.startJSCoverage();
        
    }); 

    beforeEach(async () => {
        await TestUtils.clearBody(page);
        await TestUtils.createCustomElement(page, id, 'TreezColor', '../../src/components/color/treezColor.js');
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

                let color = window.Color.blue;

                let element = document.getElementById(id);                
                removeExistingAttributesAndChildren(element);
                let methodCalls = prepareMocks(element);

                element.connectedCallback();

                let methodsAreCalled = (methodCalls['updateElements'] === color) &&
                                        (methodCalls['disableElements'] === false) &&
                                        (methodCalls['hideElements'] === false);
                console.log('methods are called: ' + methodsAreCalled);

                let event = document.createEvent('HTMLEvents');
                event.initEvent('change', false, true);
                element.__colorPicker.dispatchEvent(event);
                let changedMethodIsCalled = methodCalls['__colorChanged'] === true;

                let containerIsCreated = element.childNodes.length === 1;
                console.log('container is created: ' + containerIsCreated);

                let container = element.firstChild;

                let label = container.firstChild;
                let labelIsCreated = label.constructor.name === 'HTMLLabelElement';
                let labelIsSet = label.innerText === 'labelText';
                console.log('label is created and set: ' + (labelIsCreated && labelIsSet));

                let colorPicker = container.lastChild;
                let colorPickerIsCreated = colorPicker.type === 'color';  
                console.log('color picker is created: ' + (colorPickerIsCreated));

                return containerIsCreated && 
                    labelIsCreated &&
                    labelIsSet &&
                    colorPickerIsCreated &&
                    methodsAreCalled &&
                    changedMethodIsCalled;


                function removeExistingAttributesAndChildren(element){
                    element.__container = undefined;
                    element.__label = undefined;
                    element.__colorPicker = undefined;
                    while(element.firstChild){
                        element.firstChild.remove();
                    }   
                }

                function prepareMocks(element){
                    let methodCalls = {};
                    element.value = color;
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

                    element.__colorChanged = ()=>{
                      methodCalls['__colorChanged'] = true;
                    };
                    return methodCalls;
                }  

            },{id});

            expect(success).toBe(true);                   

        });       
       
        it('updateElements', async ()=>{           
            let success = await page.evaluate(({id})=>{
                let element = document.getElementById(id);

                let colorPicker = element.__colorPicker;

                console.log('initial color value: ' + colorPicker.value);
                let valueIsBlackBefore = colorPicker.value === window.Color.black.hexString;
                console.log('value is black before: ' + valueIsBlackBefore);

                console.log('initial title: ' + colorPicker.title);
                let titleIsBlackBefore = colorPicker.title === "black";
                console.log('title is black before: ' + titleIsBlackBefore);
                
                let color = window.Color.blue;
                element.updateElements(color);

                let valueIsDefinedAfter = colorPicker.value === color.hexString;
                console.log('value is defined after: ' + valueIsDefinedAfter);

                let titleIsDefinedAfter = colorPicker.title === color.name;
                console.log('title is defined after: ' + titleIsDefinedAfter);

                return valueIsBlackBefore && titleIsBlackBefore &&
                        valueIsDefinedAfter && titleIsDefinedAfter;
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
                return   methodCalls['updateWidthFor'] === element.__colorPicker;
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

                    let isNotDisabledBefore = element.__colorPicker.disabled === false;
                    element.disableElements(true);
                    let isDisabledAfter = element.__colorPicker.disabled === true;

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

        describe('convertFromStringValue',  ()=>{

            it('predefined color', async ()=>{

                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);

                    let defaultValue = element.convertFromStringValue(null);
                    console.log('default value: ' + defaultValue);

                    let blueValue = element.convertFromStringValue('#0000ff');
                    console.log('blue value: ' + blueValue);

                    return  (defaultValue = window.Color.black) &&
                        (blueValue === window.Color.blue);

                },{id});
                expect(success).toBe(true);

            });

            it('custom color', async ()=>{

                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);

                    let customValue = element.convertFromStringValue('#112233');
                    console.log('custom value: ' + customValue);

                    return  (customValue.hexString === '#112233' && customValue.name === 'custom');

                },{id});
                expect(success).toBe(true);

            });
        });
         
        it('convertToStringValue', async ()=>{

            let success = await page.evaluate(({id})=>{
                let element = document.getElementById(id);

                let colorMock = {hexString: '#112233'}

                let colorString = element.convertToStringValue(colorMock); 

                return (colorString === '#112233') 

            },{id});
            expect(success).toBe(true);

        });          
        
        describe('set value',  () =>{

            it('set value with Color instance', async () =>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                         
                    element.value = window.Color.blue; 
    
                    return (element.getAttribute('value') === '#0000ff'); 
    
                },{id});
                expect(success).toBe(true);
            });

            it('set value with color string', async () =>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                         
                    element.value = 'blue'; 
    
                    return (element.getAttribute('value') === '#0000ff'); 
    
                },{id});
                expect(success).toBe(true);
            });

        });        
        
    });   

  
    
    describe('Private API', ()=>{          
       
        it('__colorChanged', async ()=>{
           
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);

                    console.log('initial element value: ' + element.value);
                    let valueisBlackBefore = element.value === window.Color.black;                    

                    element.__colorPicker.value = window.Color.blue.hexString;

                    let valueIsBlackBeforeUpdate = element.value === window.Color.black;

                    element.__colorChanged();

                    let valueIsSetAfterUpdate = element.value === window.Color.blue;

                    return valueisBlackBefore &&
                    valueIsBlackBeforeUpdate &&
                    valueIsSetAfterUpdate;
                },{id});
                expect(success).toBe(true);

        });

        describe('__getHexStringFromStringColor', ()=>{

            it('hex string', async () =>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    let hexString = element.constructor.__getHexStringFromStringColor('#1100ff');
                    return hexString === '#1100ff';
                },{id});
                expect(success).toBe(true);

            });

            it('named color string', async() =>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    let hexString = element.constructor.__getHexStringFromStringColor('blue');
                    return hexString === '#0000ff';
                },{id});
                expect(success).toBe(true);
            });

            it('unknown color name', async () =>{

                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    try{
                        element.constructor.__getHexStringFromStringColor('lightblue');
                        return false;
                    } catch(error){
                        return true;
                    }

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

