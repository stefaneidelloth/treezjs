import CustomElementsMock from '../../customElementsMock.js';
import TreezImageComboBox from '../../../src/components/comboBox/treezImageComboBox.js';
import Color from '../../../src/components/color/color.js';

jest.mock('../../../src/components/comboBox/treezImageComboBox.js', function(){
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

describe('TreezEnumImageComboBox', ()=>{
    
    let id = 'treez-enum-image-combo-box';

    let page;      

    beforeAll(async () => { 
        page = await TestUtils.createBrowserPage(); 
        await page.coverage.startJSCoverage();        
    }); 

    beforeEach(async () => {
        await TestUtils.clearBody(page);
        await TestUtils.createCustomElement(page, id, 'TreezEnumImageComboBox', '../../src/components/comboBox/treezEnumImageComboBox.js');
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
                    element.enum = window.Color;
                    console.log('Options: ' + element.options);

                    let value = element.convertFromStringValue('undefined');
                    return value === window.Color.black;
                },{id});
                expect(success).toBe(true);
            });

            it('enum value string', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    element.enum = window.Color;
                    let value = element.convertFromStringValue('blue');
                    return value === window.Color.blue;
                },{id});
                expect(success).toBe(true);
            });

        });

        describe('convertToStringValue', ()=>{

            it('convert enum value', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    let value = element.convertToStringValue(window.Color.blue);
                    return value === 'blue';
                },{id});
                expect(success).toBe(true);
            });

            it('convert string value', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);
                    let value = element.convertToStringValue('blue');
                    return value === 'blue';
                },{id});
                expect(success).toBe(true);
            });

        });

        describe('set enum',  ()=>{

            it('common usage', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);

                    console.log('options before: ' + element.options);
                    let hasNoOptionsBefore = element.getAttribute('options') === null;
                    element.enum = window.Color;
                    let hasOptionsAfter = element.getAttribute('options') === '["' + window.Color.names.join('","') + '"]';

                    return hasNoOptionsBefore &&
                        hasOptionsAfter;
                },{id});
                expect(success).toBe(true);

            });

            it('falsy value', async ()=>{
                let success = await page.evaluate(({id})=>{
                    let element = document.getElementById(id);

                    console.log('options before: ' + element.options);
                    let hasNoOptionsBefore = element.getAttribute('options') === null;
                    element.enum = null;
                    let hasNoOptionsAfter = element.getAttribute('options') === '[]';

                    return hasNoOptionsBefore &&
                        hasNoOptionsAfter;
                },{id});
                expect(success).toBe(true);

            });
        });



        it('get enum', async ()=>{
            let success = await page.evaluate(({id})=>{
                let element = document.getElementById(id);

                let enumIsNotSetBefore = element.enum === undefined;

                element.enum = window.Color;

                let enumIsSetAfter = element.enum === window.Color;

                return enumIsNotSetBefore &&
                    enumIsSetAfter;
            },{id});
            expect(success).toBe(true);

        });

        it('set options throws error', async ()=>{
            let success = await page.evaluate(({id})=>{
                let element = document.getElementById(id);

                try{
                    element.options = window.Color;
                    return false;
                } catch(error){
                    return true;
                }

            },{id});
            expect(success).toBe(true);

        });

        describe('get options',  ()=>{

            it('without enum', async ()=> {
                let success = await page.evaluate(({id}) => {
                    let element = document.getElementById(id);

                    return element.options.length === 0;
                }, {id});
                expect(success).toBe(true);
            });

            it('with enum', async ()=> {
                let success = await page.evaluate(({id}) => {
                    let element = document.getElementById(id);
                    element.enum = window.Color;

                    return (element.options.length === window.Color.values.length) &&
                        (element.options[0] === window.Color.values[0]);
                }, {id});
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