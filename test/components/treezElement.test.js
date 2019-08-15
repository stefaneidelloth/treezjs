import TreezElement from '../../src/components/treezElement.js';

import TestUtils from '../testUtils.js';

import puppeteerToIstanbul from 'puppeteer-to-istanbul';

jest.setTimeout(10000);

describe('TreezElement', ()=>{    

    var page;      

    beforeAll(async () => { 
        page = await TestUtils.createBrowserPage(); 
        await page.coverage.startJSCoverage();
        
    }); 

    beforeEach(async () => {
        await TestUtils.clearBody(page);
        await TestUtils.createCustomElement(page, 'treez-element', 'TreezElement', '../src/components/treezElement.js');
    });
    
    describe('State after construction', ()=>{

        it('id',  async ()=>{   
            var property = await page.$eval('#treez-element', element=> element.id);       
            expect(property).toBe('treez-element');
         });
     
     
         it('get value',  async ()=>{   
             var property = await page.$eval('#treez-element', element=> element.value);       
             expect(property).toBe(null);
         });
     
         it('get disabled',  async ()=>{   
             var property = await page.$eval('#treez-element', element=> element.disabled);       
             expect(property).toBe(false);
         });
     
         it('get hidden',  async ()=>{   
             var property = await page.$eval('#treez-element', element=> element.hidden);       
             expect(property).toBe(false);
         });
     
         it('get width',  async ()=>{   
             var property = await page.$eval('#treez-element', element=> element.width);       
             expect(property).toBe(null);
         });
     
         it('__parentAtom',  async ()=>{   
             var property = await page.$eval('#treez-element', element=> element.__parentAtom);       
             expect(property).toBe(undefined);
         });
     
         it('__listeners',  async ()=>{   
             var property = await page.$eval('#treez-element', element=> element.__listeners);       
             expect(property).toEqual([]);
          });
    });

    describe('Public API', ()=>{    

        it('hide', ()=>{
            var elementMock = {style: { display: undefined}};
    
            TreezElement.hide(elementMock, true);
            expect(elementMock.style.display).toBe('none');
    
            TreezElement.hide(elementMock, false);
            expect(elementMock.style.display).toBe(null);
        });
    
        it('observedAttributes', ()=>{
            expect(TreezElement.observedAttributes).toEqual(['value', 'disabled', 'hidden', 'width']);
        });

        it('convertFromStringValue', async ()=>{
            var value = await page.$eval('#treez-element', element=> element.convertFromStringValue('stringValue'));       
            expect(value).toEqual('stringValue');           
        });

        it('convertToStringValue', async ()=>{
            var value = await page.$eval('#treez-element', element=> element.convertToStringValue('stringValue'));       
            expect(value).toEqual('stringValue');           
        });

        it('updateElements', async ()=>{ 
            await page.$eval('#treez-element', element=> element.updateElements('newValue'));                     
        });

        it('updateWidth', async ()=>{ 
            var width = await page.$eval('#treez-element', element=> element.style.width);
            expect(width).toBe('');
                        
            await page.evaluate(()=>{
                var element = document.getElementById('treez-element');
                element.updateWidth('100%');
            });

            var updatedWidth = await page.$eval('#treez-element', element=> element.style.width);

            expect(updatedWidth).toBe(''); //style.width cannot be set for a pure HTMLElement without content
                      
        });

        it('disableElements', async ()=>{ 
            page.$eval('#treez-element', element=> element.disableElements(true));                       
        });

        it('hideElements', async ()=>{ 
            page.$eval('#treez-element', element=> element.hideElements(true));         
        });

        describe('bindValue', ()=>{ 

            beforeEach(async ()=>{

                await page.evaluate(()=>{
                    var atomMock = {property: '33'}; 
                    window.atomMock = atomMock;

                    var element = document.getElementById('treez-element');
                    element.bindValue(atomMock, () => atomMock.property);
                });
            });

            it('element value should equal atom value after binding', async ()=>{
                var bindedElementValue = await page.$eval('#treez-element', element=> element.value);
                expect(bindedElementValue).toBe('33');
            });

            it('changing element value should change atom value', async ()=>{
                await page.evaluate(()=>{
                    var element = document.getElementById('treez-element');
                    element.value = '66';
                });
    
                var updatedElementValue = await page.$eval('#treez-element', element=> element.value);
                expect(updatedElementValue).toBe('66');
    
                var atomProperty = await page.$eval('#treez-element', element=> window.atomMock.property);
                expect(atomProperty).toBe('66'); 
            });

            it('changing atom value should change element value', async ()=>{
                await page.evaluate(()=>{               
                    window.atomMock.property='99';
                });
    
                var newElementValue = await page.$eval('#treez-element', element=> element.value);
                expect(newElementValue).toBe('99');
            }); 
                     
        });

        describe('attributeChangedCallback', ()=>{

            it('value', async ()=>{ 
                var success = await page.evaluate(()=>{
                    var element = document.getElementById('treez-element');

                    var methodCalls = {};
                   
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
                });
                expect(success).toBe(true); 
            });

            describe('disabled', ()=>{ 
                it('value changed to true (!==null)', async ()=>{
                    var success = await page.evaluate(()=>{
                        var element = document.getElementById('treez-element');

                        var methodCalls = {};                   
                        element.disableElements = (value)=>{
                            methodCalls['disableElements'] = value;                      
                        };

                        element.attributeChangedCallback('disabled',null,'');

                        return methodCalls['disableElements'] === true;
                    });
                    expect(success).toBe(true); 
                });

                it('value changed to null', async ()=>{
                    var success = await page.evaluate(()=>{
                        var element = document.getElementById('treez-element');

                        var methodCalls = {};                   
                        element.disableElements = (value)=>{
                            methodCalls['disableElements'] = value;                      
                        };

                        element.attributeChangedCallback('disabled','',null);

                        return methodCalls['disableElements'] === false;
                    });
                    expect(success).toBe(true); 
                });

                it('value did not change', async ()=>{
                    var success = await page.evaluate(()=>{
                        var element = document.getElementById('treez-element');

                        var methodCalls = {};                   
                        element.disableElements = (value)=>{
                            methodCalls['disableElements'] = value;                      
                        };

                        element.attributeChangedCallback('disabled','','');

                        return Object.keys(methodCalls).length === 0;
                    });
                    expect(success).toBe(true); 
                });
                     
            });

            describe('hidden', ()=>{ 

                it('value changed to true (!==null)', async ()=>{
                    var success = await page.evaluate(()=>{
                        var element = document.getElementById('treez-element');

                        var methodCalls = {};                   
                        element.hideElements = (value)=>{
                            methodCalls['hideElements'] = value;                      
                        };

                        element.attributeChangedCallback('hidden',null,'');

                        return methodCalls['hideElements'] === true;
                    });
                    expect(success).toBe(true); 
                });

                it('value changed to null', async ()=>{
                    var success = await page.evaluate(()=>{
                        var element = document.getElementById('treez-element');

                        var methodCalls = {};                   
                        element.hideElements = (value)=>{
                            methodCalls['hideElements'] = value;                      
                        };

                        element.attributeChangedCallback('hidden','',null);

                        return methodCalls['hideElements'] === false;
                    });
                    expect(success).toBe(true); 
                });

                it('value did not change', async ()=>{
                    var success = await page.evaluate(()=>{
                        var element = document.getElementById('treez-element');

                        var methodCalls = {};                   
                        element.hideElements = (value)=>{
                            methodCalls['hideElements'] = value;                      
                        };

                        element.attributeChangedCallback('hidden','','');

                        return Object.keys(methodCalls).length === 0;
                    });
                    expect(success).toBe(true); 
                });
                     
            });

            describe('width', ()=>{ 
                it('value changed', async ()=>{
                    var success = await page.evaluate(()=>{
                        var element = document.getElementById('treez-element');

                        var methodCalls = {};                   
                        element.updateWidth = (value)=>{
                            methodCalls['updateWidth'] = value;                      
                        };

                        element.attributeChangedCallback('width','0 px', '10 px');

                        return methodCalls['updateWidth'] === '10 px';
                    });
                    expect(success).toBe(true); 
                });

                it('value did not change', async ()=>{
                    var success = await page.evaluate(()=>{
                        var element = document.getElementById('treez-element');

                        var methodCalls = {};                   
                        element.updateWidth = (value)=>{
                            methodCalls['updateWidth'] = value;                      
                        };

                        element.attributeChangedCallback('width','10 px','10 px');

                        return Object.keys(methodCalls).length === 0;
                    });
                    expect(success).toBe(true); 
                });
            });

        });

        it('dispatchChangeEvent', async ()=>{
            var success = await page.evaluate(()=>{
                var element = document.getElementById('treez-element');

                var methodCalls = {};                   
                element.dispatchEvent = (value)=>{
                    methodCalls['dispatchEvent'] = value;                      
                };

                element.dispatchChangeEvent();

                var event = methodCalls['dispatchEvent'];

                return event.type === 'change';
            });
            expect(success).toBe(true); 
        });

        it('disconnectedCallback', async ()=>{
            var success = await page.evaluate(()=>{
                var element = document.getElementById('treez-element');

                var firstChild = document.createElement('div');
                element.appendChild(firstChild);

                var secondChild = document.createElement('div');
                element.appendChild(secondChild);

                element.disconnectedCallback();

                return element.hasChildNodes() === false;
            });
            expect(success).toBe(true);             
        });

        describe('set value', ()=>{
            it('converted string value is not null', async ()=>{ 
                var success = await page.evaluate(()=>{
                    var element = document.getElementById('treez-element');
    
                    element.value = '33'; 
                    return element.getAttribute('value') === '33';
                });
                expect(success).toBe(true);  
            });

            it('converted string vlaue is null', async ()=>{ 
                var success = await page.evaluate(()=>{
                    var element = document.getElementById('treez-element');
                    element.convertToStringValue = () => null;    
                    element.value = 'dummyValue'; 
                    return element.getAttribute('value') === null;
                });
                expect(success).toBe(true);  
            });
        });

        

        describe('set disabled', ()=>{ 

            it('truthy', async ()=>{
                var success = await page.evaluate(()=>{
                    var element = document.getElementById('treez-element');
                    element.disabled = 'xy'; 
                    return element.getAttribute('disabled') === '';
                });
                expect(success).toBe(true);
            });

            it('falsy', async ()=>{
                var success = await page.evaluate(()=>{
                    var element = document.getElementById('treez-element');
                    element.disabled = 0; 
                    return element.getAttribute('disabled') === null;
                });
                expect(success).toBe(true);
            });
           
        });

        describe('set hidden', ()=>{ 
            it('truthy', async ()=>{
                var success = await page.evaluate(()=>{
                    var element = document.getElementById('treez-element');
                    element.hidden = true; 
                    return element.getAttribute('hidden') === '';
                });
                expect(success).toBe(true);
            });

            it('falsy', async ()=>{
                var success = await page.evaluate(()=>{
                    var element = document.getElementById('treez-element');
                    element.hidden = undefined; 
                    return element.getAttribute('hidden') === null;
                });
                expect(success).toBe(true);
            });         
        });

        it('set width', async ()=>{ 
            var success = await page.evaluate(()=>{
                var element = document.getElementById('treez-element');
                element.width = '5 px'; 
                return element.getAttribute('width') === '5 px';
            });
            expect(success).toBe(true);
        });
        
    });
    
    describe('Private API', ()=>{
        it('__updateExternalProperties', async ()=>{
            var success = await page.evaluate(()=>{
                var element = document.getElementById('treez-element');

                var methodCalls = {};
                var firstAtomMock = {
                    property: ''
                };
                var secondAtomMock = {
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
            });
            expect(success).toBe(true);
        });

        describe('__extractPropertyNameFromLambdaExpression', ()=>{

            it('common usage', async ()=>{
                var parentAtomMock = { myProperty: 0};
                var propertyName = TreezElement.__extractPropertyNameFromLambdaExpression(parentAtomMock, atom => atom.myProperty)
                expect(propertyName).toBe('myProperty');
            });

            it('lambda expression without point', async ()=>{
                var parentAtomMock = { myProperty: 0};
                var throwingMethod = ()=>{
                    TreezElement.__extractPropertyNameFromLambdaExpression(parentAtomMock, atom => myProperty);
                };
                expect(throwingMethod).toThrowError("Could not determine property name");
            });

            it('wrong property name', async ()=>{
                var parentAtomMock = { myProperty: 0};
                var throwingMethod = ()=>{TreezElement.__extractPropertyNameFromLambdaExpression(parentAtomMock, atom => atom.fooProperty);};
                expect(throwingMethod).toThrowError("Unknown property");
            });

        });

        it('__addListenerToUpdateExternalPropertyOnAttributeChanges', async ()=>{
            var success = await page.evaluate(()=>{
                var element = document.getElementById('treez-element');
               
                var atomMock = {
                    myProperty: ''
                };        
                                   
                element.__addListenerToUpdateExternalPropertyOnAttributeChanges(atomMock, 'myProperty');

                var listener = element.__listeners[0];
                
                return listener.atom === atomMock && 
                    listener.propertyName === 'myProperty';
            });
            expect(success).toBe(true);
        });

        describe('__modifyExternalPropertyToUpdateValueOnPropertyChanges', ()=>{

            it('Property without existing getter and setter', async ()=>{
                var success = await page.evaluate(()=>{
                    var element = document.getElementById('treez-element');
                   
                    var atomMock = {
                        myProperty: ''
                    };        
                                       
                    element.__modifyExternalPropertyToUpdateValueOnPropertyChanges(atomMock, 'myProperty');
    
                    atomMock.myProperty = 'newValue';

                    return element.value === 'newValue'; 
                });
                expect(success).toBe(true);
            });

            it('Property that only has a setter; should throw error', async ()=>{
                var success = await page.evaluate(()=>{
                   
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

                    var element = document.getElementById('treez-element');
                   
                    var atomMock = new AtomMock();
                                       
                    try{
                        element.__modifyExternalPropertyToUpdateValueOnPropertyChanges(atomMock, 'atomProperty');
                        return false;
                    } catch(error){
                        return true;
                    }  
                    
                });
                expect(success).toBe(true);
            });

            it('Property with predefined getter and setter', async ()=>{
                var success = await page.evaluate(()=>{

                    var methodCalls = [];

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
                    var element = document.getElementById('treez-element');
                   
                    var atomMock = new AtomMock();
                                       
                    element.__modifyExternalPropertyToUpdateValueOnPropertyChanges(atomMock, 'myProperty');

                    var getterStillWorksAfterBinding = atomMock.myProperty === 'foo';
                    var existingGetterIsUsed = methodCalls[0].name === 'getMyProperty';
    
                    atomMock.myProperty = 'newValue';

                    var elementValueIsSet = element.value === 'newValue';    
                    var existingSetterIsCalled = methodCalls.pop().name === 'setMyProperty'; 
                    var getterStillWorks = atomMock.myProperty === 'newValue';
                    
                    return getterStillWorksAfterBinding &&
                        existingGetterIsUsed &&
                        elementValueIsSet &&
                        existingSetterIsCalled &&
                        getterStillWorks;                    
                });
                expect(success).toBe(true);
            });

            
            
            it('Property that already has been binded to the same element; setter is only called once.', async ()=>{
                var success = await page.evaluate(()=>{

                    var methodCalls = [];

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
                    var element = document.getElementById('treez-element');
                   
                    var atomMock = new AtomMock();
                                       
                    element.__modifyExternalPropertyToUpdateValueOnPropertyChanges(atomMock, 'myProperty');
                    element.__modifyExternalPropertyToUpdateValueOnPropertyChanges(atomMock, 'myProperty');
    
                    atomMock.myProperty = 'newValue';

                    var elementValueIsSet = element.value === 'newValue';

                    var numberOfSetterCalls = methodCalls.filter(methodCall => methodCall.name === 'setMyProperty').length;                    
                    var setterIsOnlyCalledOnce = numberOfSetterCalls === 1;

                    return elementValueIsSet && 
                        setterIsOnlyCalledOnce;                   
                    
                });
                expect(success).toBe(true);
            });

            it('Property that already has been binded to another element; both element values are updated', async ()=>{

                await TestUtils.createCustomElement(page, 'treez-element', 'TreezElement', '../src/components/treezElement.js','second-treez-element');

                var success = await page.evaluate(()=>{                   

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

                    var firstElement = document.getElementById('treez-element');
                    var secondElement = document.getElementById('second-treez-element');                    
                   
                    var atomMock = new AtomMock();
                                       
                    firstElement.__modifyExternalPropertyToUpdateValueOnPropertyChanges(atomMock, 'myProperty');
                    secondElement.__modifyExternalPropertyToUpdateValueOnPropertyChanges(atomMock, 'myProperty');
    
                    atomMock.myProperty = 'newValue';

                    return firstElement.value === 'newValue' && 
                            secondElement.value === 'newValue';                   
                    
                });
                expect(success).toBe(true);
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

