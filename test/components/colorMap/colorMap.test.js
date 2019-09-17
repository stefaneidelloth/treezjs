import ColorMap from '../../../src/components/colorMap/colorMap.js';

describe('ColorMap', ()=>{

    it('number of values', ()=>{  
        expect(ColorMap.values.length).toBe(20);   
    });    

});