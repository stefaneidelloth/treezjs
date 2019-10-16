import TreezElement from '../../src/components/treezElement.js';

import TestUtils from '../testUtils.js';

import puppeteerToIstanbul from 'puppeteer-to-istanbul';

jest.setTimeout(10000);

describe('TreezElement', ()=>{   
    
    let id = 'treez-element';

    let page;      

    beforeAll(async () => { 
        page = await TestUtils.createBrowserPage(); 
        await page.coverage.startJSCoverage();
        
    }); 

    beforeEach(async () => {
        await TestUtils.clearBody(page);
        await TestUtils.createCustomElement(page, id, 'TreezElement', '../src/components/treezElement.js');
    });
    
    describe('State after construction', ()=>{

        it('id',  async ()=>{   
            let property = await page.$eval('#' + id, element=> element.id);       
            expect(property).toBe(id);
         });
     
     
         it('get value',  async ()=>{   
             let property = await page.$eval('#' + id, element=> element.value);       
             expect(property).toBe(null);
         });
     
         it('get disabled',  async ()=>{   
             let property = await page.$eval('#' + id, element=> element.disabled);       
             expect(property).toBe(false);
         });
     
         it('get hidden',  async ()=>{   
             let property = await page.$eval('#' + id, element=> element.hidden);       
             expect(property).toBe(false);
         });
     
         it('get width',  async ()=>{   
             let property = await page.$eval('#' + id, element=> element.width);       
             expect(property).toBe(null);
         });
     
         it('__parentAtom',  async ()=>{   
             let property = await page.$eval('#' +id, element=> element.__parentAtom);       
             expect(property).toBe(undefined);
         });
     
         it('__listeners',  async ()=>{   
             let property = await page.$eval('#' + id, element=> element.__listeners);       
             expect(property).toEqual([]);
          });
    });

    describe('Public API', ()=>{

        describe('hide', ()=>{

            it('hide', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);

                    let elementMock = {style: { display: undefined}};

                    element.constructor.hide(elementMock, true);
                    let isHidden =  elementMock.style.display === 'none';
                    return isHidden;

                },{id});
                expect(success).toBe(true);
            });

            it('show', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);

                    let elementMock = {style: { display: undefined}};

                    element.constructor.hide(elementMock, false);
                    let isShown =  elementMock.style.display === null;

                    return isShown;

                },{id});
                expect(success).toBe(true);
            });

            it('undefined throws error', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);

                    let elementMock = {style: { display: undefined}};

                    try{
                        element.constructor.hide(elementMock);
                        return false;
                    } catch (error){
                        return true;
                    }

                },{id});
                expect(success).toBe(true);
            });
        });
    
        it('observedAttributes', ()=>{
            expect(TreezElement.observedAttributes).toEqual(['value', 'disabled', 'hidden', 'width']);
        });

        it('convertFromStringValue', async ()=>{
            let value = await page.$eval('#' + id, element=> element.convertFromStringValue('stringValue'));       
            expect(value).toEqual('stringValue');           
        });

        it('convertToStringValue', async ()=>{
            let value = await page.$eval('#' +id, element=> element.convertToStringValue('stringValue'));       
            expect(value).toEqual('stringValue');           
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
                page.$eval('#' + id, element=> element.disableElements(true));
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
                page.$eval('#' + id, element => element.hideElements(true));
            });
        });

        it('updateElements', async ()=>{
            await page.$eval('#' + id, element=> element.updateElements('newValue'));
        });

        it('updateWidth', async ()=>{ 
            let width = await page.$eval('#' + id, element=> element.style.width);
            expect(width).toBe('');
                        
            await page.evaluate(({id})=>{
                let element = document.getElementById(id);
                element.updateWidth('100%');
            },{id});

            let updatedWidth = await page.$eval('#' + id, element=> element.style.width);

            expect(updatedWidth).toBe('100%'); 
                      
        });

        describe('bindValue', ()=>{ 

            beforeEach(async ()=>{

                await page.evaluate(({id})=>{
                    let atomMock = {property: '33'}; 
                    window.atomMock = atomMock;

                    let element = document.getElementById(id);
                    element.bindValue(atomMock, () => atomMock.property);
                },{id});
            });

            it('element value should equal atom value after binding', async ()=>{
                let bindedElementValue = await page.$eval('#' + id, element => element.value);
                expect(bindedElementValue).toBe('33');
            });

            it('changing element value should change atom value', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    element.value = '66';
                    return true;
                },{id});
    
                let updatedElementValue = await page.$eval('#' + id, element => element.value);
                expect(updatedElementValue).toBe('66');
    
                let atomProperty = await page.$eval('#' + id, element => window.atomMock.property);
                expect(atomProperty).toBe('66'); 
            });

            it('changing atom value should change element value', async ()=>{
                await page.evaluate( ()=>{
                    window.atomMock.property = '99';
                });
    
                let newElementValue = await page.$eval('#' + id, element=> element.value);
                expect(newElementValue).toBe('99');
            }); 
                     
        });

        describe('attributeChangedCallback', ()=>{

            it('value', async ()=>{ 
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);

                    let methodCalls = {};
                   
                    element.convertFromStringValue = (value)=>{
                        methodCalls['convertFromStringValue'] = 'convertedValueMock';
                        return 'convertedValueMock';
                    };

                    element.updateElements = (newValue)=>{
                        methodCalls['updateElemetns'] = newValue;                       
                    };

                    element.__updateExternalProperties = (newValue)=>{
                        methodCalls['__updateExternalProperties'] = newValue;                       
                    };

                    element.attributeChangedCallback('value','oldStringValueMock','newStringValueMock');

                    return Object.keys(methodCalls).length === 3;
                },{id});
                expect(success).toBe(true); 
            });

            describe('disabled', ()=>{ 
                it('value changed to true (!==null)', async ()=>{
                    let success = await page.evaluate(({id})=>{
                        let element = document.getElementById(id);

                        let methodCalls = {};                   
                        element.disableElements = (value)=>{
                            methodCalls['disableElements'] = value;                      
                        };

                        element.attributeChangedCallback('disabled',null,'');

                        return methodCalls['disableElements'] === true;
                    },{id});
                    expect(success).toBe(true); 
                });

                it('value changed to null', async ()=>{
                    let success = await page.evaluate(({id})=>{
                        let element = document.getElementById(id);

                        let methodCalls = {};                   
                        element.disableElements = (value)=>{
                            methodCalls['disableElements'] = value;                      
                        };

                        element.attributeChangedCallback('disabled','',null);

                        return methodCalls['disableElements'] === false;
                    },{id});
                    expect(success).toBe(true); 
                });

                it('value did not change', async ()=>{
                    let success = await page.evaluate(({id})=>{
                        let element = document.getElementById(id);

                        let methodCalls = {};                   
                        element.disableElements = (value)=>{
                            methodCalls['disableElements'] = value;                      
                        };

                        element.attributeChangedCallback('disabled','','');

                        return Object.keys(methodCalls).length === 0;
                    },{id});
                    expect(success).toBe(true); 
                });
                     
            });

            describe('hidden', ()=>{ 

                it('value changed to true (!==null)', async ()=>{
                    let success = await page.evaluate(({id})=>{
                        let element = document.getElementById(id);

                        let methodCalls = {};                   
                        element.hideElements = (value)=>{
                            methodCalls['hideElements'] = value;                      
                        };

                        element.attributeChangedCallback('hidden',null,'');

                        return methodCalls['hideElements'] === true;
                    },{id});
                    expect(success).toBe(true); 
                });

                it('value changed to null', async ()=>{
                    let success = await page.evaluate(({id})=>{
                        let element = document.getElementById(id);

                        let methodCalls = {};                   
                        element.hideElements = (value)=>{
                            methodCalls['hideElements'] = value;                      
                        };

                        element.attributeChangedCallback('hidden','',null);

                        return methodCalls['hideElements'] === false;
                    },{id});
                    expect(success).toBe(true); 
                });

                it('value did not change', async ()=>{
                    let success = await page.evaluate(({id})=>{
                        let element = document.getElementById(id);

                        let methodCalls = {};                   
                        element.hideElements = (value)=>{
                            methodCalls['hideElements'] = value;                      
                        };

                        element.attributeChangedCallback('hidden','','');

                        return Object.keys(methodCalls).length === 0;
                    },{id});
                    expect(success).toBe(true); 
                });
                     
            });

            describe('width', ()=>{ 
                it('value changed', async ()=>{
                    let success = await page.evaluate(({id})=>{
                        let element = document.getElementById(id);

                        let methodCalls = {};                   
                        element.updateWidth = (value)=>{
                            methodCalls['updateWidth'] = value;                      
                        };

                        element.attributeChangedCallback('width','0 px', '10 px');

                        return methodCalls['updateWidth'] === '10 px';
                    },{id});
                    expect(success).toBe(true); 
                });

                it('value did not change', async ()=>{
                    let success = await page.evaluate(({id})=>{
                        let element = document.getElementById(id);

                        let methodCalls = {};                   
                        element.updateWidth = (value)=>{
                            methodCalls['updateWidth'] = value;                      
                        };

                        element.attributeChangedCallback('width','10 px','10 px');

                        return Object.keys(methodCalls).length === 0;
                    },{id});
                    expect(success).toBe(true); 
                });
            });

        });

        it('dispatchChangeEvent', async ()=>{
            let success = await page.evaluate(({id})=>{
                let element = document.getElementById(id);

                let methodCalls = {};                   
                element.dispatchEvent = (value)=>{
                    methodCalls['dispatchEvent'] = value;                      
                };

                element.dispatchChangeEvent();

                let event = methodCalls['dispatchEvent'];

                return event.type === 'change';
            },{id});
            expect(success).toBe(true); 
        });

        it('disconnectedCallback', async ()=>{
            let success = await page.evaluate(({id})=>{
                let element = document.getElementById(id);

                let firstChild = document.createElement('div');
                element.appendChild(firstChild);

                let secondChild = document.createElement('div');
                element.appendChild(secondChild);

                element.disconnectedCallback();

                return element.hasChildNodes() === false;
            },{id});
            expect(success).toBe(true);             
        });

        describe('set value', ()=>{
            it('converted string value is not null', async ()=>{ 
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
    
                    element.value = '33'; 
                    return element.getAttribute('value') === '33';
                },{id});
                expect(success).toBe(true);  
            });

            it('converted string vlaue is null', async ()=>{ 
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    element.convertToStringValue = () => null;    
                    element.value = 'dummyValue'; 
                    return element.getAttribute('value') === null;
                },{id});
                expect(success).toBe(true);  
            });
        });

        describe('set disabled', ()=>{ 

            it('truthy', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    element.disabled = 'xy'; 
                    return element.getAttribute('disabled') === '';
                },{id});
                expect(success).toBe(true);
            });

            it('falsy', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    element.disabled = 0; 
                    return element.getAttribute('disabled') === null;
                },{id});
                expect(success).toBe(true);
            });
           
        });

        describe('set hidden', ()=>{ 
            it('truthy', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    element.hidden = true; 
                    return element.getAttribute('hidden') === '';
                },{id});
                expect(success).toBe(true);
            });

            it('falsy', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    element.hidden = undefined; 
                    return element.getAttribute('hidden') === null;
                },{id});
                expect(success).toBe(true);
            });         
        });

        it('set width', async ()=>{ 
            let success = await page.evaluate(({id})=>{
                let element = document.getElementById(id);
                element.width = '5 px'; 
                return element.getAttribute('width') === '5 px';
            },{id});
            expect(success).toBe(true);
        });
        
    });
    
    describe('Private API', ()=>{

        it('__updateExternalProperties', async ()=>{
            let success = await page.evaluate(({id})=>{
                let element = document.getElementById(id);

                let methodCalls = {};
                let firstAtomMock = {
                    property: ''
                };
                let secondAtomMock = {
                    anotherProperty: ''
                };

                element.__listeners = [
                    {
                        atom: firstAtomMock,
                        propertyName: 'property'
                    },
                    {
                        atom: secondAtomMock,
                        propertyName: 'anotherProperty'
                    }
                ];
                                   
                element.__updateExternalProperties('newValueMock');
                
                return firstAtomMock.property === 'newValueMock' && 
                       secondAtomMock.anotherProperty === 'newValueMock';
            },{id});
            expect(success).toBe(true);
        });

        describe('__extractPropertyNameFromLambdaExpression', ()=>{

            it('common usage', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);

                    let parentAtomMock = { myProperty: 0};
                    let propertyName = element.constructor.__extractPropertyNameFromLambdaExpression(parentAtomMock, atom => atom.myProperty)
                    return propertyName === 'myProperty';
                },{id});
                expect(success).toBe(true);


            });

            it('lambda expression without point', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    let parentAtomMock = { myProperty: 0};
                    try{
                        element.constructor.__extractPropertyNameFromLambdaExpression(parentAtomMock, atom => myProperty);
                        return false;
                    } catch (error){
                        return true;
                    }

                },{id});
                expect(success).toBe(true);

            });

            it('wrong property name', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);

                    let parentAtomMock = { myProperty: 0};
                    try{
                        element.constructor.__extractPropertyNameFromLambdaExpression(parentAtomMock, atom => atom.fooProperty);
                        return false;
                    } catch (error){
                        return true;
                    }
                },{id});
                expect(success).toBe(true);
            });

        });

        it('__addListenerToUpdateExternalPropertyOnAttributeChanges', async ()=>{
            let success = await page.evaluate(({id})=>{
                let element = document.getElementById(id);
               
                let atomMock = {
                    myProperty: ''
                };        
                                   
                element.__addListenerToUpdateExternalPropertyOnAttributeChanges(atomMock, 'myProperty');

                let listener = element.__listeners[0];
                
                return listener.atom === atomMock && 
                    listener.propertyName === 'myProperty';
            },{id});
            expect(success).toBe(true);
        });

        describe('__modifyExternalPropertyToUpdateValueOnPropertyChanges', ()=>{

            it('Property without existing getter and setter', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                   
                    let atomMock = {
                        myProperty: ''
                    };        
                                       
                    element.__modifyExternalPropertyToUpdateValueOnPropertyChanges(atomMock, 'myProperty');
    
                    atomMock.myProperty = 'newValue';

                    return element.value === 'newValue'; 
                },{id});
                expect(success).toBe(true);
            });

            it('Property that only has a setter; should throw error', async ()=>{
                let success = await page.evaluate(({id})=>{
                   
                    class AtomMock {

                        constructor(){
                            this.__atomProperty = 'foo'; //Due to the missing getter, this value is not available from outside.
                                                         //=> If we would append a new getter, how to initialize the corresponding value?
                                                         //=> We do not allow to bind properties that only have a setter. 
                        }          

                        set atomProperty(newValue){  
                            this.__atomProperty = newValue; 
                        }
                    }

                    let element = document.getElementById(id);
                   
                    let atomMock = new AtomMock();
                                       
                    try{
                        element.__modifyExternalPropertyToUpdateValueOnPropertyChanges(atomMock, 'atomProperty');
                        return false;
                    } catch(error){
                        return true;
                    }  
                    
                },{id});
                expect(success).toBe(true);
            });

            it('Property with predefined getter and setter', async ()=>{
                let success = await page.evaluate(({id})=>{

                    let methodCalls = [];

                    class AtomMock {

                        constructor(){
                            this.__myProperty = 'foo';
                        }

                        get myProperty(){
                            methodCalls.push({name: 'getMyProperty'});
                            return this.__myProperty;
                        }

                        set myProperty(newValue){
                            methodCalls.push({name: 'setMyProperty', value: newValue});
                            this.__myProperty=newValue; 
                        }
                    }
                    let element = document.getElementById(id);
                   
                    let atomMock = new AtomMock();
                                       
                    element.__modifyExternalPropertyToUpdateValueOnPropertyChanges(atomMock, 'myProperty');

                    let getterStillWorksAfterBinding = atomMock.myProperty === 'foo';
                    let existingGetterIsUsed = methodCalls[0].name === 'getMyProperty';
    
                    atomMock.myProperty = 'newValue';

                    let elementValueIsSet = element.value === 'newValue';    
                    let existingSetterIsCalled = methodCalls.pop().name === 'setMyProperty'; 
                    let getterStillWorks = atomMock.myProperty === 'newValue';
                    
                    return getterStillWorksAfterBinding &&
                        existingGetterIsUsed &&
                        elementValueIsSet &&
                        existingSetterIsCalled &&
                        getterStillWorks;                    
                },{id});
                expect(success).toBe(true);
            });

            
            
            it('Property that already has been binded to the same element; setter is only called once.', async ()=>{
                let success = await page.evaluate(({id})=>{

                    let methodCalls = [];

                    class AtomMock {

                        constructor(){
                            this.__myProperty = 'foo';
                        }

                        get myProperty(){
                            methodCalls.push({name: 'getMyProperty'});
                            return this.__myProperty;
                        }

                        set myProperty(newValue){
                            methodCalls.push({name: 'setMyProperty', value: newValue});
                            this.__myProperty=newValue; 
                        }
                    }
                    let element = document.getElementById(id);
                   
                    let atomMock = new AtomMock();
                                       
                    element.__modifyExternalPropertyToUpdateValueOnPropertyChanges(atomMock, 'myProperty');
                    element.__modifyExternalPropertyToUpdateValueOnPropertyChanges(atomMock, 'myProperty');
    
                    atomMock.myProperty = 'newValue';

                    let elementValueIsSet = element.value === 'newValue';

                    let numberOfSetterCalls = methodCalls.filter(methodCall => methodCall.name === 'setMyProperty').length;                    
                    let setterIsOnlyCalledOnce = numberOfSetterCalls === 1;

                    return elementValueIsSet && 
                        setterIsOnlyCalledOnce;                   
                    
                },{id});
                expect(success).toBe(true);
            });

            it('Property that already has been binded to another element; both element values are updated', async ()=>{

                await TestUtils.createCustomElement(page, id, 'TreezElement', '../src/components/treezElement.js','second-treez-element');

                let success = await page.evaluate(({id})=>{

                    class AtomMock {

                        constructor(){
                            this.__myProperty = 'foo';
                        }

                        get myProperty(){                            
                            return this.__myProperty;
                        }

                        set myProperty(newValue){                            
                            this.__myProperty=newValue; 
                        }
                    }

                    let firstElement = document.getElementById(id);
                    let secondElement = document.getElementById('second-treez-element');                    
                   
                    let atomMock = new AtomMock();
                                       
                    firstElement.__modifyExternalPropertyToUpdateValueOnPropertyChanges(atomMock, 'myProperty');
                    secondElement.__modifyExternalPropertyToUpdateValueOnPropertyChanges(atomMock, 'myProperty');
    
                    atomMock.myProperty = 'newValue';

                    return firstElement.value === 'newValue' && 
                            secondElement.value === 'newValue';                   
                    
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

