import puppeteer from 'puppeteer';
import express from 'express';

export default class TestUtils {

    static selectPort(){
        let port = 4444;
        const index = Math.max(process.argv.indexOf('--port'), process.argv.indexOf('-p'))
        if (index !== -1) {
            port = +process.argv[index + 1] || port;
        }
        return port;
    }

    static async createBrowserPage(){
        const port = TestUtils.selectPort();
       
        const fileServer = await express()  
                    .use(express.static('.'))                          
                    .listen(port); 
        
        var browser = await puppeteer.launch({
          headless: false,
          slowMo: 80,
          userDataDir: '.chrome',
          args: ['--auto-open-devtools-for-tabs']         
        });
        
        var pages = await browser.pages();        
        var page = pages[0];
        await page.goto('http://localhost:'+port + '/test/index.html');
        
        return page;
    }

    static async close(page){
        var browser = await page.browser();
        browser.close();
    }

    static async createCustomElement(page, tagName, className, importPath, id=tagName){  

        var moduleScript = "import " + className + " from '" + importPath + "';\n" +
        "if(!window.customElements.get('" + tagName + "')){\n" +
        "    window.customElements.define('" + tagName + "', " + className + ");\n" +
        "}\n" +
        "var element = document.createElement('" + tagName + "');\n" +   
        "element.id='" + id + "';\n" +         
        "document.body.appendChild(element);";

        await page.evaluate(({moduleScript}) => {            
            var script = document.createElement('script');
            script.type = 'module';
            script.innerHTML = moduleScript; 
            document.head.appendChild(script);            
        },{moduleScript}); 
    }

    static async importModule(page, className, importPath){  

        var moduleScript = "import " + className + " from '" + importPath + "';\n"; 

        await page.evaluate(({moduleScript}) => {            
            var script = document.createElement('script');
            script.type = 'module';
            script.innerHTML = moduleScript; 
            document.head.appendChild(script);            
        },{moduleScript}); 
    }

    static async importScript(page, src){
        await page.evaluate(({src}) => {
            var script = document.createElement('script');
            script.src = src;
            document.head.appendChild(script);
        },{src});
    }

    static async clearBody(page){
        await page.evaluate(()=>{
            while(document.body.firstChild){
                document.body.firstChild.remove();
            }
        });
    }

    static expectCoverage(coverageArray, index, minExpectedCoverage){
        let report = coverageArray[index];

        let  totalBytes = report.text.length;
        let usedBytes = 0;
        for (const range of report.ranges) {
            usedBytes += range.end - range.start;
        }

        const coverage = ((usedBytes / totalBytes)* 100);

        try{
            expect(coverage).toBeGreaterThanOrEqual(minExpectedCoverage);
            let message = 'Coverage check succeeded for ' + report.url +'.\nCoverage is ' + coverage + '.';
            console.log(message);
        } catch(error){
            let message = 'Coverage check failed for ' + report.url +'.\nCoverage is ' + coverage + ', being less than ' + minExpectedCoverage +'.'
            console.error(message);
        }

    }

}