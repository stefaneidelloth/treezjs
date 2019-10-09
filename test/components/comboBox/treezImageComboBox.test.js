import CustomElementsMock from '../../customElementsMock.js';

import TreezImageComboBox from '../../../src/components/comboBox/treezImageComboBox.js';

import TestUtils from '../../testUtils.js';

import puppeteerToIstanbul from 'puppeteer-to-istanbul';

import TreezComboBox from '../../../src/components/comboBox/treezComboBox.js';
jest.mock('../../../src/components/comboBox/treezComboBox.js', function(){
    const constructor = jest.fn();
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

jest.setTimeout(100000);

describe('TreezImageComboBox', ()=>{

    const id = 'treez-image-combo-box';

    let page;

    beforeAll(async () => { 
        page = await TestUtils.createBrowserPage(); 
        await page.coverage.startJSCoverage();
        
    }); 

    beforeEach(async () => {
        await TestUtils.clearBody(page);
        await TestUtils.createCustomElement(page, id, 'TreezImageComboBox', '../../src/components/comboBox/treezImageComboBox.js');
    });
    
    describe('State after construction', ()=>{

        it('id',  async ()=>{
            const property = await page.$eval('#' + id, element => element.id);
            expect(property).toBe(id);
         });           
        
    });

    describe('Public API', ()=>{  

        it('connectedCallback', async ()=>{

            const success = await page.evaluate(({id}) => {
                const element = document.getElementById(id);

                removeExistingChildren(element);
                const methodCalls = prepareMocks(element);

                element.connectedCallback();

                console.log('methodCalls[updateElements]: ' + methodCalls['updateElements']);
                console.log('methodCalls[__recreateOptionTags]: ' + methodCalls['__recreateOptionTags']);

                const methodsAreCalled = (methodCalls['updateElements'] === null) &&
                    (methodCalls['disableElements'] === false) &&
                    (methodCalls['hideElements'] === false) &&
                    (methodCalls['__recreateOptionTags'] === undefined) &&
                    (methodCalls['__collapseComboBox'] === true);

                console.log('methods are called:' + methodsAreCalled);

                const containerIsCreated = element.childNodes.length === 1;
                console.log('container is created:' + containerIsCreated);

                const container = element.firstChild;

                const label = container.firstChild;
                const labelIsCreated = label.constructor.name === 'HTMLLabelElement';
                console.log('label is created: ' + labelIsCreated);

                const comboBox = container.lastChild;
                const comboBoxIsCreated = comboBox.constructor.name === 'HTMLDivElement';
                console.log('combo box is created: ' + comboBoxIsCreated);

                const comboBoxDisplay = comboBox.firstChild;

                const imageLabel = comboBoxDisplay.firstChild;
                const imageLabelIsCreated = imageLabel.constructor.name === 'HTMLImageElement';
                console.log('image label is created: ' + imageLabelIsCreated);

                const comboButton = comboBoxDisplay.lastChild;
                const comboButtonIsCreated = comboButton.constructor.name === 'HTMLSpanElement';
                console.log('combo button is created: ' + comboButtonIsCreated);

                const optionPanel = comboBox.lastChild;
                const optionPanelIsCreated = optionPanel.constructor.name === 'HTMLDivElement';
                console.log('option panel is created: ' + optionPanelIsCreated);


                return methodsAreCalled &&
                    containerIsCreated &&
                    labelIsCreated &&
                    comboBoxIsCreated &&
                    imageLabelIsCreated &&
                    comboButtonIsCreated &&
                    optionPanelIsCreated;


                function removeExistingChildren(element) {

                    element.__container = undefined;
                    element.__label = undefined;
                    element.__comboBox = undefined;
                    element.__imageLabel = undefined;
                    element.__comboButton = undefined;
                    element.__optionPanel = undefined;

                    while (element.firstChild) {
                        element.firstChild.remove();
                    }
                }

                function prepareMocks(element) {
                    const methodCalls = {};
                    element.label = 'labelText';
                    element.updateElements = (value) => {
                        methodCalls['updateElements'] = value;
                    };

                    element.disableElements = (disabled) => {
                        methodCalls['disableElements'] = disabled;
                    };

                    element.hideElements = (hidden) => {
                        methodCalls['hideElements'] = hidden;
                    };

                    element.__recreateOptionTags = () => {
                        methodCalls['__recreateOptionTags'] = true;
                    };

                    element.__collapseComboBox = () => {
                        methodCalls['__collapseComboBox'] = true;
                    };

                    return methodCalls;
                }

            }, {id});
            expect(success).toBe(true);           

        });       
        
        it('beforeConnectedCallbackHook', async ()=>{

            const success = await page.evaluate(({id}) => {
                const element = document.getElementById(id);
                return element.beforeConnectedCallbackHook !== undefined;
            }, {id});
            expect(success).toBe(true);           

        });     

        it('updateElements', async ()=>{

            const success = await page.evaluate(({id}) => {
                const element = document.getElementById(id);

                const methodCalls = {};
                element.__updateImageLabel = () => {
                    methodCalls['__updateImageLabel'] = true;
                }

                element.updateElements();

                return methodCalls['__updateImageLabel'] === true;

            }, {id});
            expect(success).toBe(true);           

        });    

        it('disableElements', async ()=>{

            const success = await page.evaluate(({id}) => {
                const element = document.getElementById(id);

                const isNotDisabledBefore = element.__comboButton.disabled === false;

                element.disableElements(true);

                const isDisabledAfter = element.__comboButton.disabled === true;

                return isNotDisabledBefore && isDisabledAfter;

            }, {id});
            expect(success).toBe(true);           

        });    

        it('hideElements', async ()=>{

            const success = await page.evaluate(({id}) => {
                const element = document.getElementById(id);

                const isNotHiddenBefore = element.__container.style.display === '';

                element.hideElements(true);

                const isHiddenAfter = element.__container.style.display === 'none';

                return isNotHiddenBefore && isHiddenAfter;

            }, {id});
            expect(success).toBe(true);           

        });   
        
    });      

    describe('Private API', ()=>{  

        it('__comboBoxChanged', async ()=>{

            const success = await page.evaluate(({id}) => {
                const element = document.getElementById(id);

                const valueIsNullBefore = element.value === null;

                element.__comboBoxChanged('A');

                const valueIsSetAfter = element.value === 'A';

                return valueIsNullBefore && valueIsSetAfter;

            }, {id});
            expect(success).toBe(true);           

        });   
    
        it('__updateImageLabel', async ()=>{

            const success = await page.evaluate(({id}) => {
                const element = document.getElementById(id);

                Object.defineProperty(element, '__selectedImageUrl', {
                    get: function () {
                        return 'urlMock';
                    }
                });

                element.__updateImageLabel();

                return element.__imageLabel.getAttribute('src') === 'urlMock';

            }, {id});
            expect(success).toBe(true);           

        });   
    
        it('__expandComboBox', async ()=>{

            const success = await page.evaluate(({id}) => {
                const element = document.getElementById(id);

                const optionPanelIsHiddenBefore = element.__optionPanel.style.display === 'none';
                element.__expandComboBox();
                const optionPanelIsShownAfter = element.__optionPanel.style.display === 'block';

                return optionPanelIsHiddenBefore && optionPanelIsShownAfter;

            }, {id});
            expect(success).toBe(true);           

        });   
    
        it('__collapseComboBox', async ()=>{

            const success = await page.evaluate(({id}) => {
                const element = document.getElementById(id);

                element.__expandComboBox();
                const optionPanelIsShownBefore = element.__optionPanel.style.display === 'block';

                element.__collapseComboBox();
                const optionPanelIsHiddenAfter = element.__optionPanel.style.display === 'none';

                return optionPanelIsShownBefore && optionPanelIsHiddenAfter;

            }, {id});
            expect(success).toBe(true);           

        });   
    
        describe('__selectedImageUrl', ()=>{

            it('with value', async ()=>{

                const success = await page.evaluate(({id}) => {
                    const element = document.getElementById(id);
                    element.value = 'foo';
                    element.__nameToImageUrl = () => {
                        return 'urlMock'
                    };
                    return element.__selectedImageUrl === 'urlMock';

                }, {id});
                expect(success).toBe(true);

            });

            it('without value and with options', async ()=>{

                const success = await page.evaluate(({id}) => {
                    let element = document.getElementById(id);
                    element.value = null;
                    element.options = 'A,B,C';
                    const methodCalls = {}
                    element.__nameToImageUrl = (value) => {
                        methodCalls['__nameToImageUrl'] = value;
                        return 'urlMock';
                    };

                    const selectedUrl = element.__selectedImageUrl;

                    const methodIsCalled = methodCalls['__nameToImageUrl'] === 'A';
                    console.log('methodIsCalled: ' + methodIsCalled);

                    return methodIsCalled && selectedUrl === 'urlMock';

                }, {id});
                expect(success).toBe(true);

            });

            it('without value and without options', async ()=>{

                const success = await page.evaluate(({id}) => {
                    const element = document.getElementById(id);
                    element.value = null;
                    return element.__selectedImageUrl === undefined;

                }, {id});
                expect(success).toBe(true);

            });

        });   
    
        it('__nameToImageUrl', async ()=>{

            const success = await page.evaluate(({id}) => {
                const element = document.getElementById(id);

                let url = element.__nameToImageUrl('A');
                return url === '/src/components/comboBox/A.png';

            }, {id});
            expect(success).toBe(true);           

        });   

        it('__recreateOptionTags', async ()=>{

            const success = await page.evaluate(({id}) => {
                const element = document.getElementById(id);

                let optionPanel = element.__optionPanel;

                let hasNoOptionTagsBefore = optionPanel.childNodes.length === 0;
                element.attributeChangedCallback = () => {};
                element.options ='A,B';

                element.__recreateOptionTags();

                let hasOptionTagsAfter = optionPanel.childNodes.length === 2;

                return hasNoOptionTagsBefore && hasOptionTagsAfter;

            }, {id});
            expect(success).toBe(true);           

        });   
    
        it('__clearOptionPanel', async ()=>{

            const success = await page.evaluate(({id}) => {
                let element = document.getElementById(id);
                let optionPanel = element.__optionPanel;

                var dummyElement = document.createElement('div');
                optionPanel.appendChild(dummyElement);

                element.__clearOptionPanel();

                return optionPanel.childNodes.length === 0;

            }, {id});
            expect(success).toBe(true);           

        });
    
        describe('__hasOption',  ()=>{

            it('existing option', async ()=>{

                const success = await page.evaluate(({id}) => {
                    const element = document.getElementById(id);
                    element.options = 'A,B,C';
                    return element.__hasOption('C') === true;

                }, {id});
                expect(success).toBe(true);

            });

            it('missing option', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);
                    element.options = 'A,B,C';
                    return element.__hasOption('D') === false;
                }, {id});
                expect(success).toBe(true);

            });

        });   
    
        describe('__refreshSelectedValue',  ()=>{

            it('existing value', async ()=>{

                const success = await page.evaluate(({id}) => {
                    const element = document.getElementById(id);

                    element.__hasOption = ()=>{return true};
                    let methodCalls = {};
                    element.__tryToSelectFirstOption = ()=>{
                      methodCalls['tryToSelectFirstOption'] = true;
                    };

                    element.__refreshSelectedValue();

                    return methodCalls['tryToSelectFirstOption'] === undefined;

                }, {id});
                expect(success).toBe(true);

            });

            it('missing value', async ()=>{

                const success = await page.evaluate(({id}) => {
                    const element = document.getElementById(id);

                    element.__hasOption = ()=>{return false};
                    let methodCalls = {};
                    element.__tryToSelectFirstOption = ()=>{
                        methodCalls['tryToSelectFirstOption'] = true;
                    };

                    element.__refreshSelectedValue();

                    return methodCalls['tryToSelectFirstOption'] === true;

                }, {id});
                expect(success).toBe(true);

            });

        });   

        describe('__tryToSelectFirstOption',  ()=>{

            it('without options', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);
                    element.value = 'C';
                    element.__tryToSelectFirstOption();

                    return element.value === 'C';

                }, {id});
                expect(success).toBe(true);

            });

            it('with options', async ()=>{

                const success = await page.evaluate(async ({id}) => {
                    const element = await document.getElementById(id);
                    element.value = 'C';
                    element.options = 'A,B,C';

                    element.__tryToSelectFirstOption();

                    return element.value === 'A';

                }, {id});
                expect(success).toBe(true);

            });

        });

        it('get __imageFormat', async ()=>{

            const success = await page.evaluate(({id}) => {
                const element = document.getElementById(id);
                return element.__imageFormat === '.png';

            }, {id});
            expect(success).toBe(true);

        });

        it('get __optionItems', async ()=>{

            const success = await page.evaluate(({id}) => {
                const element = document.getElementById(id);
                element.options = 'foo,baa,qux';
                let array = element.__optionItems;

                return array.length === 3 && array[0] === 'foo' && array[2] === 'qux';

            }, {id});
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

