angular.module('pedidos')

    .directive('isNumber',function(){
    return {
        restrict:'AE',
        require:'ngModel',
        link:function($scope,elem,attrs,ngModel){
            ngModel.$validators.npedido=function(modelValue,viewValue){
                var value=modelValue || viewValue;
                return /^[0-9]+$/.test(value);
            }
        }
    }
}).directive('fancySelect', ['$ionicModal','$timeout','$window',function($ionicModal, $timeout, $window) {
        return {
            /* Only use as <fancy-select> tag */
            restrict : 'E',

            /* Our template */
            templateUrl: 'templates/fancy-select.html',

            /* Attributes to set */
            scope: {
                'items'        : '=', /* Items list is mandatory */
                'text'         : '=', /* Displayed text is mandatory */
                'value'        : '=', /* Selected value binding is mandatory */
                'callback'     : '&',
                'carrega'      : '&',
                'buscando'     : '=',
            },

            link: function (scope, element, attrs) {

                /* Default values */
                scope.multiSelect   = attrs.multiSelect === 'true' ? true : false;
                scope.allowEmpty    = attrs.allowEmpty === 'false' ? false : true;
                /* Header used in ion-header-bar */
                scope.headerText    = attrs.headerText || '';
                /* Text displayed on label */
                // scope.text          = attrs.text || '';
                scope.defaultText   = scope.text || '';

                /* Notes in the right side of the label */
                scope.noteText      = attrs.noteText || '';
                scope.noteImg       = attrs.noteImg || '';
                scope.noteImgClass  = attrs.noteImgClass || '';

                /* Optionnal callback function */

                // scope.callback = attrs.callback || null;

                /* Instanciate ionic modal view and set params */

                /* Some additionnal notes here : 
                     * 
                     * In previous version of the directive,
                     * we were using attrs.parentSelector
                     * to open the modal box within a selector. 
                     * 
                     * This is handy in particular when opening
                     * the "fancy select" from the right pane of
                     * a side view. 
                     * 
                     * But the problem is that I had to edit ionic.bundle.js
                     * and the modal component each time ionic team
                     * make an update of the FW.
                     * 
                     * Also, seems that animations do not work 
                     * anymore.
                     * 
                     */
                $ionicModal.fromTemplateUrl(
                    'templates/fancy-select-items.html',
                    {'scope': scope,

                    }
                ).then(function(modal) {
                    scope.modal = modal;
                });




                /* Validate selection from header bar */
                scope.validate = function (event) {
                    // Construct selected values and selected text
                    if (scope.multiSelect == true) {

                        // Clear values
                        scope.value = '';
                        scope.text = '';

                        // Loop on items
                        jQuery.each(scope.items, function (index, item) {
                            if (item.checked) {
                                scope.value = scope.value + item.id+';';
                                scope.text = scope.text + item.text+', ';
                            }
                        });

                        // Remove trailing comma
                        scope.value = scope.value.substr(0,scope.value.length - 1);
                        scope.text = scope.text.substr(0,scope.text.length - 2);
                    }

                    // Select first value if not nullable
                    if (typeof scope.value == 'undefined' || scope.value == '' || scope.value == null ) {
                        if (scope.allowEmpty == false) {
                            scope.value = scope.items[0].id;
                            scope.text = scope.items[0].text;

                            // Check for multi select
                            scope.items[0].checked = true;
                        } else {
                            scope.text = scope.defaultText;
                        }
                    }

                    // Hide modal
                    scope.hideItems();

                    // Execute callback function
                    if (typeof scope.callback == 'function') {
                        scope.callback (scope.value);
                    }
                }

                /* Show list */
                scope.showItems = function (event) {
                    event.preventDefault();
                    scope.modal.show();
                    scope.visivel = true;
                }

                /* Hide list */
                scope.hideItems = function () {
                    scope.modal.hide();
                    scope.visivel = false;
                    if(scope.items.length > 20) {
                        scope.items.length = 20;
                    }
                }
                scope.loadMore = function() {
                    $timeout(function() {
                        if (typeof scope.carrega == 'function') {
                            scope.carrega();
                        }
                        scope.$broadcast('scroll.infiniteScrollReady');
                        scope.$broadcast('scroll.infiniteScrollComplete');
                        scope.$broadcast('scroll.resize');
                        scope.$broadcast('rebuild:me');
                    }, 500);
                }




                /* Destroy modal */
                scope.$on('$destroy', function() {
                    scope.modal.remove();
                    if(scope.items.length > 20) {
                        scope.items.length = 20;
                    }
                });

                scope.$on('modal.hidden', function() {

                    if(scope.items.length > 20) {
                        scope.items.length = 20;
                    }
                    scope.$broadcast('scroll.resize');
                    scope.$broadcast('rebuild:me');
                });

                scope.buscar = function(search){
                    if(typeof scope.buscando !== "undefined"){
                        scope.buscando = search;
                    }
                };
                /* Validate single with data */
                scope.validateSingle = function (item) {
                    // Set selected text
                    scope.text = item.text;

                    // Set selected value
                    scope.value = item.id;

                    // Hide items
                    scope.hideItems();

                    // Execute callback function
                    if (typeof scope.callback == 'function') {
                        scope.callback (scope.value);
                    }
                }
            }
        };
    }]
              ).directive('listarProduto', ['$ionicModal','$timeout','$window','$location',function($ionicModal, $timeout, $window, $location) {
    return {
        /* Only use as <fancy-select> tag */
        restrict : 'E',

        /* Our template */
        templateUrl: 'templates/listar-produto.html',

        /* Attributes to set */
        scope: {
            'items'        : '=', /* Items list is mandatory */
            'value'        : '=', /* Selected value binding is mandatory */
            'callback'     : '&',
            'carrega'      : '&',
            'total'        : '=',
            'buscando'     : '=',
            'deletar'      : '='
        },

        link: function (scope, element, attrs) {

            /* Default values */

            /* Header used in ion-header-bar */
            scope.headerText    = attrs.headerText || '';

            $ionicModal.fromTemplateUrl(
                'templates/fancy-select-items.html',
                {'scope': scope}
            ).then(function(modal) {
                scope.modal = modal;
            });

            /* Validate selection from header bar */
            scope.validate = function (event) {
                // Select first value if not nullable
                
                if (typeof scope.value == 'undefined' || scope.value == '' || scope.value == null || scope.value == null ) {
                    if (scope.allowEmpty == false) {

                        scope.existe = false;
                        angular.forEach(scope.value, function(value, key) {
                            if(value.id_iten == items[0].id){
                                scope.existe = true; 
                            }

                        });

                        
                        
                        if(scope.existe == false){
                            scope.value.push({
                                id: scope.value.length + 1,
                                id_iten:scope.items[0].id,
                                un:scope.items[0].un,
                                cantidad:1,
                                val_un:scope.items[0].val_un,
                                text: scope.items[0].text,
                                total: scope.items[0].total,
                                custo: scope.items[0].custo,
                                lucro: scope.items[0].lucro,
                                preco_venda:scope.items[0].val_un,
                                lucroCent:scope.items[0].lucroCent
                            });
                            
                        }else{
                            alert("Este item ja foi selecionado"); 
                            return;
                        }
                         $location.path("/pedidos/inserir/mostrar/"+scope.items[0].id);
                    } else {
                        scope.text = scope.defaultText;
                        alert("Selecione um item valido");
                        return;
                    }
                    
               
                }
                
                
                // Hide modal
                scope.hideItems();

                // Execute callback function
                if (typeof scope.callback == 'function') {
                    scope.callback (scope.value);
                }
            }
            scope.buscar = function(search){
                if(typeof scope.buscando !== "undefined"){
                    scope.buscando = search;
                }
            };

            /* Show list */
            scope.showItems = function (event) {
                event.preventDefault();
                scope.modal.show();
                scope.visivel = true;
            }

            /* Hide list */
            scope.hideItems = function () {
                scope.modal.hide();
                scope.visivel = false;
                if(scope.items.length > 20) {
                    scope.items.length = 20;
                }
            }
            scope.loadMore = function() {
                $timeout(function() {
                    if (typeof scope.carrega == 'function') {
                        scope.carrega();
                    }
                    scope.$broadcast('scroll.infiniteScrollReady');
                    scope.$broadcast('scroll.infiniteScrollComplete');
                    scope.$broadcast('scroll.resize');
                    scope.$broadcast('rebuild:me');
                }, 500);
            }
            /* Destroy modal */
            scope.$on('$destroy', function() {
                scope.modal.remove();
                if(scope.items.length > 20) {
                    scope.items.length = 20;
                }
            });
            scope.$on('modal.hidden', function() {
                if(scope.items.length > 20) {
                    scope.items.length = 20;
                }
                scope.$broadcast('scroll.resize');
                scope.$broadcast('rebuild:me');
            });

            scope.delete = function ( prod ) {
                var index = scope.value.indexOf(prod);
                
                scope.deletar.push({produto:prod.id_iten}); 
                scope.total = scope.total - prod.total;
                scope.value.splice(index, 1);  
            };

            scope.abrir = function (prod) {
                $location.path("/pedidos/inserir/mostrar/"+prod);
            };

            scope.$watchCollection("scope.value", function(newValue, oldValue) {
                scope.total = 0;
                angular.forEach(scope.value, function(value, key) {
                    scope.total = Number(scope.total) + Number(value.total);
                });

            });      

            /* Validate single with data */
            scope.validateSingle = function (item) {


                scope.existe = false;
                angular.forEach(scope.value, function(value, key) {
                    if(value.id_iten == item.id){
                        scope.existe = true; 
                    }

                });

                if(scope.existe == false){
                    
                    
                    scope.value.push({
                        id: scope.value.length + 1,
                        id_iten:item.id,
                        un:item.un,
                        cantidad:1,
                        val_un:item.val_un,
                        text: item.text,
                        total: item.total,
                        custo: item.custo,
                        lucro: item.lucro,
                        preco_venda:item.val_un,
                        lucroCent:item.lucroCent
                    });

                    $location.path("/pedidos/inserir/mostrar/"+item.id);
                    scope.hideItems();  
                }else{
                    alert("Este item ja foi selecionado"); 

                }
                // Hide items
                // Execute callback function
                if (typeof scope.callback == 'function') {
                    scope.callback (scope.value);
                }
            }
        }
    };
}
                                           ]
                         ).directive('eatClickIf', ['$parse', '$rootScope',
                                                    function($parse, $rootScope) {
                                                        return {
                                                            // this ensure eatClickIf be compiled before ngClick
                                                            priority: 100,
                                                            restrict: 'A',
                                                            compile: function($element, attr) {
                                                                var fn = $parse(attr.eatClickIf);
                                                                return {
                                                                    pre: function link(scope, element) {
                                                                        var eventName = 'click';
                                                                        element.on(eventName, function(event) {
                                                                            var callback = function() {
                                                                                if (fn(scope, {$event: event})) {
                                                                                    // prevents ng-click to be executed
                                                                                    event.stopImmediatePropagation();
                                                                                    // prevents href 
                                                                                    event.preventDefault();
                                                                                    return false;
                                                                                }
                                                                            };
                                                                            if ($rootScope.$$phase) {
                                                                                scope.$evalAsync(callback);
                                                                            } else {
                                                                                scope.$apply(callback);
                                                                            }
                                                                        });
                                                                    },
                                                                    post: function() {}
                                                                }
                                                            }
                                                        }
                                                    }
                                                   ]);