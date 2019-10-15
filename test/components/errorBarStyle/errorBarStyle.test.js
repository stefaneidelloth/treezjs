import ErrorBarStyle from '../../../src/components/errorBarStyle/errorBarStyle.js';

describe('ErrorBarStyle', ()=>{

    it('number of values', ()=>{  
        expect(ErrorBarStyle.values.length).toBe(16);   
    });

});