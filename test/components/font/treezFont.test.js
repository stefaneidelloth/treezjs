import CustomElementsMock from '../../customElementsMock.js';

import TreezFont from '../../../src/components/font/treezFont.js';

import TestUtils from '../../testUtils.js';

import puppeteerToIstanbul from 'puppeteer-to-istanbul';

import TreezComboBox from '../../../src/components/comboBox/treezComboBox.js';
jest.mock('../../../src/components/comboBox/treezComboBox.js', function(){
        let constructor = jest.fn();
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
    
    let id = 'treez-font';

    let page;      

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
            let property = await page.$eval('#' + id, element=> element.id);       
            expect(property).toBe(id);
         });           
        
    });

    describe('Public API', ()=>{  

        it('connectedCallback', async ()=>{

            let success = await page.evaluate(({id})=>{
                let element = document.getElementById(id);

                element.connectedCallback();

                console.log('options: ' + element.options);

                return element.options.toString() === [
                    'serif',
                    'sans-serif',
                    'cursive',
                    'fantasy',
                    'monospace'
                ].toString();
                
            },{id});
            expect(success).toBe(true);           

        });           
        
    });      

    describe('Private API', ()=>{  

        it('__availableFonts', async ()=>{

            let success = await page.evaluate(({id})=>{
                let element = document.getElementById(id);               

                return element.__availableFonts.toString()  === [
                    'serif',
                    'sans-serif',
                    'cursive',
                    'fantasy',
                    'monospace'
                ].toString();
                
            },{id});
            expect(success).toBe(true);           

        });     
        
        it('__createOptionTag', async ()=>{

            let success = await page.evaluate(({id})=>{
                let element = document.getElementById(id);

                let optionTag = element.__createOptionTag('serif');

                let tagIsCreated = optionTag.constructor.name === 'HTMLOptionElement';
                let fontFamilyIsSet = optionTag.style.fontFamily === 'serif';

                return tagIsCreated && fontFamilyIsSet;

            },{id});
            expect(success).toBe(true);
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

