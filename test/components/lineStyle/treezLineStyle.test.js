import CustomElementsMock from '../../customElementsMock.js';
import TreezImageComboBox from '../../../src/components/comboBox/treezImageComboBox.js'; //TODO: mock after jest supports testing custom components
import LineStyle from '../../../src/components/lineStyle/lineStyle.js'; //TODO: mock after jest supports testing custom components

import TestUtils from '../../testUtils.js';

import puppeteerToIstanbul from 'puppeteer-to-istanbul';

jest.setTimeout(100000);

describe('TreezLineStyle', ()=>{   
    
    var id = 'treez-line-style';

    var page;      

    beforeAll(async () => { 
        page = await TestUtils.createBrowserPage(); 
        await page.coverage.startJSCoverage();
        
    }); 

    beforeEach(async () => {
        await TestUtils.clearBody(page);
        await TestUtils.createCustomElement(page, id, 'TreezLineStyle', '../../src/components/lineStyle/treezLineStyle.js');
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
                removeExistingAttributesAndChildren(element);
                console.log('options before:' + element.options);
               

                element.beforeConnectedCallbackHook(); 
                
                console.log('options after:' + element.options);
                var optionsAreSet = element.options === window.LineStyle.names.join(','); 
                console.log('options are set: ' + optionsAreSet);

                return optionsAreSet;

                function removeExistingAttributesAndChildren(element){
                    element.options = undefined;                   
                    while(element.firstChild){
                        element.firstChild.remove();
                    }   
                }                

            },{id});

            expect(success).toBe(true);                   

        });       
       
       
        
        describe('get value', async () =>{

            it('default value', async () =>{
                var success = await page.evaluate(async ({id})=>{
                    var element = await document.getElementById(id);
                         
                    var value = element.value  
                    console.log('default value: ' + value);
    
                    return value === window.LineStyle.none;
    
                },{id});
                expect(success).toBe(true);
            });

            it('known LineStyle name', async () =>{
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);  
                    
                    element.setAttribute('value',window.LineStyle.solid.name);
                         
                    var value = element.value  
    
                    return value === window.LineStyle.solid; 
    
                },{id});
                expect(success).toBe(true);
            });

            it('unknown LineStyle name results in null value', async () =>{
                var success = await page.evaluate(({id})=>{
                    var element = document.getElementById(id);

                    var method = window.LineStyle.forName;
                    window.LineStyle.forName = () => {throw 'error'};
                    
                    var value = element.value;
                    window.LineStyle.forName = method;

                    return value === null;                                      
    
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

