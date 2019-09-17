import Color from '../../../src/components/color/color.js';


describe('Color', ()=>{

    it('construction', ()=>{        
        var customColor = new Color('custom', '#112233');
        expect(customColor.name).toBe('custom');
        expect(customColor.hexString).toBe('#112233');   
    });

    it('toString', ()=>{
        expect(Color.blue.toString()).toBe('blue');

        var customColor = new Color('custom', '#112233');
        expect(customColor.toString()).toBe('#112233');
    });

    describe('forHexString', ()=>{

        it('unknown color', () => {
            expect(() => { Color.forHexString('#112233') }).toThrowError();
        });

        it('known color', () => {
            expect(Color.forHexString('#0000ff')).toBe(Color.blue);
        });

    });

});