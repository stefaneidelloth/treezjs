import CustomElementsMock from '../../customElementsMock.js';

import TreezFont from '../../../src/components/font/treezFont.js';

import TestUtils from '../../testUtils.js';

import puppeteerToIstanbul from 'puppeteer-to-istanbul';

import TreezComboBox from '../../../src/components/comboBox/treezComboBox.js';
jest.mock('../../../src/components/comboBox/treezComboBox.js', function(){
        var constructor = jest.fn();
		constructor.mockImplementation(
			function(){	                	
                return this;			
            }
        );       

        return constructor;
	}
);
TreezComboBox.__createOptionTag = (option) => {
    return document.createElement('option');
}

jest.setTimeout(10000);

describe('TreezFont', ()=>{   
    
    var id = 'treez-font';

    var page;      

    beforeAll(async () => { 
        page = await TestUtils.createBrowserPage(); 
        await page.coverage.startJSCoverage();
        
    }); 

    beforeEach(async () => {
        await TestUtils.clearBody(page);
        await TestUtils.createCustomElement(page, id, 'TreezFont', '../../src/components/font/treezFont.js');
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

                element.connectedCallback();

                console.log('options: ' + element.options);

                return element.options === 'serif,sans-serif,cursive,fantasy,monospace';
                
            },{id});
            expect(success).toBe(true);           

        });           
        
    });      

    describe('Private API', ()=>{  

        it('__availableFonts', async ()=>{

            var success = await page.evaluate(({id})=>{
                var element = document.getElementById(id);               

                return element.__availableFonts === 'serif,sans-serif,cursive,fantasy,monospace';
                
            },{id});
            expect(success).toBe(true);           

        });     
        
        it('__createOptionTag', async ()=>{
            var optionTag = TreezFont.__createOptionTag('serif'); 
            expect(optionTag.constructor.name).toBe('HTMLOptionElement');
            expect(optionTag.style.fontFamily).toBe('serif');
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

