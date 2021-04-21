  
export  function errorsFormat(errors: string | any[]){
    let errorFormat: any = {};

    for (let index = 0; index < errors.length; index++) {
         errorFormat[errors[index].param] = errors[index].msg;
    }
    
    return errorFormat;
}