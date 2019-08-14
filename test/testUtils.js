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

    static async createCustomElement(page, tagName, className, importPath){

        var moduleScript = "import " + className + " from '" + importPath + "';\n" +
        "if(!window.customElements.get('" + tagName + "')){\n" +
        "    window.customElements.define('" + tagName + "', " + className + ");\n" +
        "}\n" +
        "var element = document.createElement('" + tagName + "');\n" +   
        "element.id='" + tagName + "';\n" +         
        "document.body.appendChild(element);";

        await page.evaluate(({moduleScript}) => {            
            var script = document.createElement('script');
            script.type = 'module';
            script.innerHTML = moduleScript; 
            document.head.appendChild(script);            
        },{moduleScript}); 
    }

    static async clearBody(page){
        await page.evaluate(()=>{
            while(document.body.firstChild){
                document.body.firstChild.remove();
            }
        });
    }

}