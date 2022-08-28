function sliceString(string,letters){
    if(string.length<letters){
        return string;
    }else{
        return string.slice(0,letters)+'...';
    }
}
function capitalFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }