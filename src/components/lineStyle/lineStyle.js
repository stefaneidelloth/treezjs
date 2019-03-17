class LineStyle extends Enum {
	
	constructor(name, dashArrayString){
		super(name);
		this.dashArrayString = dashArrayString;
	}
}                 

LineStyle.none = new LineStyle('none', '0,9999999999');                    
LineStyle.solid = new LineStyle('solid', 'none');                    
LineStyle.dashed = new LineStyle('dashed', '6,2');                    
LineStyle.dotted = new LineStyle('dotted', '2,2');                    
LineStyle.dashDot = new LineStyle('dash-dot', '6,2,2,2');                    
LineStyle.dashDotDot = new LineStyle('dash-dot-dot', '6,2,2,2,2,2');                    
LineStyle.dottedFine = new LineStyle('dotted-fine', '3,5');                    
LineStyle.dashedFine = new LineStyle('dashed-fine', '11,5');                    
LineStyle.dashDotFine = new LineStyle('dash-dot-fine', '10,6,2,6');                    
LineStyle.dot1 = new LineStyle('dot1', '2,1');                    
LineStyle.dot2 = new LineStyle('dot2', '2,4');                    
LineStyle.dot3 = new LineStyle('dot3', '2,7');                    
LineStyle.dot4 = new LineStyle('dot4', '2,9');                    
LineStyle.dash1 = new LineStyle('dash1', '6,5');                    
LineStyle.dash2 = new LineStyle('dash2', '6,24');                    
LineStyle.dash3 = new LineStyle('dash3', '11,8');                    
LineStyle.dash4 = new LineStyle('dash4', '15,8');                    
LineStyle.dash5 = new LineStyle('dash5', '15,15');                    
LineStyle.dashDot1 = new LineStyle('dash-dot1', '7,4,2,4');                    
LineStyle.dashDot2 = new LineStyle('dash-dot2', '13,4,2,4');                    
LineStyle.dashDot3 = new LineStyle('dash-dot3', '5,2,2,2');       