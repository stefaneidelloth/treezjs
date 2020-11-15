import Treez from '../../treez.js';

export default class Xlsx {

    static async readFile(file){
        
        await this.__initializeExcel();
       
        const workbook = new Excel.Workbook();
        await workbook.xlsx.load(file);

        const worksheet = workbook.worksheets[0];

        var data = [];
        const numberOfRows = worksheet.rowCount;
        for (let rowIndex = 1; rowIndex <= numberOfRows; rowIndex++) {
          const row = worksheet.getRow(rowIndex);
          const rowValues = row.values;
          data.push(rowValues);
          rowValues.shift();          
        }

        return data;
    }

    static async __initializeExcel(){
    	if(!window.requirejs){
        	 window.requirejs = await Treez.importScript('/node_modules/requirejs/require.js','require')
                                        .catch(error => {
                                            console.log(error);
                                            throw error;
                                        });			
        }

        if(!window.Excel){
        	
        	await new Promise((resolve, reject) => {
				window.requirejs([
					'node_modules/exceljs/dist/exceljs.min'					
				], function(
					 ExcelJs
				) {
					window.Excel = ExcelJs;
					resolve();
				}, function(error){
					console.log(error);
					reject(error);
				});
			});
		}
    }
    
}