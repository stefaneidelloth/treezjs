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

import Color from '../../../src/components/color/color.js'; //TODO: mock after jest supports testing custom components

import TreezColor from '../../../src/components/color/treezColor.js';

import TestUtils from '../../testUtils.js';

import puppeteerToIstanbul from 'puppeteer-to-istanbul';

jest.setTimeout(100000);

describe('TreezColor', ()=>{   
    
    var id = 'treez-color';

    var page;      

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
            var property = await page.$eval('#' + id, element=> element.id);       
            expect(property).toBe(id);
         });           
        
    });

    describe('Public API', ()=>{         
       
        it('connectedCallback', async ()=>{                         

            var success = await page.evaluate(({id})=>{ 

                var color = window.Color.blue;

                var element = document.getElementById(id);                
                removeExistingAttributesAndChildren(element);
                var methodCalls = prepareMocks(element);

                element.connectedCallback();

                var methodsAreCalled = (methodCalls['updateElements'] === color) &&
                                        (methodCalls['disableElements'] === false) &&
                                        (methodCalls['hideElements'] === false);
                console.log('methods are called: ' + methodsAreCalled);

                var containerIsCreated = element.childNodes.length === 1;
                console.log('container is created: ' + containerIsCreated);

                var container = element.firstChild;

                var label = container.firstChild;
                var labelIsCreated = label.constructor.name === 'HTMLLabelElement';
                var labelIsSet = label.innerText === 'labelText';
                console.log('label is created and set: ' + (labelIsCreated && labelIsSet));

                var colorPicker = container.lastChild;
                var colorPickerIsCreated = colorPicker.type === 'color';  
                console.log('color picker is created: ' + (colorPickerIsCreated));

                return containerIsCreated && 
                    labelIsCreated &&
                    labelIsSet &&
                    colorPickerIsCreated &&
                    methodsAreCalled;


                function removeExistingAttributesAndChildren(element){
                    element.__container = undefined;
                    element.__label = undefined;
                    element.__colorPicker = undefined;
                    while(element.firstChild){
                        element.firstChild.remove();
                    }   
                }

                function prepareMocks(element){
                    var methodCalls = {};
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
                    return methodCalls;
                }  

            },{id});

            expect(success).toBe(true);                   

        });       
       
        it('updateElements', async ()=>{           
            var success = await page.evaluate(({id})=>{
                var element = document.getElementById(id);

                var colorPicker = element.__colorPicker;

                console.log('initial color value: ' + colorPicker.value);
                var valueIsBlackBefore = colorPicker.value === window.Color.black.hexString;
                console.log('value is black before: ' + valueIsBlackBefore);

                console.log('initial title: ' + colorPicker.title);
                var titleIsBlackBefore = colorPicker.title === "black";
                console.log('title is black before: ' + titleIsBlackBefore);
                
                var color = window.Color.blue;
                element.updateElements(color);

                var valueIsDefinedAfter = colorPicker.value === color.hexString;
                console.log('value is defined after: ' + valueIsDefinedAfter);

                var titleIsDefinedAfter = colorPicker.title === color.name;
                console.log('title is defined after: ' + titleIsDefinedAfter);

                return valueIsBlackBefore && titleIsBlackBefore &&
                        valueIsDefinedAfter && titleIsDefinedAfter;
            },{id});
            expect(success).toBe(true);
        });  

        it('disableElements', async ()=>{
           
            var success = await page.evaluate(({id})=>{
                var element = document.getElementById(id);

                var isNotDisabledBefore = element.__colorPicker.disabled === false;
                element.disableElements(true);
                var isDisabledAfter = element.__colorPicker.disabled === true;

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

                var defaultValue = element.convertFromStringValue(null);
                console.log('default value: ' + defaultValue);

                var blueValue = element.convertFromStringValue('#0000ff'); 
                console.log('blue value: ' + blueValue);

                var customValue = element.convertFromStringValue('#112233');  
                console.log('custom value: ' + customValue);             

                return  (defaultValue = window.Color.black) &&
                        (blueValue === window.Color.blue) &&
                        (customValue.hexString === '#112233' && customValue.name === 'custom'); 

            },{id});
            expect(success).toBe(true);                       

        }); 
         
        it('convertToStringValue', async ()=>{

            var success = await page.evaluate(({id})=>{
                var element = document.getElementById(id);

                var colorMock = {hexString: '#112233'}

                var colorString = element.convertToStringValue(colorMock); 

                return (colorString === '#112233') 

            },{id});
            expect(success).toBe(true);

        });          
        
        describe('set value', async () =>{

            it('set value with Color instance', async () =>{
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                         
                    element.value = window.Color.blue; 
    
                    return (element.getAttribute('value') === '#0000ff'); 
    
                },{id});
                expect(success).toBe(true);
            });

            it('set value with color string', async () =>{
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                         
                    element.value = 'blue'; 
    
                    return (element.getAttribute('value') === '#0000ff'); 
    
                },{id});
                expect(success).toBe(true);
            });

        });        
        
    });   

  
    
    describe('Private API', ()=>{          
       
        it('__colorChanged', async ()=>{
           
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);

                    console.log('initial element value: ' + element.value);
                    var valueisBlackBefore = element.value === window.Color.black;                    

                    element.__colorPicker.value = window.Color.blue.hexString;

                    var valueIsBlackBeforeUpdate = element.value === window.Color.black;

                    element.__colorChanged();

                    var valueIsSetAfterUpdate = element.value === window.Color.blue;

                    return valueisBlackBefore &&
                    valueIsBlackBeforeUpdate &&
                    valueIsSetAfterUpdate;
                },{id});
                expect(success).toBe(true);

        });

        describe('__getHexStringFromStringColor', ()=>{

            it('hex string', () =>{
                expect(TreezColor.__getHexStringFromStringColor('#112233')).toBe('#112233');               
            });

            it('named color string', () =>{
                expect(TreezColor.__getHexStringFromStringColor('blue')).toBe('#0000ff');
            });

            it('unknown color name', () =>{  
                expect(()=>{TreezColor.__getHexStringFromStringColor('lightblue')}).toThrowError();
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

