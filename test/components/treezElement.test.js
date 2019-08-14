import TreezElement from '../../src/components/treezElement.js';

import TestUtils from '../testUtils.js';



describe('TreezElement', ()=>{    

    var page;      

    beforeAll(async () => { 
        page = await TestUtils.createBrowserPage(); 
        
    }); 

    beforeEach(async () => {
        await TestUtils.clearBody(page);
        await TestUtils.createCustomElement(page, 'treez-element', 'TreezElement', '../src/components/treezElement.js');
    });
    
    describe('State after construction', ()=>{

        it('id',  async ()=>{   
            var property = await page.$eval('#treez-element', element=> element.id);       
            expect(property).toBe('treez-element');
         });
     
     
         it('get value',  async ()=>{   
             var property = await page.$eval('#treez-element', element=> element.value);       
             expect(property).toBe(null);
         });
     
         it('get disabled',  async ()=>{   
             var property = await page.$eval('#treez-element', element=> element.disabled);       
             expect(property).toBe(false);
         });
     
         it('get hidden',  async ()=>{   
             var property = await page.$eval('#treez-element', element=> element.hidden);       
             expect(property).toBe(false);
         });
     
         it('get width',  async ()=>{   
             var property = await page.$eval('#treez-element', element=> element.width);       
             expect(property).toBe(null);
         });
     
         it('__parentAtom',  async ()=>{   
             var property = await page.$eval('#treez-element', element=> element.__parentAtom);       
             expect(property).toBe(undefined);
         });
     
         it('__listeners',  async ()=>{   
             var property = await page.$eval('#treez-element', element=> element.__listeners);       
             expect(property).toEqual([]);
          });
    });

    describe('Public API', ()=>{    

        it('hide', ()=>{
            var elementMock = {style: { display: undefined}};
    
            TreezElement.hide(elementMock, true);
            expect(elementMock.style.display).toBe('none');
    
            TreezElement.hide(elementMock, false);
            expect(elementMock.style.display).toBe(null);
        });
    
        it('observedAttributes', ()=>{
            expect(TreezElement.observedAttributes).toEqual(['value', 'disabled', 'hidden', 'width']);
        });

        it('convertFromStringValue', async ()=>{
            var value = await page.$eval('#treez-element', element=> element.convertFromStringValue('stringValue'));       
            expect(value).toEqual('stringValue');           
        });

        it('convertToStringValue', async ()=>{
            var value = await page.$eval('#treez-element', element=> element.convertToStringValue('stringValue'));       
            expect(value).toEqual('stringValue');           
        });

        it('updateElements', async ()=>{ 
            await page.$eval('#treez-element', element=> element.updateElements('newValue'));                     
        });

        it('updateWidth', async ()=>{ 
            var width = await page.$eval('#treez-element', element=> element.style.width);
            expect(width).toBe('');
                        
            await page.evaluate(()=>{
                var element = document.getElementById('treez-element');
                element.updateWidth('100%');
            });

            var updatedWidth = await page.$eval('#treez-element', element=> element.style.width);

            expect(updatedWidth).toBe(''); //style.width cannot be set for a pure HTMLElement without content
                      
        });

        it('disableElements', async ()=>{ 
            expect(page.$eval('#treez-element', element=> element.disableElements(true))).rejects.toThrowError();           
        });

        it('hideElements', async ()=>{ 
            expect(page.$eval('#treez-element', element=> element.hideElements(true))).rejects.toThrowError();           
        });

        describe('bindValue', async ()=>{ 

            beforeEach(async ()=>{

                await page.evaluate(()=>{
                    var atomMock = {property: '33'}; 
                    window.atomMock = atomMock;

                    var element = document.getElementById('treez-element');
                    element.bindValue(atomMock, () => atomMock.property);
                });
            });

            it('element value should equal atom value after binding', async ()=>{
                var bindedElementValue = await page.$eval('#treez-element', element=> element.value);
                expect(bindedElementValue).toBe('33');
            });

            it('changing element value should change atom value', async ()=>{
                await page.evaluate(()=>{
                    var element = document.getElementById('treez-element');
                    element.value = '66';
                });
    
                var updatedElementValue = await page.$eval('#treez-element', element=> element.value);
                expect(updatedElementValue).toBe('66');
    
                var atomProperty = await page.$eval('#treez-element', element=> window.atomMock.property);
                expect(atomProperty).toBe('66'); 
            });

            it('changing atom value should change element value', async ()=>{
                await page.evaluate(()=>{               
                    window.atomMock.property='99';
                });
    
                var newElementValue = await page.$eval('#treez-element', element=> element.value);
                expect(newElementValue).toBe('99');
            }); 
                     
        });
        
    });
    
    describe('Private API', ()=>{
        it('', ()=>{
        
        });
    });

    
   
    afterAll(async () => {
        await TestUtils.close(page);        
    });     

});

