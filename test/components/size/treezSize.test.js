import CustomElementsMock from '../../customElementsMock.js';

import TreezSize from '../../../src/components/size/treezSize.js';

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

describe('TreezSize', ()=>{

    var id = 'treez-size';

    var page;

    beforeAll(async () => {
        page = await TestUtils.createBrowserPage();
        await page.coverage.startJSCoverage();

    });

    beforeEach(async () => {
        await TestUtils.clearBody(page);
        await TestUtils.createCustomElement(page, id, 'TreezSize', '../../src/components/size/treezSize.js');
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

                return element.options.toString() === ['0pt','0.25pt','0.5pt','1pt',
                    '1.5pt','2pt','3pt','4pt','5pt','6pt','8pt','10pt',
                    '12pt','14pt','16pt','18pt','20pt',
                    '22pt','24pt','26pt','28pt','30pt',
                    '34pt','40pt','44pt','50pt','60pt','70pt'
                ].toString();

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

