import CustomElementsMock from '../../customElementsMock.js';
import TreezImageComboBox from '../../../src/components/comboBox/treezImageComboBox.js'; //TODO: mock after jest supports testing custom components
import ErrorBarStyle from '../../../src/components/errorBarStyle/errorBarStyle.js'; //TODO: mock after jest supports testing custom components

import TestUtils from '../../testUtils.js';

import puppeteerToIstanbul from 'puppeteer-to-istanbul';

jest.setTimeout(100000);

describe('TreezErrorBarStyle', ()=>{   
    
    var id = 'treez-error-bar-style';

    var page;      

    beforeAll(async () => { 
        page = await TestUtils.createBrowserPage(); 
        await page.coverage.startJSCoverage();
        
    }); 

    beforeEach(async () => {
        await TestUtils.clearBody(page);
        await TestUtils.createCustomElement(page, id, 'TreezErrorBarStyle', '../../src/components/errorBarStyle/treezErrorBarStyle.js');
    });
    
    describe('State after construction', ()=>{

        it('id',  async ()=>{   
            var property = await page.$eval('#' + id, element=> element.id);       
            expect(property).toBe(id);
         });           
        
    });

    describe('Public API', ()=>{

        it('beforeConnectedCallbackHook', async ()=>{

            var success = await page.evaluate(({id})=>{

                var element = document.getElementById(id);

                element.enum = undefined;

                element.beforeConnectedCallbackHook();

                return element.enum === window.ErrorBarStyle;

            },{id});

            expect(success).toBe(true);

        });

        it('imageFolderPath', async () =>{
            var success = await page.evaluate(async ({id})=>{
                var element = await document.getElementById(id);
                return element.imageFolderPath === 'errorBarStyle';
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

