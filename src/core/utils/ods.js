
export default class Ods {

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