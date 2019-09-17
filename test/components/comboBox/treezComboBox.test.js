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

import TreezComboBox from '../../../src/components/comboBox/treezComboBox.js';

import TestUtils from '../../testUtils.js';

import puppeteerToIstanbul from 'puppeteer-to-istanbul';

jest.setTimeout(100000);

describe('TreezComboBox', ()=>{   
    
    var id = 'treez-combo-box';

    var page;      

    beforeAll(async () => { 
        page = await TestUtils.createBrowserPage(); 
        await page.coverage.startJSCoverage();
        
    }); 

    beforeEach(async () => {
        await TestUtils.clearBody(page);
        await TestUtils.createCustomElement(page, id, 'TreezComboBox', '../../src/components/comboBox/treezComboBox.js');
    });
    
    describe('State after construction', ()=>{

        it('id',  async ()=>{   
            var property = await page.$eval('#' + id, element=> element.id);       
            expect(property).toBe(id);
         });           
        
    });

    describe('Public API', ()=>{ 
        
        it('observedAttributes', ()=>{                        
            expect(TreezComboBox.observedAttributes).toEqual(['mockedObservedAttribute','options']);
        }); 
       
        it('connectedCallback', async ()=>{           
            var success = await page.evaluate(({id})=>{
                var element = document.getElementById(id);

                removeExistingChildren(element);
                var methodCalls = prepareMocks(element);

                element.connectedCallback();

                console.log('call to updateElements with:' + methodCalls['updateElements']);

                var methodsAreCalled = (methodCalls['updateElements'] === null) &&
                                        (methodCalls['disableElements'] === false) &&
                                        (methodCalls['hideElements'] === false);
                console.log('methods are called:' + methodsAreCalled);

                var containerIsCreated = element.childNodes.length === 1;
                console.log('container is created:' + containerIsCreated);

                var container = element.firstChild;

                var label = container.firstChild;
                var labelIsSet = label.innerText === 'labelText';
                console.log('label is set:' + labelIsSet);  

                var comboBox = container.lastChild;
                var comboBoxIsCreated = comboBox.constructor.name === 'HTMLSelectElement';
                console.log('comboBox is created:' + comboBoxIsCreated);

                return  methodsAreCalled && 
                        containerIsCreated &&                 
                        labelIsSet &&
                        comboBoxIsCreated;
                   

                function removeExistingChildren(element){
                    element.__comboBox = undefined;
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
       
        describe('updateElements', async ()=>{     
            
            it('without options', async () => {
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
    
                    console.log('combo box value before: ' + element.__comboBox.value);
    
                    var valueIsEmptyStringBefore = element.__comboBox.value === '';
                    element.updateElements('foo');
    
                    console.log('combo box value after: ' + element.__comboBox.value);
                    var valueIsStillNotDefinedAfter = element.__comboBox.value === '';
    
                    return valueIsEmptyStringBefore &&
                    valueIsStillNotDefinedAfter;
                },{id});
                expect(success).toBe(true);
            });

            it('with options', async () => {
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
    
                    console.log('combo box value before: ' + element.__comboBox.value);
    
                    var valueIsEmptyStringBefore = element.__comboBox.value === '';
                    element.options = 'foo,baa';
                    element.updateElements('foo');
    
                    console.log('combo box value after: ' + element.__comboBox.value);
                    var valueIsDefinedAfter = element.__comboBox.value === 'foo';
    
                    return valueIsEmptyStringBefore &&
                    valueIsDefinedAfter;
                },{id});
                expect(success).toBe(true);
            });
            
        });  

        it('disableElements', async ()=>{
           
            var success = await page.evaluate(({id})=>{
                var element = document.getElementById(id);

                var isNotDisabledBefore = element.__comboBox.disabled === false;
                element.disableElements(true);
                var isDisabledAfter = element.__comboBox.disabled === true;

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
        
        it('attributeChangedCallback', async ()=>{
           
            var success = await page.evaluate(({id})=>{

                var element = document.getElementById(id);              

                var methodCalls = {};

                element.__recreateOptionTags = ()=>{
                    methodCalls['__recreateOptionTags'] = true;
                    console.log('__recreateOptionTags has been called;')
                }               

                element.attributeChangedCallback('options','oldValueMock', 'newValueMock');             
              
                return methodCalls['__recreateOptionTags'] === true;               

            },{id});
            expect(success).toBe(true);                      

        }); 
        
        describe('set value', ()=>{

            it('set undefined value causes error', async () =>{
                var success = await page.evaluate(({id})=>{

                    var element = document.getElementById(id);

                    try{
                        element.value = undefined;
                        return false;
                    } catch(error){
                        return true;
                    }                   
      
                  },{id});
                  expect(success).toBe(true);
            });

            it('without options', async () =>{
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    element.value = 'foo';

                    return element.value === 'foo';
      
                  },{id});
                  expect(success).toBe(true);
            });

            describe('with options', () =>{
                it('with known option', async () =>{
                    var success = await page.evaluate(({id})=>{
                        var element = document.getElementById(id);
                        element.options = 'foo,baa';

                        element.value = 'baa';
    
                        return element.value === 'baa';
          
                      },{id});
                      expect(success).toBe(true);
                });

                it('with unknown option', async () =>{
                    var success = await page.evaluate(({id})=>{
                        var element = document.getElementById(id);
                        element.options = 'foo, baa';

                        try{
                            element.value = 'qux';
                            return false;
                        } catch (error){
                            return true;
                        }                      
          
                      },{id});
                      expect(success).toBe(true);
                });
            });            

        }); 
        
    });   
    
    describe('Private API', ()=>{  
       
        it('__comboBoxChanged', async ()=>{
           
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);

                    var valueIsNullBefore = element.value === null;
                    element.options = 'foo, baa';
                    element.__comboBox.value = 'foo';
                    var valueIsNullBeforeUpdate = element.value === null;

                    element.__comboBoxChanged();

                    var valueIsSetAfterUpdate = element.value === 'foo';

                    return valueIsNullBefore &&
                    valueIsNullBeforeUpdate &&
                    valueIsSetAfterUpdate;
                },{id});
                expect(success).toBe(true);
        });

        describe('__recreateOptionTags', ()=>{

            it('child nodes are removed', async ()=>{

                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    var comboBox = element.__comboBox;

                    var hasNoChildrenBefore = comboBox.childNodes.length === 0;
                    console.log('has no children before:' + hasNoChildrenBefore);

                    var optionToDelete = document.createElement('option');
                    comboBox.appendChild(optionToDelete);
                    var hasChildren = comboBox.childNodes.length === 1;
                    console.log('has children:' + hasChildren);

                    element.options = "";
                    element.__recreateOptionTags();

                    var hasNoChildrenAfter = comboBox.childNodes.length === 0;
                    console.log('has no children after:' + hasNoChildrenAfter);

                    return hasNoChildrenBefore && hasChildren && hasNoChildrenAfter;
                },{id});
                expect(success).toBe(true);

            });

            it('options are created', async ()=>{

                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    var comboBox = element.__comboBox;

                    var hasNoChildrenBefore = comboBox.childNodes.length === 0;
                    console.log('has no children before:' + hasNoChildrenBefore);
                   
                    element.options = 'foo,baa,qux';
                    element.__recreateOptionTags();    
                    
                    var hasChildrenAfter = comboBox.childNodes.length === 3;

                    return hasNoChildrenBefore && hasChildrenAfter;
                },{id});
                expect(success).toBe(true);

            });

            it('value is restored if it is included in new options', async ()=>{

                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    var comboBox = element.__comboBox;                  
                   
                    element.value = 'qux';
                    element.options = 'foo,baa,qux';
                    element.__recreateOptionTags();    
                    
                    var hasChildrenAfter = comboBox.childNodes.length === 3;
                    var valueIsSet = element.value === 'qux'

                    return hasChildrenAfter && valueIsSet;
                },{id});
                expect(success).toBe(true);

            });

            it('first value is selected if old value exists and if it is not in new options', async ()=>{
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
                    var comboBox = element.__comboBox;                  
                   
                    element.options = 'foo,baa,qux';                   
                    element.value = 'qux';

                    element.options = 'foo,baa';                    
                    
                    var hasChildrenAfter = comboBox.childNodes.length === 2;
                    var firstValueIsSet = element.value === 'foo'

                    return hasChildrenAfter && firstValueIsSet;
                },{id});
                expect(success).toBe(true);
            });

        });

        it('__createOptionTag', ()=>{
            var optionTag = TreezComboBox.__createOptionTag('foo');
            expect(optionTag.constructor.name).toBe('HTMLOptionElement');
            expect(optionTag.innerText).toBe('foo');
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

