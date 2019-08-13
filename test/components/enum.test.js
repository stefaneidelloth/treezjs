import Enum from '../../src/components/enum.js';
import { exportAllDeclaration } from '@babel/types';

describe('Enum', ()=>{
    
    var demoEnumClass;

    beforeEach(()=>{
        class DemoEnum extends Enum {}       
        DemoEnum.first = new DemoEnum('first');
        DemoEnum.second = new DemoEnum('second');  

        demoEnumClass = DemoEnum;        
    });

    it('values', ()=>{
        var values = demoEnumClass.values;
        expect(values.length).toBe(2);
        expect(values[0]).toBe(demoEnumClass.first);
        expect(values[1]).toBe(demoEnumClass.second);
    });

    it('names', ()=>{
        var names = demoEnumClass.names;
        expect(names.length).toBe(2);
        expect(names[0]).toBe('first');
        expect(names[1]).toBe('second');
    });

    it('forName', ()=>{        
        expect(demoEnumClass.forName('first')).toBe(demoEnumClass.first);
        expect(demoEnumClass.forName('second')).toBe(demoEnumClass.second);
        
        expect(()=>{demoEnumClass.forName('unknown')}).toThrowError();
    });

    it('importLocation', ()=>{     
        //hard to test normal behaviour here / not worth the effort ... because tests are located in 
        //folder /test/ and the implementation assumes location under /src/.   
        expect(demoEnumClass.importLocation).toBe('Could not find location of Enum definition. (Only works inside /src/ folder).');        
    });

    it('toString', ()=>{        
        expect(demoEnumClass.first.toString()).toBe('first');    
        expect(demoEnumClass.second.toString()).toBe('second');      
    });

});