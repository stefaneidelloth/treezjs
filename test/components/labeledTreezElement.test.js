import TreezElement from '../../src/components/treezElement.js';
jest.mock('../../src/components/treezElement.js', function(){
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

import LabeledTreezElement from '../../src/components/labeledTreezElement.js';

import TestUtils from '../testUtils.js';

import puppeteerToIstanbul from 'puppeteer-to-istanbul';

jest.setTimeout(100000);

describe('LabeledTreezElement', ()=>{   
    
    let id = 'labeled-treez-element';

    let page;      

    beforeAll(async () => { 
        page = await TestUtils.createBrowserPage(); 
        await page.coverage.startJSCoverage();
        
    }); 

    beforeEach(async () => {
        await TestUtils.clearBody(page);
        await TestUtils.createCustomElement(page, id, 'LabeledTreezElement', '../src/components/labeledTreezElement.js');
    });
    
    describe('State after construction', ()=>{

        it('id',  async ()=>{   
            let property = await page.$eval('#' + id, element=> element.id);       
            expect(property).toBe(id);
         }); 
         
     
         it('get label',  async ()=>{   
             let property = await page.$eval('#' + id, element=> element.label);       
             expect(property).toBe(null);
         });     
        
    });

    describe('Public API', ()=>{  
            
        it('observedAttributes', ()=>{
            expect(LabeledTreezElement.observedAttributes).toEqual(['mockedObservedAttribute','label','label-width','content-width']);
        });
       
        describe('attributeChangedCallback', ()=>{

            it('label', async ()=>{ 
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);

                    let labelElementMock = {
                        innerText: ''
                    };

                    element.__label = labelElementMock                   

                    element.attributeChangedCallback('label','oldStringValueMock','newStringValueMock');

                    return labelElementMock.innerText === 'newStringValueMock';
                },{id});
                expect(success).toBe(true); 
            });

            it('label-width', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);

                    let methodCalls = {};
                    element.updateLabelWidth = (value)=>{
                        methodCalls['updateLabelWidth'] = value;
                    }

                    element.__label = {};

                    element.attributeChangedCallback('label-width','oldStringValueMock','newStringValueMock');

                    return methodCalls['updateLabelWidth'] === 'newStringValueMock';
                },{id});
                expect(success).toBe(true);
            });

            it('content-width', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);

                    let methodCalls = {};
                    element.updateContentWidth = (value)=>{
                        methodCalls['updateContentWidth'] = value;
                    }

                    element.__label = {};

                    element.attributeChangedCallback('content-width','oldStringValueMock','newStringValueMock');

                    return methodCalls['updateContentWidth'] === 'newStringValueMock';
                },{id});
                expect(success).toBe(true);
            });

        });

        describe('update',  ()=>{

            it('value can be retrieved', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);

                    let methodCalls = {};
                    element.updateElements = (value)=>{
                        methodCalls['updateElements'] = value;
                    };

                    element.disableElements = (value)=>{
                        methodCalls['disableElements'] = value;
                    };

                    element.hideElements = (value)=>{
                        methodCalls['hideElements'] = value;
                    };

                    element.updateLabelWidth = (value)=>{
                        methodCalls['updateLabelWidth'] = value;
                    };

                    element.updateContentWidth = (value)=>{
                        methodCalls['updateContentWidth'] = value;
                    };

                    element.updateWidth = (value)=>{
                        methodCalls['updateWidth'] = value;
                    };

                    element.update();

                    let methodsAreCalled =  (methodCalls['updateElements'] === null) &&
                        (methodCalls['disableElements'] === false) &&
                        (methodCalls['hideElements'] === false) &&
                        (methodCalls['updateLabelWidth'] === null) &&
                        (methodCalls['updateContentWidth'] === null) &&
                        (methodCalls['updateWidth'] === null);


                    return methodsAreCalled;
                },{id});
                expect(success).toBe(true);
            });

            it('value can not be retrieved', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);

                    Object.defineProperty(element,'value',{
                        get: () => {
                            throw Error('Cannot get value');
                        }
                    } );

                    element.update();

                    return true;
                },{id});
                expect(success).toBe(true);
            });

        });

        it('updateContentWidth', async ()=>{
            let success = await page.evaluate(({id})=>{
                let element = document.getElementById(id);
                element.updateContentWidth('widthMock');
                return  true;
            },{id});
            expect(success).toBe(true);
        });

        it('updateLabelWidth', async ()=>{
            let success = await page.evaluate(({id})=>{
                let element = document.getElementById(id);

                let methodCalls = {};
                element.updateWidthFor = (value, width)=>{
                    methodCalls['updateWidthFor'] = value;
                };

                let labelMock = 'labelMock';
                element.__label = labelMock;
                element.updateLabelWidth('widthMock');

                return  methodCalls['updateWidthFor'] === labelMock;
            },{id});
            expect(success).toBe(true);
        });

        describe('updateWidthFor', ()=>{

            it('common usage', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);

                    let labelMock = {style: {width: undefined}};
                    element.updateWidthFor(labelMock, 'widthMock');

                    return  labelMock.style.width === 'widthMock';
                },{id});
                expect(success).toBe(true);
            });

            it('width is zero string', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);

                    let labelMock = {style: {width: undefined}};

                    try{
                        element.updateWidthFor(labelMock, '0');
                        return false;
                    } catch(error){
                        return true
                    }

                },{id});
                expect(success).toBe(true);
            });

            it('width is zero', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);

                    let labelMock = {style: {width: undefined}};

                    try{
                        element.updateWidthFor(labelMock, 0);
                        return false;
                    } catch(error){
                        return true
                    }

                },{id});
                expect(success).toBe(true);
            });

            it('width is falsy but not zero', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);

                    let labelMock = {style: {width: undefined}};

                    element.updateWidthFor(labelMock, null);

                    return labelMock.style.width === '';
                },{id});
                expect(success).toBe(true);
            });
        });

        it('set label', async ()=>{
            let success = await page.evaluate(({id})=>{
                let element = document.getElementById(id);

                element.label = 'myLabel';
                return element.getAttribute('label') === 'myLabel';
            },{id});
            expect(success).toBe(true);
        });

        it('set labelWidth', async ()=>{
            let success = await page.evaluate(({id})=>{
                let element = document.getElementById(id);

                element.labelWidth = 'widthMock';
                return element.getAttribute('label-width') === 'widthMock';
            },{id});
            expect(success).toBe(true);
        });

        it('set contentWidth', async ()=>{
            let success = await page.evaluate(({id})=>{
                let element = document.getElementById(id);

                element.contentWidth = 'widthMock';
                return element.getAttribute('content-width') === 'widthMock';
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

