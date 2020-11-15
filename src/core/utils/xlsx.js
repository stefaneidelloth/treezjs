import Treez from '../../treez.js';

export default class Xlsx {	

	static async downloadFile(fileName, data){
		var blob = await this.createBlob(fileName, data);	
		this.__downloadBlob(fileName, blob);
	}	

	static async createBlob(filePath, data){

		await this.__initializeXlsxJs();

        var workbook = XLSX.utils.book_new();
        var worksheet = XLSX.utils.aoa_to_sheet(data);
        workbook.SheetNames.push('Tabelle1')
        workbook.Sheets['Tabelle1'] = worksheet;

		var extension = filePath.split('.').pop();
		
		var options = {
			bookType: extension, 
			FS: ";", //separator used for *.csv files
			type: "binary"
		};		
		var binary = XLSX.write(workbook, options);
		return new Blob([this.__binaryStringToArrayBuffer(binary)], { type: "application/octet-stream" });
	}

	static async __downloadBlob(fileName, blob){
		var a = document.createElement('a');
        a.download = fileName
        a.href = window.URL.createObjectURL(blob)

        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click');
        a.dispatchEvent(event);		
	}

	static __binaryStringToArrayBuffer(s) { 
		var buffer = new ArrayBuffer(s.length); //convert s to arrayBuffer
		var view = new Uint8Array(buffer);  //create uint8array as viewer
		for (var i=0; i<s.length; i++){
			view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
		} 
		return buffer;    
    }

    static async readFile(file){
        
        await this.__initializeXlsxJs();
      
        return new Promise((resolve, reject)=>{
            var reader = new FileReader();
            reader.onload = event =>  {
                try{
                    var result = reader.result;
                    var dataArray = new Uint8Array(result);
                    var workbook = XlsxJs.read(dataArray, {type: 'array'});

                    const firstSheetName = workbook.SheetNames[0];  
                    const worksheet = workbook.Sheets[firstSheetName];
                    const data = XlsxJs.utils.sheet_to_json(worksheet,{header:1});                
                    resolve(data); 
                } catch(error){
                    reject(error);
                }
               
            };

            try{                
                reader.readAsArrayBuffer(file);
            } catch (error){
                reject(error);
            }
        }) ;  
       
    }

    static async __initializeXlsxJs(){
    	if(!window.requirejs){
        	 window.requirejs = await Treez.importScript('/node_modules/requirejs/require.js','require')
                                        .catch(error => {
                                            console.log(error);
                                            throw error;
                                        });			
        }

        if(!window.XlsxJs){
        	
        	await new Promise((resolve, reject) => {
				window.requirejs([
					'node_modules/xlsx/dist/xlsx.full.min'					
				], function(
					 XlsxJs
				) {
					window.XlsxJs = XlsxJs;
					resolve();
				}, function(error){
					console.log(error);
					reject(error);
				});
			});
		}
    }
    
}