angular.module('pedidos')
    .filter('comma2decimal', [
    function() { // should be altered to suit your needs
        return function(input) {
            var ret = input.toString();

            if(input.toString().indexOf('.') !==1){
                var ret = input.toString().replace(/\./g,'');  
            }
            ret = ret.replace(',', '.');
            return ret;
        };
    }]);