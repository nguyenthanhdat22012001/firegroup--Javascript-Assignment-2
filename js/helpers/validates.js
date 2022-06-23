// validate
export function validateString(str) {
    if(typeof str == 'string'){
       return str;
    }
    throw new Error(`${str} is type ${typeof str}, not string`);
  }
  
  export  function validatedArray(arr) {
    if (Array.isArray(arr)) {
        return arr;
    }
    throw new Error(`${arr} is type ${typeof(arr)}, not array`);
  }
  
  export function validateKeyExistAndHasValueInObject(obj,key) {
    if(obj[key] != "" && obj[key] != undefined){
      return true;
    }
  
    return false;
  }
  
  export  function validateKeyExistInObject(obj,key) {
    if(obj[key] != undefined){
      return true;
    }
  
    return false;
  }
  
  export function validateArrayEmpty(arr){
    if(arr.length > 0){
        return false;
    }else{
        return true;
    }
  }
  