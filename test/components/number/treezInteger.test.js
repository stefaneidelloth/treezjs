import CustomElementsMock from '../../customElementsMock.js';
import TreezNumber from '../../../src/components/number/treezNumber.js';
jest.mock('../../../src/components/number/treezNumber.js', function(){
        let constructor = jest.fn();
		constructor.mockImplementation(
			function(){	  
				return this;				
            }
        );       
           
        return constructor;
	}
);

import TreezInteger from '../../../src/components/number/treezInteger.js';

import TestUtils from '../../testUtils.js';

import puppeteerToIstanbul from 'puppeteer-to-istanbul';

jest.setTimeout(100000);

describe('TreezInteger', ()=>{   
    
    let id = 'treez-integer';

    let page;      

    beforeAll(async () => { 
        page = await TestUtils.createBrowserPage(); 
        await page.coverage.startJSCoverage();
        
    }); 

    beforeEach(async () => {
        await TestUtils.clearBody(page);
        await TestUtils.createCustomElement(page, id, 'TreezInteger', '../../src/components/number/treezInteger.js');
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
               

                element.connectedCallback();               

                let numberInput = element.lastChild;

                let stepIsOne = numberInput.step === '1';

                return  stepIsOne;                   

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
        
        describe('validateValue', ()=>{

            it('super validation fails', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);

                    let superMethod = element.constructor.__proto__.prototype.validateValue;
                    element.constructor.__proto__.prototype.validateValue = () =>{
                        return {isValid: false};
                    };

                    let validationState = element.validateValue(33);

                    element.constructor.__proto__.prototype.validateValue = superMethod;
                    return  validationState.isValid === false;
                },{id});
                expect(success).toBe(true);
            });

            it('valid integer', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);

                    let validationState = element.validateValue(33);
                    return  validationState.isValid === true;     
                },{id});
                expect(success).toBe(true);  
            });

            it('double caused error', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);

                    let validationState = element.validateValue(33.3);
                    return  validationState.isValid === false;     
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

