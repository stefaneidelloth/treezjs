import TreezElement from '../../src/components/treezElement.js';
jest.mock('../../src/components/treezElement.js', function(){
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

import LabeledTreezElement from '../../src/components/labeledTreezElement.js';

import TestUtils from '../testUtils.js';

import puppeteerToIstanbul from 'puppeteer-to-istanbul';

jest.setTimeout(10000);

describe('LabeledTreezElement', ()=>{   
    
    var id = 'labeled-treez-element';

    var page;      

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
            var property = await page.$eval('#' + id, element=> element.id);       
            expect(property).toBe(id);
         }); 
         
     
         it('get label',  async ()=>{   
             var property = await page.$eval('#' + id, element=> element.label);       
             expect(property).toBe(null);
         });     
        
    });

    describe('Public API', ()=>{  
            
        it('observedAttributes', ()=>{
            expect(LabeledTreezElement.observedAttributes).toEqual(['mockedObservedAttribute','label']);
        });
       
        describe('attributeChangedCallback', ()=>{

            it('label', async ()=>{ 
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);

                    var labelElementMock = {
                        innerText: ''
                    };

                    element.__label = labelElementMock                   

                    element.attributeChangedCallback('label','oldStringValueMock','newStringValueMock');

                    return labelElementMock.innerText === 'newStringValueMock';
                },{id});
                expect(success).toBe(true); 
            });            

        });
       
        describe('set label', ()=>{
            it('converted string value is not null', async ()=>{ 
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);
    
                    element.label = 'myLabel'; 
                    return element.getAttribute('label') === 'myLabel';
                },{id});
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

