import CustomElementsMock from '../../customElementsMock.js';
import TreezComboBox from '../../../src/components/comboBox/treezComboBox.js';
import Color from '../../../src/components/color/color.js';

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

import TreezEnumComboBox from '../../../src/components/comboBox/treezEnumComboBox.js';

import TestUtils from '../../testUtils.js';

import puppeteerToIstanbul from 'puppeteer-to-istanbul';

jest.setTimeout(100000);

describe('TreezEnumComboBox', ()=>{   
    
    let id = 'treez-enum-combo-box';

    let page;      

    beforeAll(async () => { 
        page = await TestUtils.createBrowserPage(); 
        await page.coverage.startJSCoverage();        
    }); 

    beforeEach(async () => {
        await TestUtils.clearBody(page);
        await TestUtils.createCustomElement(page, id, 'TreezEnumComboBox', '../../src/components/comboBox/treezEnumComboBox.js');
        await TestUtils.importModule(page, 'Color', '../../../src/components/color/color.js');
    });
    
    describe('State after construction', ()=>{

        it('id',  async ()=>{   
            let property = await page.$eval('#' + id, element=> element.id);       
            expect(property).toBe(id);
         });           
        
    });

    describe('Public API', ()=>{ 
        
        describe('convertFromStringValue', ()=>{   

            it('without options an error is thrown', async ()=>{   
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);

                    try{
                        let value = element.convertFromStringValue('undefined');
                        return false;
                    } catch (error){
                        return true;
                    } 
                   
                },{id});
                expect(success).toBe(true);  
            }); 

            it('undefined string', async ()=>{ 
                let success = await page.evaluate(({id})=>{                    

                    let element = document.getElementById(id);
                    element.options = window.Color;
                    console.log('Options: ' + element.options);

                    let value = element.convertFromStringValue('undefined');
                    return value === window.Color.black;
                },{id});
                expect(success).toBe(true);  
            }); 

            it('enum value string', async ()=>{   
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    element.options = window.Color;
                    let value = element.convertFromStringValue('blue');
                    return value === window.Color.blue;
                },{id});
                expect(success).toBe(true);  
            }); 

        }); 
       
        it('set options', async ()=>{           
            let success = await page.evaluate(({id})=>{
                let element = document.getElementById(id);

                console.log('options before: ' + element.options);
                let hasNoOptionsBefore = element.getAttribute('options') === null;
                element.options = window.Color;                
                let hasOptionsAfter = element.getAttribute('options') === '["' + window.Color.names.join('","') + '"]';
                
                return hasNoOptionsBefore && 
                        hasOptionsAfter;
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