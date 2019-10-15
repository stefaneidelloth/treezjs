import CustomElementsMock from '../../customElementsMock.js';
import TreezNumber from '../../../src/components/number/treezNumber.js';
jest.mock('../../../src/components/number/treezNumber.js', function(){
        var constructor = jest.fn();
		constructor.mockImplementation(
			function(){	  
				return this;				
            }
        );       
           
        return constructor;
	}
);

import TreezDouble from '../../../src/components/number/treezDouble.js';

import TestUtils from '../../testUtils.js';

import puppeteerToIstanbul from 'puppeteer-to-istanbul';

jest.setTimeout(100000);

describe('TreezDouble', ()=>{   
    
    var id = 'treez-double';

    var page;      

    beforeAll(async () => { 
        page = await TestUtils.createBrowserPage(); 
        await page.coverage.startJSCoverage();
        
    }); 

    beforeEach(async () => {
        await TestUtils.clearBody(page);
        await TestUtils.createCustomElement(page, id, 'TreezDouble', '../../src/components/number/treezDouble.js');
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
               

                element.connectedCallback();               

                var numberInput = element.lastChild;

                var stepIsAny = numberInput.step === 'any';

                return  stepIsAny;                   

                function removeExistingChildren(element){
                    element.__label = undefined;
                    element.__numberInput = undefined;
                    while(element.firstChild){
                        element.firstChild.remove();
                    } 
                }                  

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

