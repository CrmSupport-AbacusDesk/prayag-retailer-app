(function () {

    var _template = [
        "<div class='selectBox {{selectBoxClass}}' ng-click='showSelectModal()'>",
        "<span class='selected {{placeholderTextClass}}'>{{label}}</span>",
        "<span class='selectArrow'>&#9660</span>",
        "<input type='hidden'/>",
        "</div>"
    ].join("\n");

    angular.module('$selectSearchBox', [])
        .directive('selectSearchBox', function () {

            return {
                restrict: 'E',
                require: ['ngModel'],
                template: _template,
                scope: {
                    selectedValue: "=",
                    selectTitle: "@",
                    itemName: "@",
                    itemId: "@",
                    source: "@",
                    placeholderText: "@",
                    headerClass: "@",
                    selectChanged: "&",
                    placeholderTextClass: "@",
                    selectBoxClass: "@",
                    showSearch: "@"
                },
                controller: ['$scope', '$element', '$ionicModal', '$parse' ,'$ionicLoading','$timeout', function ($scope, $element, $ionicModal, $parse,$ionicLoading,$timeout) {

                    $scope.placeholderText = ($scope.placeholderText) ? $scope.placeholderText : '';
                    $scope.label = $scope.placeholderText;
                    $scope.placeholderTextClass = ($scope.placeholderTextClass) ? $scope.placeholderTextClass : '';
                    $scope.selectBoxClass = ($scope.selectBoxClass) ? $scope.selectBoxClass : '';
                    $scope.showSearch = ($scope.showSearch) ? $scope.showSearch : "yes";
                    $scope.filterText = '';

                    $scope.showSelectModal = function () {
                         $ionicLoading.show({
                          template: '<span class="icon spin ion-loading-d"></span> Loading...'
                         });
                        $timeout(function() {
                        var val = $parse($scope.source);
                        $scope.sourceObjects = val($scope.$parent);
                        $scope.headerClass = ($scope.headerClass) ? $scope.headerClass : "";
                        $scope.renderModal();
                        $scope.modal.show();
                        }, 200);
                    };

                    $scope.closeSelectModal = function () {
                        if ($scope.modal)
                            $scope.modal.hide();
                        $scope.filterText = '';
                    };

                    $scope.$on('$destroy', function (id) {
                        if ($scope.modal)
                            $scope.modal.remove();
                        $scope.filterText = '';
                    });

                    $scope.$watch('placeholderText', function (newValue, oldValue) {
                        angular.element($element.children()[0]).children()[0].innerText = newValue;
                    });

                    $scope.$watch('selectedValue', function (newValue, oldValue) {
                        //console.log('selected value changed from ', oldValue, ' to ', newValue);
                        if (undefined != newValue) {
                            var val = $parse($scope.source);
                            $scope.sourceObjects = val($scope.$parent);
                            var i = 0, len = $scope.sourceObjects.length;
                            for (; i < len; i++) {
                                if ($scope.sourceObjects[i][$scope.itemId] == newValue) {
                                    //console.log('found descr for ', newValue, ' = ',$scope.sourceObjects[i][$scope.itemName]);
                                    $scope.setPlaceholderLabel($scope.sourceObjects[i][$scope.itemName]);
                                }
                            }
                        } else
                            $scope.setPlaceholderLabel($scope.placeholderText);
                    });

                    $scope.searchFilter = function (filterText) {
                        $scope.filterText = filterText;
                    };

                    $scope.renderModal = function () {

                        $scope.modal = $ionicModal.fromTemplate('<ion-modal-view id="select">'
                            + '<ion-header-bar class="' + $scope.headerClass + '">'
                            + '<h1 class="title">' + $scope.selectTitle + '</h1>'
                            + '<a ng-click="closeSelectModal()" class="button button-icon icon ion-close cs-close-new"></a>'
                            + '</ion-header-bar>'
                            + '<ion-content>'
                            + '<ion-list>'
                            + '<ion-item ng-if="showSearch == \'yes\'">'
                            + '<label class="item item-input search-cs">'
                            + '<i class="icon ion-search placeholder-icon"></i>'
                            + '<input type="text" placeholder="Search" ng-model="filterText" ng-change="searchFilter(filterText)">'
                            + '</label>'
                            + '</ion-item>'
                            + '<ion-item  ng-init="abc($index,sourceObjects.length)" ng-click="clickItem(item);' + '" ng-repeat="item in sourceObjects | filter: {' + $scope.itemName + ': filterText}" ng-bind-html="item[\'' + $scope.itemName + '\']"></ion-item>'
                            + '</ion-list>'
                            + ' </ion-content>'
                            + '</ion-modal-view>', {
                            scope: $scope,
                            animation: 'slide-in-right',
                            backdropClickToClose: false
                        });
                    };

                    $scope.clickItem = function (item) {
                        $scope.selectedValue = item[$scope.itemId];
                        $scope.label = item[$scope.itemName];
                        $scope.closeSelectModal();
                        $scope.selectChanged({selectedValue: $scope.selectedValue});
                    };

                    $scope.abc=function(index,len)
                    {
                        if(index+1==len)
                        {
                            $ionicLoading.hide();
                        }
                    }

                    $scope.setPlaceholderLabel = function (label) {
                        $scope.label = label;
                    };
                    $scope.$on('reset', function () {
                        $scope.setPlaceholderLabel($scope.placeholderText);
                        $scope.selectedValue = null;
                    });
                }],
                compile: function ($element, $scope) {
                    var input = $element.find('input.selected');
                    angular.forEach({
                        'name': $scope.name,
                        'ng-model': $scope.selectedValue
                    }, function (value, name) {
                        if (angular.isDefined(value)) {
                            input.attr(name, value);
                        }
                    });
                }
            };
        });
//# sourceMappingURL=select-search.js.map
})();
