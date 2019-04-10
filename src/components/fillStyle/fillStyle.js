import Enum from './../enum.js';

export default class FillStyle extends Enum {}
  
FillStyle.solid = new FillStyle('solid');                    
FillStyle.vertical = new FillStyle('vertical');                    
FillStyle.horizontal = new FillStyle('horizontal');                    
FillStyle.cross = new FillStyle('cross');