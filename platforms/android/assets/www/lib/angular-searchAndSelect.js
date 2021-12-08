angular.module('angular-search-and-select', []).directive('searchandselect', function ($rootScope) {
    return {
        controller: 'DashCtrl',
        replace: true,
        restrict: 'E',
        transclude:true,
        scope: {
            values: "=",
            selecteditem: "=",
            key: "@",
            key1: "@",
            onscroll: "&",
            totalrecords: "="
        },
        templateUrl: 'searchandselect.html',
        link: function (scope, elm, attr) {

            scope.showList = false;
            scope.selecteditem =[];
            scope.selectItem = function (item) {
                // console.log(item);
                // console.log(scope.selecteditem);
                // if(scope.selecteditem.length!=0)
                // {
                //     console.log("IF");
                //     for(i=0;i<scope.selecteditem.length;i++)
                //     {
                //         console.log(scope.selecteditem[i][scope.key1]);
                //         console.log(item[scope.key1]);
                //         if(scope.selecteditem[i][scope.key1]==item[scope.key1])
                //         {
                //             scope.selecteditem.splice(i,1);
                //         }
                //         else
                //         {
                //             if(i==scope.selecteditem.length-1)
                //             {
                //                 scope.selecteditem.push(item);
                //                 break;
                //             }
                //         }
                //     }
                // }
                // else
                // {
                //     console.log("ELSE");
                //     scope.selecteditem.push(item);
                // }
                // console.log(item);
                // console.log(scope.selecteditem);

                scope.selecteditem = item;
                scope.showList = false;
                scope.searchKey='';
            };

            scope.isActive = function (item) {
                    return item[scope.key1] === scope.selecteditem[scope.key1];
                
            };

            scope.textChanged = function (searchKey) {
                console.log(searchKey);
                if (searchKey.length === 0 || searchKey.length > 2) {
                    scope.onscroll({
                        searchKey: searchKey,
                        pagenumber: 1
                    });
                }

            };

            scope.show = function () {
                scope.showList = !scope.showList;
            };

            $rootScope.$on("documentClicked", function (inner, target) {
                console.log(target);
                var isSearchBox = ($(target[0]).is(".searchandselect")) || ($(target[0]).parents(".searchandselect").length > 0);

                if (!isSearchBox)
                    scope.$apply(function () {
                        scope.showList = false;
                    });
            });

            elm.find(".dropdown").bind('scroll', function () {
                var currentItem = $(this);
                if (currentItem.scrollTop() + currentItem.innerHeight() >= currentItem[0].scrollHeight) {

                    if (!scope.pagenumber) scope.pagenumber = 2;
                    else
                        scope.pagenumber = scope.pagenumber + 1;

                    scope.onscroll({
                        searchKey: scope.searchKey,
                        pagenumber: scope.pagenumber
                    });
                }
            });

        }
    };
});




