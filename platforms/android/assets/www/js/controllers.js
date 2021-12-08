angular.module('starter.controllers', ['dcbImgFallback','ngCordova.plugins.nativeStorage','dropdown-multiselect'])

.directive('stringToNumber', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(value) {
        return '' + value;
      });
      ngModel.$formatters.push(function(value) {
        return parseFloat(value);
      });
    }
  };
})

.directive('dateInput', function(){
  return {
    restrict : 'A',
    scope : {
      ngModel : '='
    },
    link: function (scope) {
      if (scope.ngModel) scope.ngModel = new Date(scope.ngModel);
    }
  }
})

.directive('whenScrolled', function() {
  return function(scope, elm, attr) {
    var raw = elm[0];
    
    elm.bind('scroll', function() {
      if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
        scope.$apply('loadMore()');
      }
    });
  };
})

.directive('numbersOnly', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attr, ngModelCtrl) {
      function fromUser(text) {
        if (text) {
          var transformedInput = text.replace(/[^0-9]/g, '');
          
          if (transformedInput !== text) {
            ngModelCtrl.$setViewValue(transformedInput);
            ngModelCtrl.$render();
          }
          return transformedInput;
        }
        return undefined;
      }
      ngModelCtrl.$parsers.push(fromUser);
    }
  };
})

.controller('DashCtrl', function($scope,$state,$ionicLoading,$ionicPopup,$ionicHistory,$ionicModal,loginService,retailerService,mySharedService,$cordovaSQLite, $ionicActionSheet, Camera, $cordovaImagePicker, $cordovaFileTransfer, $rootScope, $filter, $cordovaToast, $timeout, $cordovaNativeStorage, $cordovaGeolocation,$ionicScrollDelegate,$location) {
  
  // $scope.$on('$ionicView.loaded', function() {
  //   ionic.Platform.ready( function() {
  //     if(navigator && navigator.splashscreen) navigator.splashscreen.hide();
  //   });
  // });



  $scope.loadMore=function()
  {
    console.log("hello Sir");
  }
  $scope.options = [{
    'Id': 1,
    'Name': 'Batman',
    'Costume': 'Black'
  }, {
    'Id': 2,
    'Name': 'Superman',
    'Costume': 'Red & Blue'
  }, {
    'Id': 3,
    'Name': 'Hulk',
    'Costume': 'Green'
  }];






  

  $ionicModal.fromTemplateUrl('templates/order-invoice-modal.html', {
    scope: $scope,
    animation: 'zoomIn'
}).then(function(modal) {
    $scope.searchrtt = modal;
});
// ++++++++++++++++++ Open modal +++++++++++++++++++++++ //
$scope.openrt = function() {
   console.log("upload invoice of order");
};
// ++++++++++++++++++ Close modal +++++++++++++++++++++++ //
$scope.closertd = function() {
    $scope.searchrtt.hide();
};
  
  $scope.seg_config = {
    options: $scope.default_segment,
    trackBy: 'seg_name',
    displayBy: ['seg_name'],
    icon: 'glyphicon glyphicon-heart',
    displayBadge: true,
    filter: true,
    height:'200px'
  };
  
  $scope.cat_config = {
    options: $scope.default_category,
    trackBy: 'cat_nos',
    displayBy: ['cat_nos'],
    icon: 'glyphicon glyphicon-heart',
    displayBadge: true,
    filter: true,
    height:'200px'
  };
  
  $scope.prod_config = {
    options: $scope.show_default_product,
    trackBy: 'product',
    displayBy: ['product'],
    icon: 'glyphicon glyphicon-heart',
    displayBadge: true,
    filter: true,
    height:'200px'
  };
  
  $scope.default_segment=[];
  // $rootScope.default_category=[];
  // $rootScope.show_default_category=[];
  // $rootScope.show_default_product=[];
  // $rootScope.default_products=[];
  
  
  $scope.data = {};
  $rootScope.search_data = {};
  $scope.upload_url = upload_url;
  $scope.company_name=mySharedService.company_name;
  $scope.company_district = mySharedService.company_district;
  console.log($scope.company_district);
  
  $scope.inv_data = {distributor:'',inv_date:'',inv_no:'',inv_amt:''};
  /*Login function start*/


 


  $scope.login = function ()
  {
    
    $ionicLoading.show({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    
    loginService.login($scope.data.username,$scope.data.password)
    .then(function (result)
    {
      console.log(result);
      
      var query = "INSERT INTO "+dbTableName+" (username,password) VALUES (?,?)";
      
      $cordovaSQLite.execute(db, query,[$scope.data.username, $scope.data.password]).then(function(resultData) {
        
        login_id = result.data.id;
        state_name = result.data.state_name;
        district_name = result.data.district_name;
        mySharedService.company_name=result.data.dr_name;
        mySharedService.company_district=result.data.district_name;
        $state.go('tab.home');
        $ionicLoading.hide();
      },
      function (err) {
        $ionicLoading.hide();
        console.error(err);
      });
    },
    function (resultData) {
      $ionicLoading.hide();
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
    });
  }


  $scope.getAllProductinfo=function()
  {
      console.log("function call");
      
      var data ={ 'ret_id':login_id, 'state':state_name,};
      
      
      console.log(data)
      
      retailerService.orpPostServiceRequest('/index.php/master/getallproduct_info',data)
      .then(function (result)
      {
        
          console.log(result.data);
          $rootScope.dr_default_segment= [];
          $rootScope.dr_default_category= [];
          
          for(i=0;i<result.data.length;i++)
          {
              $rootScope.dr_default_segment.push({'seg_name':result.data[i].segment_name});
          }
          for(j=0;j<result.data1.length;j++)
          {
              $rootScope.dr_default_category.push({'cat_nos':result.data1[j].product_category_no,'seg_name':result.data1[j].segment_name,'product':result.data1[j].product_name,'id':result.data1[j].id});
          }
          
          mySharedService.dr_default_segment=$rootScope.dr_default_segment
          mySharedService.dr_default_category=$rootScope.dr_default_category
          
          
      },
      function (resultData) {
          $ionicLoading.hide();
          
      });
      
      
  }


  if($location.path()=='/tab/addorder')
  {
      console.log("sssssssss")
      
      $scope.getAllProductinfo();        
      console.log("pppppppppppp")
      
  }
  
  /*Login function end*/
  
  console.log($scope.default_segment);
  $scope.default_segment=mySharedService.default_segment;
  $rootScope.default_category=mySharedService.default_category;
  $rootScope.default_products=mySharedService.default_products;
  
  if($scope.default_segment.length==0 && $ionicHistory.currentStateName() === 'tab.home')
  {
    retailerService.default_segment()
    .then(function (result)
    {
      console.log(result);
      for(i=0;i<result.data.data.length;i++)
      {
        // $scope.default_segment.push({'seg_name':result.data.data[i].segment_name});
        mySharedService.default_segment.push({'seg_name':result.data.data[i].segment_name});
        
      }
      
      for(j=0;j<result.data.data1.length;j++)
      {
        // $scope.default_category.push({'cat_nos':result.data.data1[j].product_category_no,'seg_name':result.data.data1[j].segment_name});
        mySharedService.default_category.push({'cat_nos':result.data.data1[j].product_category_no,'seg_name':result.data.data1[j].segment_name,'product':result.data.data1[j].product_name,'id':result.data.data1[j].id});
        
      }
      
      for(k=0;k<result.data.data2.length;k++)
      {
        // $rootScope.default_products.push({'cat_nos':result.data.data2[k].product_category_no,'seg_name':result.data.data2[k].segment_name,'product':result.data.data2[k].product_name});
        mySharedService.default_products.push({'cat_nos':result.data.data2[k].product_category_no,'seg_name':result.data.data2[k].segment_name,'product':result.data.data2[k].product_name,'id':result.data.data2[k].id});
        
      }
      $cordovaNativeStorage.setItem("ref", mySharedService.default_segment).then(function (value) {
        $cordovaNativeStorage.getItem("ref").then(function (value) {
          console.log(value);
        }, function (error) {
          console.log(error);
        });
      }, function (error) {
        console.log(error);
      });
      
      $cordovaNativeStorage.setItem("catt", mySharedService.default_category).then(function (value) {
        $cordovaNativeStorage.getItem("catt").then(function (value) {
          console.log(value);
        }, function (error) {
          console.log(error);
        });
      }, function (error) {
        console.log(error);
      });
      
      $cordovaNativeStorage.setItem("prodd", mySharedService.default_products).then(function (value) {
        $cordovaNativeStorage.getItem("prodd").then(function (value) {
          console.log(value);
        }, function (error) {
          console.log(error);
        });
      }, function (error) {
        console.log(error);
      });
    },
    function (err) {
      console.error(err);
    })
  }
  
  $scope.default_segment_select = {
    seg_name: ""
  };
  
  $scope.default_category_select = {
    seg_name: "",
    cat_nos: "",
    id: ""
  };
  
  $rootScope.default_product_select = {
    seg_name: "",
    cat_nos: "",
    id: "",
    product: ""
  };
  
  $scope.select_all=function(searchkey,pno)
  {
    console.log(searchkey+" "+pno);
    $scope.default_segment=[];
    for(i=0;i<mySharedService.dr_default_segment.length;i++)
    {
      if(mySharedService.dr_default_segment[i].seg_name.slice(0,searchkey.length)==searchkey || (mySharedService.dr_default_segment[i].seg_name.slice(0,searchkey.length)).toLowerCase()==searchkey)
      {
        console.log(i);
        $scope.default_segment.push({'seg_name':mySharedService.default_segment[i].seg_name});
        console.log($scope.default_segment);
      }
    }
    if(searchkey.length==0)
    {
      $scope.dr_default_segment=mySharedService.dr_default_segment;
    }
    console.log($scope.default_segment);
  }
  
  $scope.flag=false;
  $scope.select_all_cat=function(searchkey,pno)
  {
      if(mySharedService.temp_default_category.length == 0)
      {
          mySharedService.temp_default_category=$rootScope.default_category;
      }
      
      if(mySharedService.temp_default_products.length == 0)
      {
          mySharedService.temp_default_products=$rootScope.default_products;
      }
      console.log(searchkey+" "+pno);
      if(searchkey)
      {
          $scope.flag=true;
          console.log("IF");
          $rootScope.dr_default_category=[];
          $rootScope.show_default_category=[];
          console.log(searchkey.length);
          for(i=0;i<mySharedService.dr_default_category.length;i++)
          {
              if(mySharedService.dr_default_category[i].cat_nos.slice(0,searchkey.length)==searchkey || (mySharedService.dr_default_category[i].cat_nos.slice(0,searchkey.length)).toLowerCase()==searchkey)
              {
                  console.log(i);
                  $rootScope.dr_default_category.push({'cat_nos':mySharedService.dr_default_category[i].cat_nos,'seg_name':mySharedService.dr_default_category[i].seg_name,'id':mySharedService.dr_default_category[i].id,'product':mySharedService.dr_default_category[i].product});
                  
                  $rootScope.show_default_category.push({'cat_nos':mySharedService.dr_default_category[i].cat_nos,'seg_name':mySharedService.dr_default_category[i].seg_name,'id':mySharedService.dr_default_category[i].id,'product':mySharedService.dr_default_category[i].product});
              }
          }
          var o = $rootScope.show_default_category.length;
          var x = 50 + $rootScope.show_default_category.length;
          for(i=o;i<x;i++)
          {
              if(i<mySharedService.dr_default_category.length)
              {
                  mySharedService.show_default_category.push(mySharedService.dr_default_category[i]);
                  // $scope.$digest();
              }
          }
          if(searchkey.length==0)
          {
              $rootScope.dr_default_category=mySharedService.dr_default_category;
          }
      }
      else
      {
          if($scope.flag)
          {
              mySharedService.show_default_category=[];
              $rootScope.show_default_category=[];
              $rootScope.dr_default_category=[];
              console.log("0 In iF");
              $rootScope.dr_default_category=mySharedService.dr_default_category;
              for(i=0;i<50;i++)
              {
                  if(i<mySharedService.dr_default_category.length)
                  {
                      mySharedService.show_default_category.push(mySharedService.dr_default_category[i]);
                      $rootScope.show_default_category.push(mySharedService.dr_default_category[i]);
                  }
              }
              $scope.flag=false;
          }
          else
          {
              console.log("ELSE");
              var o = $rootScope.show_default_category.length;
              var x = 50 + $rootScope.show_default_category.length;
              for(i=o;i<x;i++)
              {
                  if(i<mySharedService.dr_default_category.length)
                  {
                      $rootScope.show_default_category.push(mySharedService.dr_default_category[i]);
                      $scope.$digest();
                  }
              }
          }
      }
      console.log($rootScope.dr_default_category);
      console.log(mySharedService.dr_default_category);
      console.log($rootScope.show_default_category);
  }
  
  $scope.prod_flag=false;
  $scope.select_all_prod=function(searchkey,pno)
  {
    if(mySharedService.temp_default_category.length == 0)
    {
      mySharedService.temp_default_category=$rootScope.default_category;
    }
    
    if(mySharedService.temp_default_products.length == 0)
    {
      mySharedService.temp_default_products=$rootScope.default_products;
    }
    console.log(searchkey+" "+pno);
    if(searchkey)
    {
      $scope.prod_flag=true;
      console.log("IF");
      $rootScope.default_products=[];
      $rootScope.show_default_product=[];
      console.log(searchkey.length);
      for(i=0;i<mySharedService.default_products.length;i++)
      {
        if(mySharedService.default_products[i].product.slice(0,searchkey.length)==searchkey || (mySharedService.default_products[i].product.slice(0,searchkey.length)).toLowerCase()==searchkey)
        {
          console.log(i);
          $rootScope.default_products.push({'cat_nos':mySharedService.default_products[i].cat_nos,'seg_name':mySharedService.default_products[i].seg_name,'id':mySharedService.default_products[i].id,'product':mySharedService.default_products[i].product});
          
          $rootScope.show_default_product.push({'cat_nos':mySharedService.default_products[i].cat_nos,'seg_name':mySharedService.default_products[i].seg_name,'id':mySharedService.default_products[i].id,'product':mySharedService.default_products[i].product});
        }
      }
      var o = $rootScope.show_default_product.length;
      var x = 50 + $rootScope.show_default_product.length;
      for(i=o;i<x;i++)
      {
        if(i<mySharedService.default_products.length)
        {
          mySharedService.show_default_product.push(mySharedService.default_products[i]);
          // $scope.$digest();
        }
      }
      if(searchkey.length==0)
      {
        $rootScope.default_products=mySharedService.default_products;
      }
    }
    else
    {
      if($scope.prod_flag)
      {
        mySharedService.show_default_product=[];
        $rootScope.show_default_product=[];
        $rootScope.default_products=[];
        console.log("0 In iF");
        $rootScope.default_products=mySharedService.default_products;
        for(i=0;i<50;i++)
        {
          if(i<mySharedService.default_products.length)
          {
            mySharedService.show_default_product.push(mySharedService.default_products[i]);
            $rootScope.show_default_product.push(mySharedService.default_products[i]);
            // $scope.$digest();
          }
        }
        $scope.prod_flag=false;
      }
      else
      {
        
        console.log("ELSE");
        var o = $rootScope.show_default_product.length;
        var x = 50 + $rootScope.show_default_product.length;
        for(i=o;i<x;i++)
        {
          if(i<mySharedService.default_products.length)
          {
            $rootScope.show_default_product.push(mySharedService.default_products[i]);
            $scope.$digest();
          }
        }
        
      }
    }
    console.log($rootScope.default_products);
    console.log(mySharedService.default_products);
    console.log($rootScope.show_default_product);

  }
  
  
  /*Logout Function Start*/
  $scope.logout = function() {
    
    var query = "DELETE FROM "+dbTableName;
    $cordovaSQLite.execute(db, query, []).then(function(results) {
      $state.go('login');
    }, function (err) {
      console.error(err);
    });
  };
  /*Logout Function End*/
  
  /* Distributor list of distributor function start */
  
  $scope.myDistList = mySharedService.shareDistList;
  console.log($scope.myDistList);
  
  
  $scope.distributor_list= function ()
  {
    $ionicLoading.show({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    
    retailerService.distributor_list($rootScope.company_district)
    .then(function (result)
    {
      // console.clear();
      console.log(result);
      mySharedService.shareDistList = result.data;
      $state.go('tab.distributor');
      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
    },
    function (err) {
      $ionicLoading.hide();
      console.error(err);
    })
  }
  
  /* Distributor list of distributor function end */
  
  
  
  /*Distributor Detail start*/
  $scope.myDistDetail= mySharedService.shareDistDetail;
  $scope.my_dist_seg = mySharedService.my_dist_seg;
  console.log($scope.myDistDetail);
  $scope.dist_detail= function (dist_id)
  {
    
    $ionicLoading.show({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    
    retailerService.dist_detail(dist_id)
    .then(function (result)
    {
      // console.clear();
      console.log(result);
      mySharedService.shareDistDetail = result.data.dr_data;
      mySharedService.my_dist_seg = result.data.seg_data;
      $state.go('distributor-details');
      $ionicLoading.hide();
      
    }, function (err) {
      
      $ionicLoading.hide();
      console.error(err);
    })
  }
  /*Distributor Detail End*/
  
  
  /*Retailer All Payment List start*/
  $scope.myAllPaymentList= mySharedService.shareAllPaymentList;
  console.log($scope.myAllPaymentList);
  $scope.payment_all_list= function ()
  {
    $ionicLoading.show({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    
    retailerService.payment_all_list()
    .then(function (result)
    {
      console.clear();
      mySharedService.shareAllPaymentList = result.data;
      $state.go('tab.payments');
      $ionicLoading.hide();
      
    }, function (err) {
      
      $ionicLoading.hide();
      console.error(err);
    })
  }
  /*Retailer All Payment List End*/
  
  
  /* Retailer Distributor Payment Data start*/
  $scope.myDistPaymentList = mySharedService.shareDistPaymentList;
  console.log($scope.myDistPaymentList);
  $scope.payment_dist_list= function (dist_id)
  {
    $ionicLoading.show
    ({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    
    retailerService.payment_dist_list(dist_id)
    .then(function (result)
    {
      // console.clear();
      $scope.myDistPaymentList = result.data;
      mySharedService.shareDistPaymentList = result.data;
      console.log($scope.myDistPaymentList);
      $state.go('payments');
      
      $ionicLoading.hide();
      
    },function (err) {
      
      $ionicLoading.hide();
      console.error(err);
    })
  }
  /* Retailer Distributor Payment Data End*/
  
  
  /*Retailer pop and gift List start*/
  $scope.myPopGiftList= mySharedService.sharePopGiftList;
  console.log($scope.myPopGiftList);
  $scope.gift_update_list= function (gift_id,type)
  {
    $ionicLoading.show({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    
    retailerService.gift_update_list(gift_id)
    .then(function (result)
    {
      console.clear();
      console.log(result);
      $scope.myPopGiftList= result.data;
      mySharedService.sharePopGiftList = result.data;
      $ionicLoading.hide();
      
      if(type=='1')
      {
        $timeout(function () {
          $cordovaToast.show('Pop Gift Received!', 'short', 'bottom').then(function(success) { },
          function (error) {
          });
          
        }, 300);
      }
      
      
      $state.go('tab.pop');
      
      
      
    }, function (err) {
      $ionicLoading.hide();
      console.error(err);
    })
  }
  /*Retailer pop and gift List End*/
  
  
  /*Retailer Doc Add List start*/
  
  $scope.myDocAddList= mySharedService.shareDocAddList;
  console.log($scope.myDocAddList);
  $scope.doc_add_list = function ()
  {
    $ionicLoading.show
    ({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    
    retailerService.doc_add_list()
    .then(function (result)
    {
      // console.clear();
      $scope.myDocAddList= result.data;
      mySharedService.shareDocAddList = result.data;
      console.log(result.data);
      
      $state.go('tab.imgdoc');
      $ionicLoading.hide();
      
    }, function (err) {
      $ionicLoading.hide();
      console.error(err);
    })
  }
  /*Retailer Doc Add List End*/
  
  
  /*Retailer Doc Add Gallary List Start*/
  $scope.myDocAddGallaryList =  mySharedService.shareDocAddGallaryList;
  console.log($scope.myDocAddGallaryList);
  $scope.doc_add_gallary_list = function (document_title)
  {
    $ionicLoading.show
    ({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    
    retailerService.doc_add_gallary_list(document_title)
    .then(function (result)
    {
      console.clear();
      $scope.myDocAddGallaryList = result.data;
      mySharedService.shareDocAddGallaryList = result.data;
      console.log(result.data);
      
      $state.go('tab.gallery');
      $ionicLoading.hide();
      
    },function (err) {
      $ionicLoading.hide();
      console.error(err);
    })
  }
  /*Retailer Doc Add Gallary List Start*/
  
  
  /*Doc Camera Click Function Start*/
  $scope.camera_click = function(src)
  {
    
    if(src == 1 || !$scope.myProfileDetail.dr_image) {
      var val = 'remove-pic';
    } else {
      var val = '';
    }
    
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: "<i class='icon ion-android-image'></i> Take Picture From Gallery"},
        { text: "<i class='icon ion-camera'></i> Open Camera" },
        { text: "<i class='icon ion-android-delete orange-color'></i> Remove Photo", className: val}
      ],
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
      },
      buttonClicked: function(index) {
        //return true;
        
        if(index === 0) { // Manual Button
          $scope.perm(src);
        }
        
        else if(index === 1){
          $scope.takePicture(src);
        }
        
        else if(index === 2) {
          $scope.deletePicture(src);
        }
        
        return true;
      }
    })
  }
  /*Doc Camera Click Function End*/
  
  $scope.mediaData = [];
  /*Doc & Profile Take Picture Function Start*/
  $scope.takePicture = function (src, options) {
    
    var options = {
      quality : 50,
      targetWidth: 500,
      targetHeight: 500,
      saveToPhotoAlbum: false
    };
    
    Camera.getPicture(options).then(function(imageData) {
      
      var options = {
        fileKey: "image",
        fileName: "image.jpg",
        chunkedMode: false,
        mimeType: "image/*"
      };
      
      if(src==3)
      {
        $scope.mediaData = [];
      }
      
      $scope.mediaData.push({
        src: imageData
      });
      
      
      if(src == 2 && $scope.mediaData.length) {
        $scope.profile_update(2);
      }
      
    }, function(err) {
      
    })
  };
  /*Doc Take Picture Function End*/
  
  $scope.perm=function(src)
  {
    cordova.plugins.diagnostic.getCameraAuthorizationStatus({
      successCallback: function(status) {
        
        console.log('1st'+status);
        
        if(status === cordova.plugins.diagnostic.permissionStatus.GRANTED){
          
          $scope.getGallary(src);
          
        } else {
          
          cordova.plugins.diagnostic.requestCameraAuthorization({
            successCallback: function(data_status) {
              
              console.log('2nd'+data_status);
              
              if(data_status != 'DENIED') {
                $scope.getGallary(src);
              }
            },
            errorCallback: function(error){
              console.error(error);
            },
            externalStorage: true
          });
        }
      },
      errorCallback: function(error){
        console.error("The following error occurred: "+error);
      },
      externalStorage: true
    });
  }
  
  /*Doc & Profile Gallary Function Start*/
  $scope.getGallary = function(src) {
    
    if(src == 2 || src== 3) {
      
      var options = {
        maximumImagesCount: 1, // Max number of selected images, I'm using only one for this example
        width: 500,
        height: 500,
        quality: 50  // Higher is better
      };
      
    } else  {
      
      var options = {
        maximumImagesCount: 10, // Max number of selected images, I'm using only one for this example
        width: 500,
        height: 500,
        quality: 50  // Higher is better
      };
    }
    
    $cordovaImagePicker.getPictures(options).then(function (results) {
      
      //Loop through acquired images
      
      if(src==3)
      {
        $scope.mediaData = [];
      }
      
      for (var i = 0; i < results.length; i++) {
        $scope.mediaData.push({
          src: results[i]
        });
      }
      console.log($scope.mediaData);
      
      if(src == 2 && $scope.mediaData.length) {
        $scope.profile_update(2);
      }
      
    }, function(error) {
      console.log('Error: ' + JSON.stringify(error));    // In case of error
    });
  }
  /*Doc Gallary Function End*/
  
  /* Profile Image Delete Function Start*/
  $scope.deletePicture = function(src) {
    
    if(src == 2) {
      $scope.myProfileDetail.dr_image = '';
      $scope.profile_update(1);
    }
  }
  /*Profile Image Delete Function End*/
  
  /*Doc Upload Function Start*/
  $scope.doc_upload = function() {
    
    if($ionicHistory.currentStateName() === 'tab.gallery') {
      $scope.data.title = $scope.myDocAddGallaryList[0].document_title;
      console.log($scope.data.title);
    }
    
    $ionicLoading.show({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    
    console.log($scope.mediaData.length);
    if($scope.mediaData.length) {
      var cnt = 0;
      angular.forEach($scope.mediaData, function(val, key) {
        
        var options = {
          fileKey: "file",
          fileName: "image.jpg",
          chunkedMode: false,
          mimeType: "image/*",
        };
        
        $cordovaFileTransfer.upload(server_url+"/doc_upload.php?login_id="+login_id+"&title="+$scope.data.title, val.src, options).then(function(result) {
          
          console.log("SUCCESS: " + JSON.stringify(result));
          
          if($scope.mediaData.length == (cnt+1)) {
            
            console.log('length '+ $scope.mediaData.length);
            console.log('file key '+ (cnt+1));
            
            $scope.data = {};
            $scope.mediaData = [];
            $ionicLoading.hide();
            // $scope.doc_add_list();
            
            $timeout(function () {
              
              $cordovaToast.show('Document Saved Successfully!', 'short', 'bottom').then(function(success) { },
              function (error) {
              });
              
            }, 300);
          }
          
          cnt++;
        }, function(err) {
          $ionicLoading.hide();
          console.log("ERROR: " + JSON.stringify(err));
        }, function (progress) {
          
        });
      });
    }
  }





  $scope.document_upload = function() {
    
  
      $scope.data.title =$scope.myProfileDetail;
      console.log($scope.data.title);
    
    
    $ionicLoading.show({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    
    console.log($scope.mediaData.length);
    if($scope.mediaData.length) {
      var cnt = 0;
      angular.forEach($scope.mediaData, function(val, key) {
        
        var options = {
          fileKey: "file",
          fileName: "image.jpg",
          chunkedMode: false,
          mimeType: "image/*",
        };
        console.log(server_url+"/save_profile_detail.php?login_id="+login_id)
        $cordovaFileTransfer.upload(server_url+"/doc_upload.php?login_id="+login_id+"&title="+"cardDOC", val.src, options).then(function(result) {
          
          console.log("SUCCESS: " + JSON.stringify(result));
          console.log(login_id)
          console.log($scope.data.title)
          console.log(val.src)

          
          if($scope.mediaData.length == (cnt+1)) {
            
            console.log('length '+ $scope.mediaData.length);
            console.log('file key '+ (cnt+1));
            
            $scope.data = {};
            $scope.mediaData = [];
            $ionicLoading.hide();
            // $scope.doc_add_list();
            
            $timeout(function () {
              
              $cordovaToast.show('Document Saved Successfully!', 'short', 'bottom').then(function(success) { },
              function (error) {
              });
              
            }, 300);
          }
          
          cnt++;
        }, function(err) {
          $ionicLoading.hide();
          console.log("ERROR: " + JSON.stringify(err));
        }, function (progress) {
          
        });
      });
    }
  }
  /*Doc Upload Function End*/
  
  $scope.click_me=function()
  {
    console.log("IN CLICK ME");
    $ionicLoading.hide();
  }
  
  $scope.bck_btn=0;
  $scope.ask_perm=function()
  {
    if($scope.bck_btn==0)
    {
      $scope.bck_btn++;
      window.plugins.toast.showShortBottom('Order will Vanish once you go back!!!');
    }
    else
    {
      $scope.order_list(0);
    }
  }
  
  /*Retailer's Distributor & All Order Listing Start*/
  $scope.myDistAllOrderList = mySharedService.shareDistAllOrderList;
  console.log($scope.myDistAllOrderList);
  $scope.order_list = function (dist_id)
  {
    $ionicLoading.show
    ({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    
    retailerService.order_list(dist_id)
    .then(function (result)
    {
      console.log(result);
      $scope.myDistAllOrderList = result.data;
      mySharedService.shareDistAllOrderList = result.data;
      console.log($scope.myDistAllOrderList);
      
      if(dist_id) {
        $state.go('orders');
      } else {
        $state.go('tab.orders');
        mySharedService.show_default_category=[];
        mySharedService.show_default_product=[];
        
        for(i=0;i<50;i++)
        {
          mySharedService.show_default_category.push($rootScope.default_category[i]);
        }
        
        for(i=0;i<50;i++)
        {
          mySharedService.show_default_product.push($rootScope.default_products[i]);
        }
      }
      
      $ionicLoading.hide();
      
    },function (err) {
      $ionicLoading.hide();
      console.error(err);
    })
    
    retailerService.get_my_seg_dists()
    .then(function (result)
    {
      console.log(result);
      mySharedService.saved_seg_dist=result.data.distributor_data;
    },function (err) {
      $ionicLoading.hide();
      console.error(err);
    })
  }
  /*Retailer's Distributor & All Order Listing function End*/
  
  
  /*Retailer's Distributor & All Order Detail Start*/
  $scope.myDistAllOrderDetail=mySharedService.shareDistAllOrderDetail;
  $scope.orderDists =[];
  $scope.orderDists = mySharedService.orderDists;
  $scope.images = mySharedService.images;
  console.log($scope.myDistAllOrderDetail);
  $scope.order_detail = function (dist_id, order_id)
  {
    mySharedService.saved_order_id=order_id;
    $ionicLoading.show
    ({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    
    retailerService.order_detail(dist_id, order_id)
    .then(function (result)
    {
      console.log(result);
      $scope.tmp_array=result.data;
      console.log($scope.tmp_array)
      $scope.myDistAllOrderDetail = result.data.data;
      mySharedService.shareDistAllOrderDetail = result.data.data;
      $scope.images=result.data.images;
      mySharedService.images =  $scope.images;          
      console.log($scope.upload_url2 = upload_url+'order_invoice' );
      console.log($scope.upload_url2)
      $scope.orderDists = result.data.data1;
      mySharedService.orderDists = result.data.data1;
      console.log($scope.myDistAllOrderDetail);
      if(dist_id) {
        $state.go('order-details');
      } else {
        $state.go('tab.order-details');
      }
      
      $ionicLoading.hide();
      
    },function (err) {
      $ionicLoading.hide();
      console.error(err);
    })
  }
  /*Retailer's Distributor & All Order Detail End*/
  
  $scope.today_leave = new Date();
  $scope.today_leave=moment($scope.today_leave).format('YYYY-MM-DD');
  
  $rootScope.show_default_category=mySharedService.show_default_category;
  $rootScope.show_default_product=mySharedService.show_default_product;
  console.log($scope.show_default_category);
  /*Retailer Add Order function start*/
  $scope.product_segment=mySharedService.shareProductsdata;
  $scope.add_product_ret = function(val)
  {
    $ionicLoading.show
    ({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    $rootScope.cache_val=false;
    mySharedService.edit_enable=false;
    mySharedService.edit_enable_button=false;
    // mySharedService.share_seg_comb_data=[];
    mySharedService.show_proceed_btn=false;
    mySharedService.payment_type=[];
    mySharedService.payment_mode=[];
    mySharedService.order_amt=[];
    mySharedService.order_cno=[];
    mySharedService.order_ref=[];
    mySharedService.next_followup_date=[];
    mySharedService.distributor_idd=[];
    mySharedService.new_arrr=[];
    
    retailerService.fetch_prod_det_ret(val)
    .then(function (result)
    {
      mySharedService.shareProductsdata = result;
      $scope.product_segment=result;
      console.log($scope.product_segment);
      
      if(val=='1')
      {
        $ionicLoading.hide();
      }
      
      if(val=='2')
      {
        mySharedService.share_seg_comb_data=[];
        $ionicHistory.clearCache().then(function () {
          $rootScope.seg_amt=[];
          $rootScope.disc_val=[];
          $rootScope.dist_array=[];
          $rootScope.price_val_chg=[];
          mySharedService.cart_arr=[];
          mySharedService.dist_name=[];
          $rootScope.prod_feature=[];
          $rootScope.valid=false;
          $state.go('tab.addorder');
          //  mySharedService.show_default_category=[];
          //  mySharedService.show_default_product=[];
          
          //  for(i=0;i<50;i++)
          //  {
          //   mySharedService.show_default_category.push($rootScope.default_category[i]);
          // }
          
          // for(i=0;i<50;i++)
          // {
          //   mySharedService.show_default_product.push($rootScope.default_products[i]);
          // }
          
        });
      }
      
      
    }, function (err) {
      $ionicLoading.hide();
      console.error(err);
    })
  }
  /*Retailer Add Order function End*/
  
  $scope.product_cat_data={};
  $rootScope.product_data=[];
  // $rootScope.dist_array=[];
  $scope.gst_array=[];
  // $scope.prod_feature={};
  $scope.segment_comb_array=[];
  // $rootScope.disc_val=[];
  $scope.data.selectedValue4;
  $scope.data.selectedValue5;
  $rootScope.pass_seg_name;
  $rootScope.pass_prod_cat_val;
  $scope.prod_state_price=[];
  
  
  /*Retailer Add Order Category function Start*/
  $scope.product_cat_data= mySharedService.shareProductsCatdata;
  // $scope.prod_feature= mySharedService.shareProdFeaturedata;
  // $scope.product_data=mySharedService.shareProductsNamedata;
  $scope.data.test_var=1;
  $scope.temp_default_category=[];
  $scope.temp_default_category=mySharedService.temp_default_category;
  $scope.temp_default_products=[];
  $scope.temp_default_products=mySharedService.temp_default_products;
  $scope.get_cat_no = function(all_val, seg_name,valn,search_var)
  {
    console.log(all_val);
    console.log("GET CAT NO"+" "+seg_name+" "+valn);
    console.log($rootScope.seg_amt);
    console.log(mySharedService.temp_default_category);
    console.log(mySharedService.temp_default_products);
    if(mySharedService.temp_default_category.length == 0)
    {
      mySharedService.temp_default_category=$rootScope.default_category;
    }
    
    if(mySharedService.temp_default_products.length == 0)
    {
      mySharedService.temp_default_products=$rootScope.default_products;
    }
    
    $ionicLoading.show
    ({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    
    if(valn == 2)
    {
      $rootScope.pass_seg_name=all_val.seg_name;
      $rootScope.pass_prod_cat_val=all_val.cat_nos;
      
      //   $rootScope.default_product_select = {
      //   seg_name: "",
      //   cat_nos: "",
      //   id: "",
      //   product: ""
      // };
      mySharedService.show_default_category=[];
      $rootScope.show_default_category=[];
      mySharedService.default_category=[];
      $rootScope.default_category=[];
      
      mySharedService.show_default_product=[];
      $rootScope.show_default_product=[];
      mySharedService.default_products=[];
      $rootScope.default_products=[];
      
      angular.forEach(mySharedService.temp_default_category, function(value, key) {
        if(value.seg_name==all_val.seg_name)
        {
          mySharedService.show_default_category.push(value);
          mySharedService.default_category.push(value);
          $rootScope.default_category.push(value);
          
          mySharedService.show_default_product.push(value);
          mySharedService.default_products.push(value);
          $rootScope.default_products.push(value);
        }
      });
      
      if(mySharedService.show_default_category.length>=50)
      {
        for(i=0;i<50;i++)
        {
          $rootScope.show_default_category.push(mySharedService.show_default_category[i]);
          $rootScope.show_default_product.push(mySharedService.show_default_product[i]);
        }
      }
      else
      {
        for(i=0;i<mySharedService.show_default_category.length;i++)
        {
          $rootScope.show_default_category.push(mySharedService.show_default_category[i]);
          $rootScope.show_default_product.push(mySharedService.show_default_product[i]);
        }
      }
      
      console.log(mySharedService.show_default_category);
      console.log($rootScope.show_default_category);
      console.log(mySharedService.default_category);
      console.log($rootScope.default_category);
      
      $rootScope.pass_seg_name=seg_name;
      console.log($rootScope.pass_seg_name);
      
      retailerService.fetch_prod_cat_det_ret(seg_name,valn).then(function (result)  {
        console.log(result);

        $rootScope.dr_default_category=[];
        for(j=0;j<result.data.length;j++)
        {
            $rootScope.dr_default_category.push({'cat_nos':result.data[j].product_category_no,'seg_name':result.data[j].segment_name,'product':result.data[j].product_name,'id':result.data[j].id});
        }
        
        
        mySharedService.dr_default_category=$rootScope.dr_default_category;
        
        mySharedService.shareProductsCatdata = result.data;
        $scope.product_cat_data=result.data;
        mySharedService.shareDistributordata = result.distributor_data;
        
        if($rootScope.dist_array.length)  {
          
          console.log($rootScope.dist_array);
          for(i=0;i<$rootScope.dist_array.length;i++)
          {
            if($rootScope.dist_array[i].segment_name == seg_name) {
              
              console.log("IF");
              break;
              
            }  else {
              
              console.log("ELSE");
              console.log($rootScope.seg_amt);
              
              if($rootScope.seg_amt.length==0) {
                
                console.log("IIF");
                $rootScope.dist_array=[];
                console.log($rootScope.dist_array);
                $rootScope.dist_array.push({ segment_name: seg_name, distributors: result.distributor_data});
                
              } else {
                
                console.log("EEL");
                if($rootScope.seg_amt.length==$rootScope.dist_array.length-1)
                {
                  $rootScope.dist_array.splice($rootScope.dist_array.length-1,1);
                }
                
                if(i==$rootScope.dist_array.length-1)
                {
                  $rootScope.dist_array.push({ segment_name: seg_name, distributors: result.distributor_data});
                }
              }
              // break;
            }
          }
          
        } else {
          
          $rootScope.dist_array.push({ segment_name: seg_name, distributors: result.distributor_data});
        }
        
        if(result.disc_data.length)
        {
          for(i=0;i<result.disc_data.length;i++)
          {
            if(result.disc_data[i].segment_name)
            {
              $rootScope.disc_val[result.disc_data[i].segment_name]=result.disc_data[i].retailer;
            }
            else
            {
              $rootScope.disc_val[result.disc_data[i].segment_name]=0;
            }
          }
        }
        
        console.log($rootScope.dist_array);
        // console.log($scope.gst_array);
        $ionicLoading.hide();
        
      },function (err) {
        $ionicLoading.hide();
        console.error(err);
      })
    }
    
    if(valn == 3)
    {
      $scope.default_segment_select = {
        seg_name: all_val.seg_name
      };
      
      // mySharedService.show_default_category=[];
      // $rootScope.show_default_category=[];
      // mySharedService.default_category=[];
      // $rootScope.default_category=[];
      
      // mySharedService.show_default_product=[];
      // $rootScope.show_default_product=[];
      // mySharedService.default_products=[];
      // $rootScope.default_products=[];
      
      // angular.forEach(mySharedService.temp_default_products, function(value, key) {
      //   if(value.cat_nos==all_val.cat_nos)
      //   {
      //     mySharedService.show_default_category.push(value);
      //     mySharedService.default_category.push(value);
      //     $rootScope.default_category.push(value);
      
      //     mySharedService.show_default_product.push(value);
      //     mySharedService.default_products.push(value);
      //     $rootScope.default_products.push(value);
      //   }
      // });
      
      // if(mySharedService.show_default_category.length>=50)
      // {
      //   for(i=0;i<50;i++)
      //     {
      //         $rootScope.show_default_category.push(mySharedService.show_default_category[i]);
      //         $rootScope.show_default_product.push(mySharedService.show_default_product[i]);
      //     }
      // }
      // else
      // {
      //   for(i=0;i<mySharedService.show_default_category.length;i++)
      //     {
      //         $rootScope.show_default_category.push(mySharedService.show_default_category[i]);
      //         $rootScope.show_default_product.push(mySharedService.show_default_product[i]);
      //     }
      // }
      
      // console.log(mySharedService.show_default_product);
      // console.log($rootScope.show_default_product);
      // console.log(mySharedService.default_products);
      // console.log($rootScope.default_products);
      
      $rootScope.pass_seg_name=all_val.seg_name;
      $rootScope.pass_prod_cat_val=all_val.cat_nos;
      console.log($rootScope.pass_prod_cat_val);
      retailerService.fetch_prod_cat_det_ret(seg_name, valn, all_val.seg_name)
      .then(function (result)
      {
        console.log(result.data);

       
        $scope.data.test_var={};
        $scope.data.test_var=2;
        
        mySharedService.shareProductsNamedata = result.data;
        $rootScope.product_data=result.data;
        $rootScope.prod_feature=result.data_feat;
        $scope.prod_state_price=result.prod_state_price;
        console.log($scope.prod_state_price);
        console.log($rootScope.dist_array);
        console.log(result);
        console.log($scope.data.test_var);
        
        if($rootScope.dist_array.length)  {
          console.log($rootScope.dist_array);
          for(i=0;i<$rootScope.dist_array.length;i++)
          {
            if($rootScope.dist_array[i].segment_name == all_val.seg_name) {
              console.log("IF");
              break;
            }
            else
            {
              console.log("ELSE");
              console.log($rootScope.seg_amt);
              if($rootScope.seg_amt.length==0) {
                console.log("IIF");
                $rootScope.dist_array=[];
                console.log($rootScope.dist_array);
                $rootScope.dist_array.push({ segment_name: all_val.seg_name, distributors: result.distributor_data});
              } else {
                console.log("EEL");
                if($rootScope.seg_amt.length==$rootScope.dist_array.length-1)
                {
                  $rootScope.dist_array.splice($rootScope.dist_array.length-1,1);
                }
                
                if(i==$rootScope.dist_array.length-1)
                {
                  $rootScope.dist_array.push({ segment_name: all_val.seg_name, distributors: result.distributor_data});
                }
              }
              // break;
            }
          }
          
        } else {
          
          $rootScope.dist_array.push({ segment_name: all_val.seg_name, distributors: result.distributor_data});
        }
        
        console.log($rootScope.dist_array);
        
        if(result.disc_data.length)
        {
          for(i=0;i<result.disc_data.length;i++)
          {
            if(result.disc_data[i].segment_name)
            {
              $rootScope.disc_val[result.disc_data[i].segment_name]=result.disc_data[i].retailer;
            }
            else
            {
              $rootScope.disc_val[result.disc_data[i].segment_name]=0;
            }
          }
        }
        
        $ionicLoading.hide();
      }, function (err) {
        $ionicLoading.hide();
        console.error(err);
      })
    }
    
    if(valn == 4)
    {
      $rootScope.pass_seg_name=all_val.seg_name;
      $rootScope.pass_prod_cat_val=all_val.cat_nos;
      console.log(all_val);
      
      console.log(all_val.cat_nos);
      retailerService.fetch_prod_cat_det_ret(all_val.cat_nos, valn , all_val.seg_name)
      .then(function (result)
      {
        console.log(result);
        mySharedService.shareProductsNamedata = result.data;
        $rootScope.product_data=result.data;
        $rootScope.prod_feature=result.data_feat;
        $scope.prod_state_price=result.prod_state_price;
        
        if($rootScope.dist_array.length)  {
          console.log($rootScope.dist_array);
          for(i=0;i<$rootScope.dist_array.length;i++)
          {
            if($rootScope.dist_array[i].segment_name == all_val.seg_name) {
              console.log("IF");
              break;
            }
            else
            {
              console.log("ELSE");
              console.log($rootScope.seg_amt);
              if($rootScope.seg_amt.length==0) {
                console.log("IIF");
                $rootScope.dist_array=[];
                console.log($rootScope.dist_array);
                $rootScope.dist_array.push({ segment_name: all_val.seg_name, distributors: result.distributor_data});
              } else {
                console.log("EEL");
                if($rootScope.seg_amt.length==$rootScope.dist_array.length-1)
                {
                  $rootScope.dist_array.splice($rootScope.dist_array.length-1,1);
                }
                
                if(i==$rootScope.dist_array.length-1)
                {
                  $rootScope.dist_array.push({ segment_name: all_val.seg_name, distributors: result.distributor_data});
                }
              }
              // break;
            }
          }
          
        } else {
          
          $rootScope.dist_array.push({ segment_name: all_val.seg_name, distributors: result.distributor_data});
        }
        
        console.log($rootScope.dist_array);
        
        if(result.disc_data.length)
        {
          for(i=0;i<result.disc_data.length;i++)
          {
            if(result.disc_data[i].segment_name)
            {
              $rootScope.disc_val[result.disc_data[i].segment_name]=result.disc_data[i].retailer;
            }
            else
            {
              $rootScope.disc_val[result.disc_data[i].segment_name]=0;
            }
          }
        }
        
        $ionicLoading.hide();
      }, function (err) {
        $ionicLoading.hide();
        console.error(err);
      })
      
    }
  }
  /*Retailer Add Order Category function End*/
  
  $scope.idExists = function(id) {
    return $scope.cart_arr.some(function(el) {
      return el.feat_id === id;
    });
  }
  
  /*Retailer Add Order Cart function Start*/
  // $rootScope.cart_arr=[];
  // $rootScope.seg_amt=[];
  console.log($rootScope.seg_amt);
  $scope.addtocart = function(qnty,product_name,product_amount,feat_id,feature)
  {
    console.log($rootScope.pass_seg_name);
    console.log($rootScope.pass_prod_cat_val);
    cat_no=$rootScope.pass_prod_cat_val;
    segment_name=$rootScope.pass_seg_name;
    $scope.data.prod_qty=1;
    console.log(segment_name + cat_no + qnty + product_name + product_amount);
    if($scope.cart_arr.length)
    {
      for(i=0;i<$scope.cart_arr.length;i++)
      {
        if($scope.cart_arr[i].catg_no == cat_no)
        {
          if(!feat_id)
          {
            $scope.cart_arr[i].quantity = parseFloat($scope.cart_arr[i].quantity) + parseFloat(qnty);
            break;
          }
          else
          {
            if($scope.idExists(feat_id))
            {
              $scope.ind_vals = $scope.cart_arr.findIndex(p => p.feat_id == feat_id);
              console.log($scope.ind_vals);
              $scope.cart_arr[$scope.ind_vals].quantity = parseFloat($scope.cart_arr[$scope.ind_vals].quantity) + parseFloat(qnty);
              break;
            }
            else
            {
              console.log("ELSE FEAT");
              $scope.cart_arr.push({ segment_name: segment_name, catg_no: cat_no, quantity: parseFloat(qnty).toFixed(2), product_name: product_name, amount: parseFloat(product_amount).toFixed(2), dist_id:0, feat_id: feat_id, feature:feature});
              break;
            }
          }
        }
        else
        {
          if(i == $scope.cart_arr.length-1)
          {
            console.log("El IF");
            $scope.cart_arr.push({ segment_name: segment_name, catg_no: cat_no, quantity: parseFloat(qnty).toFixed(2), product_name: product_name, amount: parseFloat(product_amount).toFixed(2), dist_id:0, feat_id: feat_id, feature:feature});
            break;
          }
        }
      }
    }
    else
    {
      $scope.cart_arr.push({ segment_name: segment_name, catg_no: cat_no, quantity: parseFloat(qnty).toFixed(2), product_name: product_name, amount: parseFloat(product_amount).toFixed(2), dist_id:0, feat_id: feat_id, feature:feature});
    }
    console.log($scope.cart_arr);
    
    
    if($rootScope.seg_amt.length)
    {
      for(i=0;i<$rootScope.seg_amt.length;i++)
      {
        console.log($rootScope.seg_amt[i].segment_name + segment_name);
        if($rootScope.seg_amt[i].segment_name == segment_name)
        {
          $rootScope.seg_amt[i].price = (parseFloat($rootScope.seg_amt[i].price)+parseFloat(product_amount)*parseFloat(qnty)).toFixed(2);
          break;
        }
        else
        {
          if(i == $rootScope.seg_amt.length-1)
          {
            $rootScope.seg_amt.push({segment_name: segment_name, price:(parseFloat(product_amount)*parseFloat(qnty)).toFixed(2)});
            break;
          }
        }
      }
    }
    else
    {
      $rootScope.seg_amt.push({segment_name: segment_name, price:(parseFloat(product_amount)*parseFloat(qnty)).toFixed(2)});
    }
    
    if($rootScope.price_val_chg.length)
    {
      for(i=0;i<$rootScope.price_val_chg.length;i++)
      {
        if($rootScope.price_val_chg[i].seg_name == segment_name)
        {
          $rootScope.price_val_chg[i].price_val = (parseFloat($rootScope.price_val_chg[i].price_val)+parseFloat(product_amount)*parseFloat(qnty)).toFixed(2);
          break;
        }
        else
        {
          if(i == $rootScope.price_val_chg.length-1)
          {
            $rootScope.price_val_chg.push({seg_name: segment_name, price_val:(parseFloat(product_amount)*parseFloat(qnty)).toFixed(2)});
            break;
          }
        }
      }
    }
    else
    {
      $rootScope.price_val_chg.push({seg_name: segment_name, price_val:(parseFloat(product_amount)*parseFloat(qnty)).toFixed(2)});
    }
    
    console.log($rootScope.seg_amt);
    console.log($rootScope.dist_array);
    console.log($rootScope.price_val_chg);
    
    var seg_len= $rootScope.seg_amt.length;
    console.log(seg_len);
    
    // if($scope.segment_comb_array.length!=seg_len)
    // {
    //   $rootScope.valid=false;
    // }
    // else
    // {
    //   $rootScope.valid=true;
    // }
    
    console.log(mySharedService.share_seg_comb_data);
    if(mySharedService.share_seg_comb_data.length)
    {
      if(mySharedService.share_seg_comb_data.length!=seg_len)
      {
        $rootScope.valid=false;
      }
      else
      {
        $rootScope.valid=true;
      }
    }
    
    else
    {
      if($scope.segment_comb_array.length!=seg_len)
      {
        $rootScope.valid=false;
      }
      else
      {
        $rootScope.valid=true;
      }
    }
    console.log($rootScope.valid);
    
    $scope.default_segment=mySharedService.default_segment;
    $rootScope.default_product_select = {
      seg_name: "",
      cat_nos: "",
      id: "",
      product: ""
    };
    
    console.log(mySharedService.temp_default_category);
    console.log(mySharedService.show_default_category);
    console.log($rootScope.show_default_category);
    console.log($rootScope.default_category);
    
    mySharedService.show_default_category=[];
    $rootScope.show_default_category=[];
    $rootScope.default_category=[];
    $rootScope.default_category=mySharedService.default_category;
    for(i=0;i<50;i++)
    {
      if(i<mySharedService.temp_default_category.length)
      {
        mySharedService.show_default_category.push(mySharedService.temp_default_category[i]);
        $rootScope.show_default_category.push(mySharedService.temp_default_category[i]);
        
      }
    }
    $rootScope.default_category=mySharedService.temp_default_category;
    mySharedService.default_category=mySharedService.temp_default_category;
    
    console.log(mySharedService.temp_default_products);
    
    mySharedService.show_default_product=[];
    $rootScope.show_default_product=[];
    $rootScope.default_products=[];
    $rootScope.default_products=mySharedService.default_products;
    for(i=0;i<50;i++)
    {
      if(i<mySharedService.temp_default_products.length)
      {
        mySharedService.show_default_product.push(mySharedService.temp_default_products[i]);
        $rootScope.show_default_product.push(mySharedService.temp_default_products[i]);
      }
    }
    $rootScope.default_products=mySharedService.temp_default_products;
    mySharedService.default_products=mySharedService.temp_default_products;
    
    
    $scope.product_segment=[];
    $scope.product_cat_data=[];
    $rootScope.product_data=[];
    $rootScope.prod_feature=[];
    $scope.prod_state_price=[];
    $scope.ind_value=0;
    $scope.data.cat_val="";
    $scope.$broadcast('reset');
    
    $scope.add_product_ret(1);
  }
  /*Retailer Add Order Cart function End*/
  
  /*Retailer Add Order Cart Delete function Start*/
  $scope.del_cart = function(index)
  {
    if(mySharedService.share_seg_comb_data.length)
    {
      $scope.segment_comb_array=mySharedService.share_seg_comb_data;
    }
    console.log($scope.cart_arr);
    console.log($rootScope.seg_amt);
    console.log($scope.segment_comb_array);
    console.log($rootScope.dist_array);
    console.log($rootScope.price_val_chg);
    var confirmPopup = $ionicPopup.confirm({
      title: 'Delete Item',
      template: 'Are you sure you want to delete this item?',
      cancelText: 'No',
      okText: 'Yes'
    });
    confirmPopup.then(function(res) {
      if(res) {
        console.log('You are sure');
        console.log($scope.cart_arr[index].amount);
        if($rootScope.seg_amt.length)
        {
          for(i=0;i<$rootScope.seg_amt.length;i++)
          {
            if($rootScope.seg_amt[i].segment_name == $scope.cart_arr[index].segment_name)
            {
              $rootScope.seg_amt[i].price = (parseFloat($rootScope.seg_amt[i].price)-parseFloat($scope.cart_arr[index].amount)*parseFloat($scope.cart_arr[index].quantity)).toFixed(2);
            }
            else
            {
              
            }
          }
          
        }
        
        function findOccurrences(arr, val) {
          console.log(val);
          var i, j,
          count = 0;
          for (i = 0, j = arr.length; i < j; i++) {
            (arr[i].segment_name === val) && count++;
          }
          return count;
        }
        
        cnt = findOccurrences($scope.cart_arr, $scope.cart_arr[index].segment_name);
        
        if(cnt==1)
        {
          
          for(i=0;i<$rootScope.seg_amt.length;i++)
          {
            if($rootScope.seg_amt[i].segment_name==$scope.cart_arr[index].segment_name)
            {
              $rootScope.seg_amt.splice(index,1);
            }
          }
        }
        
        $scope.cart_arr.splice(index,1);
        
        // for(i=0;i<$rootScope.seg_amt.length;i++)
        // {
        //    cnt = findOccurrences($scope.cart_arr, $rootScope.seg_amt[i].segment_name);
        
        //   // for(j=0;j<$scope.cart_arr;j++)
        //   // {
        //   //   if($scope.cart_arr[j].segment_name!=$scope.cart_arr[j+1].segment_name)
        //   //   {
        //   //     if(j==$scope.cart_arr.length)
        //   //     {
        //   //     }
        //   //   }
        //   // }
        // }
        console.log(cnt);
        
        
        // if(cnt==1)
        // {
        // }
        $scope.segment_comb_array.splice(index,1);
        // $scope.gst_array.splice(index,1);
        $rootScope.dist_array.splice(index,1);
        $rootScope.price_val_chg.splice(index,1);
        
        console.log($scope.cart_arr);
        console.log($rootScope.seg_amt);
        console.log($rootScope.dist_array);
        console.log($scope.segment_comb_array);
        
        var seg_len= $rootScope.seg_amt.length;
        console.log(seg_len);
        
        if(seg_len==0)
        {
          $rootScope.valid=false;
        }
        
        for(i=0;i<seg_len;i++)
        {
          if($scope.segment_comb_array[i].dist==undefined)
          {
            $rootScope.valid=false;
          }
          else
          {
            if(i==seg_len-1)
            {
              $rootScope.valid=true;
            }
          }
        }
        
      } else {
        console.log('You are not sure');
      }
    });
    
  }
  /*Retailer Add Order Cart Delete function End*/
  $scope.counterr=0;
  $scope.save_qty_val=function(qty)
  {
    if($scope.counterr==0)
    {
      console.log(qty);
      mySharedService.saved_qty=qty;
      $scope.counterr++;
    }
  }
  
  $scope.save_qty=function(qty,cat_no,seg_name,amt)
  {
    $scope.counterr=0;
    console.log(qty+" "+cat_no+" "+seg_name+" "+amt);
    console.log($rootScope.seg_amt);
    console.log($rootScope.price_val_chg);
    console.log(mySharedService.saved_qty);
    if(mySharedService.saved_qty)
    {
      upd_qty=parseFloat(mySharedService.saved_qty)-parseFloat(qty);
      
      console.log(upd_qty);
      
      for(i=0;i<$rootScope.seg_amt.length;i++)
      {
        console.log($rootScope.seg_amt[i].segment_name + seg_name);
        if($rootScope.seg_amt[i].segment_name == seg_name)
        {
          $rootScope.seg_amt[i].price = (parseFloat($rootScope.seg_amt[i].price)-parseFloat(amt)*parseFloat(upd_qty)).toFixed(2);
          break;
        }
        else
        {
          if(i == $rootScope.seg_amt.length-1)
          {
            $rootScope.seg_amt.push({segment_name: seg_name, price:(parseFloat(amt)*parseFloat(upd_qty)).toFixed(2)});
            break;
          }
        }
      }
      
      if($rootScope.price_val_chg.length)
      {
        console.log("IFFF");
        for(i=0;i<$rootScope.price_val_chg.length;i++)
        {
          if($rootScope.price_val_chg[i].seg_name == seg_name)
          {
            $rootScope.price_val_chg[i].price_val = (parseFloat($rootScope.price_val_chg[i].price_val)-parseFloat(amt)*parseFloat(upd_qty)).toFixed(2);
            break;
          }
          else
          {
            if(i == $rootScope.price_val_chg.length-1)
            {
              $rootScope.price_val_chg.push({seg_name: seg_name, price_val:(parseFloat(amt)*parseFloat(upd_qty)).toFixed(2)});
              break;
            }
          }
        }
      }
      else
      {
        console.log("ELSEEE");
        $rootScope.price_val_chg.push({seg_name: seg_name, price_val:(parseFloat(amt)*parseFloat(upd_qty)).toFixed(2)});
      }
      mySharedService.saved_qty='';
      
      console.log(mySharedService.share_seg_comb_data);
    }
    console.log($rootScope.seg_amt);
    console.log($rootScope.price_val_chg);
  }
  
  
  /*Retailer Add Order Combo Segment function Start*/
  $scope.order_det=[];
  $scope.tot_order_det=[];
  
  $scope.seg_price_disc=0;
  $scope.push_details=function(seg_name,seg_price,discount,distributor,dist_img,dist_id,typee)
  {
    console.log(seg_name + seg_price + discount + distributor);
    console.log($scope.data.dist_name);
    console.log(mySharedService.share_seg_comb_data);
    if(mySharedService.share_seg_comb_data.length)
    {
      $scope.segment_comb_array=mySharedService.share_seg_comb_data;
    }
    console.log($scope.segment_comb_array);
    $scope.seg_price_disc= (parseFloat(seg_price) - parseFloat((seg_price*discount)/100)).toFixed(2);
    
    if($scope.segment_comb_array.length)
    {
      console.log("IF");
      for(i=0;i<$scope.segment_comb_array.length;i++)
      {
        console.log($scope.segment_comb_array[i].dist + " " + distributor);
        
        if($scope.segment_comb_array[i].dist == distributor)
        {
          console.log("INSO IF"+i);
          
          for(j=0;j<$scope.segment_comb_array.length;j++)
          {
            if($scope.segment_comb_array[j].dist == undefined && $scope.segment_comb_array[j].seg_name == seg_name)
            {
              console.log(j+" "+$scope.segment_comb_array[j].seg_name);
              console.log("SEG ARRAY UNDEF");
              $scope.segment_comb_array[j].dist =  distributor;
              $scope.segment_comb_array[j].disc = parseFloat(discount).toFixed(2);
              $scope.segment_comb_array[j].segment_price_mrp = parseFloat(seg_price).toFixed(2);
              $scope.segment_comb_array[j].seg_price_disc = parseFloat($scope.seg_price_disc).toFixed(2);
              $scope.segment_comb_array[j].distr_img = dist_img;
              $scope.segment_comb_array[j].dist_id = dist_id;
              break;
            }
            else if($scope.segment_comb_array[j].seg_name != seg_name)
            {
              if(j == $scope.segment_comb_array.length-1)
              {
                $scope.segment_comb_array.push({seg_name: seg_name, segment_price_mrp: parseFloat(seg_price).toFixed(2), seg_price_disc:parseFloat($scope.seg_price_disc).toFixed(2), disc: parseFloat(discount).toFixed(2), dist: distributor, distr_img: dist_img, dist_id:dist_id, gst: 18, after_gst_amt: 0, gst_amt: 0});
                break;
              }
              
            }
            
          }
          
          console.log($scope.segment_comb_array);
          console.log($scope.tot_order_det);
          break;
        }
        else if($scope.segment_comb_array[i].dist == undefined && $scope.segment_comb_array[i].seg_name == seg_name)
        {
          console.log("INSO UNDEFINED"+i);
          $scope.segment_comb_array[i].dist =  distributor;
          $scope.segment_comb_array[i].seg_name =  seg_name;
          $scope.segment_comb_array[i].segment_price_mrp = parseFloat(seg_price).toFixed(2);
          $scope.segment_comb_array[i].seg_price_disc = parseFloat($scope.seg_price_disc).toFixed(2);
          $scope.segment_comb_array[i].disc = parseFloat(discount).toFixed(2);
          $scope.segment_comb_array[i].distr_img = dist_img;
          $scope.segment_comb_array[i].dist_id = dist_id;
          break;
        }
        else if($scope.segment_comb_array[i].seg_name == seg_name && $scope.segment_comb_array[i].dist != distributor)
        {
          console.log("INSO DISC CHANGE"+i);
          $scope.segment_comb_array[i].dist =  distributor;
          $scope.segment_comb_array[i].seg_name =  seg_name;
          $scope.segment_comb_array[i].segment_price_mrp = parseFloat(seg_price).toFixed(2);
          $scope.segment_comb_array[i].seg_price_disc = parseFloat($scope.seg_price_disc).toFixed(2);
          $scope.segment_comb_array[i].disc = parseFloat(discount).toFixed(2);
          $scope.segment_comb_array[i].distr_img = dist_img;
          $scope.segment_comb_array[i].dist_id = dist_id;
          break;
          
        } else if($scope.segment_comb_array[i].seg_name != seg_name && $scope.segment_comb_array[i].dist == distributor)  {
          
          console.log("INSO DISC CHANGE"+i);
          $scope.segment_comb_array[i].dist =  distributor;
          $scope.segment_comb_array[i].seg_name =  seg_name;
          $scope.segment_comb_array[i].segment_price_mrp = parseFloat(seg_price).toFixed(2);
          $scope.segment_comb_array[i].seg_price_disc = parseFloat($scope.seg_price_disc).toFixed(2);
          $scope.segment_comb_array[i].disc = parseFloat(discount).toFixed(2);
          $scope.segment_comb_array[i].distr_img = dist_img;
          $scope.segment_comb_array[i].dist_id = dist_id;
          break;
          
        } else {
          
          console.log("INSO ELSE");
          if(i == $scope.segment_comb_array.length-1)
          {
            $scope.segment_comb_array.push({seg_name: seg_name, segment_price_mrp: parseFloat(seg_price).toFixed(2), seg_price_disc:parseFloat($scope.seg_price_disc).toFixed(2), disc: parseFloat(discount).toFixed(2), dist: distributor, distr_img: dist_img, dist_id:dist_id, gst: 18, after_gst_amt: 0, gst_amt: 0});
            break;
          }
          
        }
      }
    }
    else
    {
      console.log("ELSE");
      $scope.segment_comb_array.push({seg_name: seg_name, segment_price_mrp: parseFloat(seg_price).toFixed(2), seg_price_disc:parseFloat($scope.seg_price_disc).toFixed(2), disc: parseFloat(discount).toFixed(2), dist: distributor, distr_img: dist_img, dist_id:dist_id, gst: 18, after_gst_amt: 0, gst_amt: 0});
    }
    
    var seg_len= $rootScope.seg_amt.length;
    console.log(seg_len);
    for(i=0;i<seg_len;i++)
    {
      if($scope.segment_comb_array[i].dist==undefined)
      {
        $rootScope.valid=false;
        break;
      }
      else
      {
        if(i==seg_len-1)
        {
          $rootScope.valid=true;
        }
      }
    }
    
    console.log("ORDER DET");
    console.log($scope.order_det);
    console.log($scope.segment_comb_array);
  }
  /*Retailer Add Order Combo Segment function End*/
  
  
  $scope.ind_value=0;
  $scope.value=function(val)
  {
    console.log(val);
    $scope.ind_value=val;
  }
  
  /*Retailer Add Order Insert Into Order,Order_Item,Segment Delivery Start*/
  $scope.oid = mySharedService.shareLastOIDdata;
  $scope.distr_arr=[];
  $scope.distr_arr= mySharedService.shareDistListdata;
  $scope.order_lst=mySharedService.shareOrdDistListdata;
  $scope.total_order_val;
  
  function checkProperty(prop, newObj) {
    var result;
    Object.keys(newObj).forEach(function (key) {
      if (newObj[key]["dist"] === prop) {
        result = key
      }
    });
    return result;
  }
  
  $scope.show_proceed_btn=mySharedService.show_proceed_btn;
  
  $scope.fetch_all=function(value)
  {
    
    $scope.tot_order_det=[];
    $scope.new_gst_arr=[];
    mySharedService.new_arrr=[];
    mySharedService.shareOrdDistListdata=[];
    
    console.log(mySharedService.share_seg_comb_data);
    
    if(mySharedService.share_seg_comb_data.length)
    {
      $scope.segment_comb_array=mySharedService.share_seg_comb_data;
    }
    
    $ionicLoading.show
    ({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    
    for(i=0;i<$rootScope.seg_amt.length;i++)
    {
      $scope.seg_price_discount= (parseFloat($rootScope.seg_amt[i].price) - (parseFloat($rootScope.seg_amt[i].price)*parseFloat($rootScope.disc_val[$rootScope.seg_amt[i].segment_name]))/100).toFixed(2);
      
      var exists = checkProperty($scope.data.dist_name[$rootScope.seg_amt[i].segment_name].dr_name, $scope.tot_order_det);
      console.log(typeof(exists));
      if ($scope.tot_order_det.length == 0 || !exists)
      {
        $scope.tot_order_det.push({seg_name: $rootScope.seg_amt[i].segment_name, segment_price_mrp: parseFloat($rootScope.seg_amt[i].price).toFixed(2), seg_price_disc:parseFloat($scope.seg_price_discount).toFixed(2), disc: parseFloat($rootScope.disc_val[$rootScope.seg_amt[i].segment_name]).toFixed(2), dist: $scope.data.dist_name[$rootScope.seg_amt[i].segment_name].dr_name, distr_img: $scope.data.dist_name[$rootScope.seg_amt[i].segment_name].dr_image, dist_id: $scope.data.dist_name[$rootScope.seg_amt[i].segment_name].id, gst: 18, after_gst_amt: 0, gst_amt: 0});
      }
      else {
        $scope.tot_order_det[exists].dist =  $scope.data.dist_name[$rootScope.seg_amt[i].segment_name].dr_name;
        $scope.tot_order_det[exists].seg_name = $rootScope.seg_amt[i].segment_name;
        $scope.tot_order_det[exists].segment_price_mrp = (parseFloat($scope.tot_order_det[exists].segment_price_mrp) + parseFloat($rootScope.seg_amt[i].price)).toFixed(2);
        $scope.tot_order_det[exists].seg_price_disc = (parseFloat($scope.tot_order_det[exists].seg_price_disc) + parseFloat($scope.seg_price_disc)).toFixed(2);
        $scope.tot_order_det[exists].disc = (parseFloat($scope.tot_order_det[exists].disc) + parseFloat($rootScope.disc_val[$rootScope.seg_amt[i].segment_name])).toFixed(2);
        $scope.tot_order_det[exists].distr_img = $scope.data.dist_name[$rootScope.seg_amt[i].segment_name].dr_image;
        $scope.tot_order_det[exists].dist_id = $scope.data.dist_name[$rootScope.seg_amt[i].segment_name].id;
      }
    }
    
    
    console.log($scope.seg_amt);
    console.log($scope.segment_comb_array);
    console.log($scope.tot_order_det);
    if($scope.segment_comb_array.length)
    {
      $scope.total_order_val=0;
      for(i=0;i<$scope.segment_comb_array.length;i++)
      {
        if($scope.segment_comb_array[i].seg_name==$rootScope.price_val_chg[i].seg_name && parseFloat($scope.segment_comb_array[i].segment_price_mrp).toFixed(2) != parseFloat($rootScope.price_val_chg[i].price_val).toFixed(2))
        {
          $scope.segment_comb_array[i].segment_price_mrp=parseFloat($rootScope.price_val_chg[i].price_val).toFixed(2);
          $scope.chg_val=(parseFloat($rootScope.price_val_chg[i].price_val)-(parseFloat($scope.segment_comb_array[i].disc)*parseFloat($rootScope.price_val_chg[i].price_val))/100).toFixed(2);
          $scope.segment_comb_array[i].seg_price_disc=parseFloat($scope.chg_val).toFixed(2);
        }
        $scope.segment_comb_array[i].gst_amt= ((parseFloat($scope.segment_comb_array[i].gst)*parseFloat($scope.segment_comb_array[i].seg_price_disc))/100).toFixed(2);
        
        $scope.segment_comb_array[i].after_gst_amt= (parseFloat($scope.segment_comb_array[i].seg_price_disc) + (parseFloat($scope.segment_comb_array[i].gst)*parseFloat($scope.segment_comb_array[i].seg_price_disc))/100).toFixed(2);
        $scope.total_order_val=(parseFloat($scope.total_order_val)+parseFloat($scope.segment_comb_array[i].after_gst_amt)).toFixed(2);
        
        for(j=0;j<$scope.cart_arr.length;j++)
        {
          if($scope.cart_arr[j].segment_name==$scope.segment_comb_array[i].seg_name)
          {
            $scope.cart_arr[j].dist_id= $scope.segment_comb_array[i].dist_id;
          }
        }
      }
    }
    
    if($scope.tot_order_det.length)
    {
      $scope.total_order_val_final=0;
      for(i=0;i<$scope.tot_order_det.length;i++)
      {
        
        for(j=0;j<$scope.segment_comb_array.length;j++)
        {
          if($scope.tot_order_det[i].dist == $scope.segment_comb_array[j].dist)
          {
            $scope.tot_order_det[i].gst_amt= ((parseFloat($scope.segment_comb_array[j].gst)*parseFloat($scope.segment_comb_array[j].seg_price_disc))/100).toFixed(2);
            $scope.tot_order_det[i].after_gst_amt= (parseFloat($scope.tot_order_det[i].after_gst_amt) + parseFloat($scope.segment_comb_array[j].seg_price_disc) + (parseFloat($scope.segment_comb_array[j].gst)*parseFloat($scope.segment_comb_array[j].seg_price_disc))/100).toFixed(2);
          }
        }
        
        $scope.total_order_val_final=(parseFloat($scope.total_order_val_final)+parseFloat($scope.tot_order_det[i].after_gst_amt)).toFixed(2);
      }
    }
    
    
    console.log($scope.cart_arr);
    console.log($scope.tot_order_det);
    console.log($scope.segment_comb_array);
    console.log(mySharedService.saved_order_id);
    
    
    retailerService.insert_in_order($scope.cart_arr,$scope.segment_comb_array,$scope.total_order_val_final,$scope.tot_order_det,value,mySharedService.saved_order_id)
    .then(function (result)
    {
      $scope.oid=result.data.data;
      mySharedService.shareLastOIDdata = result.data.data;
      mySharedService.shareDistListdata = $scope.segment_comb_array;
      mySharedService.shareOrdDistListdata = $scope.tot_order_det;
      $scope.distr_arr=$scope.segment_comb_array;
      $scope.order_lst=$scope.tot_order_det;
      $ionicLoading.hide();
      console.log(value);
      if(value==2)
      {
        mySharedService.show_proceed_btn=true;
      }
      $state.go('tab.orderdt');
      $scope.tot_order_det=[];
      $scope.total_order_val_final=0;
    },
    function (err) {
      $ionicLoading.hide();
      console.error(err);
    })
  }
  /*Retailer Add Order Insert Into Order,Order_Item,Segment Delivery End*/
  
  $scope.show_last_payment=function()
  {
    console.log(mySharedService.saved_order_id);
    console.log($scope.order_lst);
    
    $ionicLoading.show
    ({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    retailerService.show_last_payment(mySharedService.saved_order_id)
    .then(function (result)
    {
      console.log(result);
      for(i=0;i<result.data.length;i++)
      {
        mySharedService.payment_type[i]=result.data[i].order_payment_type;
        mySharedService.payment_mode[i]=result.data[i].mode;
        mySharedService.order_amt[i]=result.data[i].amount;
        mySharedService.order_cno[i]=result.data[i].cheque_no;
        mySharedService.order_ref[i]=result.data[i].transaction_id;
        mySharedService.next_followup_date[i]=result.data[i].credit_followup;
        mySharedService.distributor_idd[i]=result.data[i].distributor_id;
        if(result.data[i].credit_followup)
        {
          mySharedService.payment_type[i]='Credit';
        }
        
        // if(result.data.length==$scope.order_lst.length)
        // {
        for(j=0;j<$scope.order_lst.length;j++)
        {
          if($scope.order_lst[j].dist_id==result.data[i].distributor_id)
          {
            mySharedService.new_arrr.push($scope.order_lst[j]);
          }
        }
        // }
      }
      console.log(mySharedService.new_arrr);
      $state.go('tab.confirmord');
      $ionicLoading.hide();
    },
    function (err) {
      $ionicLoading.hide();
      console.error(err);
    })
    mySharedService.last_payment=true;
  }
  
  $scope.neew_tmp_arr=[];
  
  if(mySharedService.new_arrr.length)
  {
    console.log($scope.order_lst);
    console.log(mySharedService.shareOrdDistListdata);
    $scope.neew_tmp_arr=$scope.order_lst;
    console.log(mySharedService.new_arrr);
    if(mySharedService.new_arrr.length==$scope.order_lst.length)
    {
      $scope.order_lst=mySharedService.new_arrr;
      mySharedService.shareOrdDistListdata=mySharedService.new_arrr;
    }
    else
    {
      $scope.order_lst=[];
      for(i=0;i<$scope.neew_tmp_arr.length;i++)
      {
        for(j=0;j<mySharedService.new_arrr.length;j++)
        {
          if(mySharedService.new_arrr[j].dist_id==$scope.neew_tmp_arr[i].dist_id)
          {
            $scope.order_lst.push(mySharedService.new_arrr[j]);
            console.log($scope.order_lst);
            mySharedService.shareOrdDistListdata.splice(i,1);
          }
        }
      }
      console.log($scope.order_lst);
      for(k=0;k<mySharedService.shareOrdDistListdata.length;k++)
      {
        $scope.order_lst.push(mySharedService.shareOrdDistListdata[k]);
      }
      console.log($scope.order_lst);
      
    }
  }
  
  $scope.payment_data={};
  $scope.payment_data.payment_type=[];
  $scope.payment_data.payment_mode=[];
  $scope.payment_data.order_amt=[];
  $scope.payment_data.order_cno=[];
  $scope.payment_data.order_ref=[];
  $scope.payment_data.next_followup_date=[];
  $scope.payment_data.distributor_idd=[];
  // $scope.payment_data.payment_type[0]='aa';
  if(mySharedService.payment_type.length)
  {
    console.log(mySharedService.payment_type);
    for(i=0;i<mySharedService.payment_type.length;i++)
    {
      $scope.payment_data.payment_type[i]=mySharedService.payment_type[i];
      $scope.payment_data.payment_mode[i]=mySharedService.payment_mode[i];
      $scope.payment_data.order_amt[i]=mySharedService.order_amt[i];
      $scope.payment_data.order_cno[i]=mySharedService.order_cno[i];
      $scope.payment_data.order_ref[i]=mySharedService.order_ref[i];
      $scope.payment_data.next_followup_date[i]=mySharedService.next_followup_date[i];
      $scope.payment_data.distributor_idd[i]=mySharedService.distributor_idd[i];
    }
  }
  
  
  /*Retailer Add Order GST Modal Start*/
  $ionicModal.fromTemplateUrl('templates/ret-gst-info.html', {
    scope: $scope,
    animation: 'zoomIn'
  }).then(function(modal) {
    $scope.gst_modal = modal;
  });
  
  // ++++++++++++++++++ Open modal +++++++++++++++++++++++ //
  $scope.open_gst_modal = function(distributor_name) {
    $scope.distt_name=distributor_name;
    $scope.gst_modal.show();
  };
  // ++++++++++++++++++ Close modal +++++++++++++++++++++++ //
  $scope.close_gst_modal = function() {
    $scope.gst_modal.hide();
  };
  
  $scope.orderDate;
  $scope.currentDate = new Date();
  $scope.orderDate = moment($scope.currentDate).format('YYYY-MM-DD');
  
  $scope.formatDate = function(date){
    return new Date(date)
  }
  
  $scope.sub_date = function()
  {
    $scope.currentDate = moment($scope.currentDate).subtract(1, 'days');
    $scope.orderDate = moment($scope.currentDate).format('YYYY-MM-DD');
    console.log($scope.orderDate);
  }
  
  $scope.today = new Date();
  $scope.add_date = function()
  {
    $scope.currentDate = moment($scope.currentDate).format('YYYY-MM-DD');
    $scope.today = moment($scope.today).format('YYYY-MM-DD');
    if($scope.currentDate < $scope.today)
    {
      console.log($scope.currentDate);
      $scope.currentDate = moment($scope.currentDate).add(1, 'days');
      $scope.orderDate = moment($scope.currentDate).format('YYYY-MM-DD');
      console.log($scope.orderDate);
    }
  }
  
  $scope.next_followup_dt;
  $scope.date_val=function(dt)
  {
    console.log(dt);
    $scope.next_followup_dt=dt;
  }
  
  $scope.payment_mode=[];
  $scope.payment_type=[];
  $scope.next_followup_date=[];
  $scope.order_amt=[];
  $scope.order_ref=[];
  $scope.order_cno=[];
  $scope.next_followup_dt=[];
  $scope.new_pay_type_arr=[];
  $scope.new_pay_mode_arr=[];
  $scope.new_type_id_arr=[];
  $scope.new_amt_arr=[];
  $scope.new_ref_arr=[];
  $scope.new_cno_arr=[];
  $scope.credit_arr=[];
  $scope.credit_date=[];
  $scope.new_credit_type_id_arr=[];
  
  $scope.confirm_order=function()
  {
    // $scope.distr_arr=[];
    $scope.segment_comb_array=[];
    $scope.gst_array=[];
    $rootScope.dist_array=[];
    $rootScope.seg_amt=[];
    $scope.seg_det=[];
    $scope.cart_arr=[];
    $rootScope.price_val_chg=[];
    console.log($scope.order_lst);
    console.log($scope.payment_data);
    
    if($scope.order_lst.length<$scope.payment_data.distributor_idd.length)
    {
      console.log("IN IF");
      console.log($scope.order_lst.length);
      console.log($scope.payment_data.distributor_idd.length);
      for(k=0;k<$scope.order_lst.length;k++)
      {
        for(l=0;l<$scope.payment_data.distributor_idd.length;l++)
        {
          console.log("CONS");
          if($scope.order_lst[k].dist_id==$scope.payment_data.distributor_idd[l])
          {
            console.log("IF"+l);
          }
          else
          {
            console.log("ELSE"+l);
            $scope.payment_data.distributor_idd.splice(l,1);
            $scope.payment_data.next_followup_date.splice(l,1);
            $scope.payment_data.order_amt.splice(l,1);
            $scope.payment_data.order_cno.splice(l,1);
            $scope.payment_data.order_ref.splice(l,1);
            $scope.payment_data.payment_mode.splice(l,1);
            $scope.payment_data.payment_type.splice(l,1);
          }
        }
      }
    }
    
    console.log($scope.order_lst);
    console.log($scope.payment_data);
    
    if($scope.payment_data.payment_mode=='Neft')
    {
      $scope.order_cno=[];
    }
    
    if($scope.payment_data.payment_mode=='Cheque')
    {
      $scope.order_ref=[];
    }
    
    if($scope.payment_data.next_followup_date.length)
    {
      for(i=0;i<$scope.payment_data.next_followup_date.length;i++)
      {
        $scope.next_followup_dt[i]=moment($scope.payment_data.next_followup_date[i]).format('YYYY-MM-DD');
      }
    }
    
    for(i=0;i<$scope.payment_data.payment_type.length;i++)
    {
      if($scope.payment_data.payment_type[i]=='Advance')
      {
        
        $scope.new_type_id_arr.push($scope.order_lst[i].dist_id);
        $scope.new_pay_type_arr.push($scope.payment_data.payment_type[i]);
        $scope.new_pay_mode_arr.push($scope.payment_data.payment_mode[i]);
        $scope.new_amt_arr.push($scope.payment_data.order_amt[i]);
        $scope.new_ref_arr.push($scope.payment_data.order_ref[i]);
        $scope.new_cno_arr.push($scope.payment_data.order_cno[i]);
      }
      else
      {
        $scope.new_credit_type_id_arr.push($scope.order_lst[i].dist_id);
        $scope.credit_arr.push($scope.payment_data.payment_type[i]);
        // $scope.new_credit_type_id_arr.push($scope.order_lst[i].dist);
        $scope.credit_date.push($scope.next_followup_dt[i]);
      }
    }
    console.log($scope.new_pay_type_arr);
    console.log($scope.new_pay_mode_arr);
    console.log($scope.new_type_id_arr);
    console.log($scope.new_amt_arr);
    console.log($scope.new_ref_arr);
    console.log($scope.new_cno_arr);
    console.log($scope.credit_arr);
    console.log($scope.new_credit_type_id_arr);
    console.log($scope.credit_date);
    $ionicLoading.show
    ({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    console.log($scope.oid);
    
    console.log($rootScope.retailers_id);
    console.log($scope.orderDate);
    console.log(mySharedService.last_payment);
    if(mySharedService.last_payment)
    {
      send_val=1;
    }
    else
    {
      send_val=0;
    }
    retailerService.update_in_order($scope.oid,$scope.credit_date,$scope.new_pay_type_arr,$scope.new_pay_mode_arr,$scope.orderDate,$scope.new_type_id_arr,$scope.new_amt_arr,$scope.new_ref_arr,$scope.new_cno_arr,$scope.credit_arr,$scope.new_credit_type_id_arr,send_val)
    .then(function (result)
    {
      $scope.order_list(0);
      $ionicLoading.hide();
    },
    function (err) {
      console.error(err);
      $ionicLoading.hide();
    })
  }
  /*Retailer Add Order GST Modal End*/
  
  /*Edit Order Function Start*/
  $scope.edit_order=function()
  {
    mySharedService.edittt_val=true;
    mySharedService.payment_type=[];
    mySharedService.payment_mode=[];
    mySharedService.order_amt=[];
    mySharedService.order_cno=[];
    mySharedService.order_ref=[];
    mySharedService.next_followup_date=[];
    mySharedService.distributor_idd=[];
    $scope.make_dist_arr=[];
    mySharedService.share_seg_comb_data=[];
    $rootScope.valid=true;
    
    $ionicLoading.show
    ({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    console.log($scope.myDistAllOrderDetail);
    console.log(mySharedService.saved_seg_dist);
    console.log($scope.myDistAllOrderDetail.order_segment.length);
    console.log($scope.orderDists);
    $rootScope.seg_amt=[];
    $rootScope.disc_val=[];
    $rootScope.dist_array=[];
    $rootScope.show_distributors=[];
    mySharedService.cart_arr=[];
    mySharedService.dist_name=[];
    mySharedService.dist_name.length=0;
    var j=0;
    for(i=0;i<$scope.myDistAllOrderDetail.order_segment.length;i++)
    {
      $rootScope.seg_amt.push({segment_name: $scope.myDistAllOrderDetail.order_segment[i].segment_name, price:$scope.myDistAllOrderDetail.order_segment[i].segment_total_mrp});
      
      $rootScope.price_val_chg.push({seg_name: $scope.myDistAllOrderDetail.order_segment[i].segment_name, price_val:$scope.myDistAllOrderDetail.order_segment[i].segment_total_mrp});
      
      console.log($rootScope.seg_amt);
      for(k=0;k<mySharedService.saved_seg_dist.length;k++)
      {
        if(mySharedService.saved_seg_dist[k].segment_name==$scope.myDistAllOrderDetail.order_segment[i].segment_name)
        {
          $rootScope.dist_array.push(mySharedService.saved_seg_dist[k]);
          for(m=0;m<mySharedService.saved_seg_dist[k].distributors.length;m++)
          if(mySharedService.saved_seg_dist[k].distributors[m].dr_name==$scope.myDistAllOrderDetail.order_segment[i].distributor)
          {
            mySharedService.dist_name[$scope.myDistAllOrderDetail.order_segment[i].segment_name]=mySharedService.saved_seg_dist[k].distributors[m];
          }
        }
      }
      
      
      // retailerService.get_seg_dists($scope.myDistAllOrderDetail.order_segment[i].segment_name)
      //  .then(function (result)
      //    {
      //      console.log(result);
      //      console.log(j);
      
      //     for(k=0;k<result.data.distributor_data.length;k++)
      //     {
      //      mySharedService.new_result_arr.push(result.data.distributor_data[k]);
      //     }
      
      //      console.log(mySharedService.new_result_arr[0].segment_name);
      //      console.log(mySharedService.new_result_arr);
      
      //      // $scope.make_dist_arr.push({segment_name: $scope.myDistAllOrderDetail.order_segment[j].segment_name, dr_name: $scope.myDistAllOrderDetail.order_segment[j].distributor, dr_image: $scope.myDistAllOrderDetail.order_segment[j].dr_image, id: $scope.myDistAllOrderDetail.order_segment[j].distributor_id});
      
      
      //     $rootScope.dist_array.push({segment_name: mySharedService.new_result_arr[0].segment_name, distributors: mySharedService.new_result_arr});
      
      //     var filter_seg = $filter('filter')($scope.myDistAllOrderDetail.order_segment, {segment_name:mySharedService.new_result_arr[0].segment_name}, true)[0]['distributor'];
      
      //      console.log(filter_seg);
      
      //      var filter_val = $filter('filter')(mySharedService.new_result_arr, {dr_name:filter_seg ,segment_name:mySharedService.new_result_arr[0].segment_name}, true)[0];
      
      //      console.log(filter_val);
      
      //      mySharedService.dist_name[mySharedService.new_result_arr[0].segment_name]=filter_val;
      
      //        mySharedService.dist_name.length++;
      
      //      console.log(mySharedService.dist_name.length);
      
      //      j++;
      //      console.log($rootScope.dist_array);
      //      mySharedService.new_result_arr=[];
      
      //    },
      //    function (err) {
      //     console.error(err);
      //   })
      
      mySharedService.share_seg_comb_data.push({seg_name: $scope.myDistAllOrderDetail.order_segment[i].segment_name, segment_price_mrp: $scope.myDistAllOrderDetail.order_segment[i].segment_total_mrp, seg_price_disc:$scope.myDistAllOrderDetail.order_segment[i].segment_total, disc: $scope.myDistAllOrderDetail.order_segment[i].segment_discount, dist: $scope.myDistAllOrderDetail.order_segment[i].distributor, distr_img: $scope.myDistAllOrderDetail.order_segment[i].dr_image, dist_id:$scope.myDistAllOrderDetail.order_segment[i].distributor_id, gst: $scope.myDistAllOrderDetail.order_segment[i].gst_percent, after_gst_amt: $scope.myDistAllOrderDetail.order_segment[i].segment_total_amount, gst_amt: $scope.myDistAllOrderDetail.order_segment[i].gst_amount});
      
      $rootScope.show_distributors.push({distributors:$scope.myDistAllOrderDetail.order_segment[i].distributor});
      
      $rootScope.disc_val[$scope.myDistAllOrderDetail.order_segment[i].segment_name]=$scope.myDistAllOrderDetail.order_segment[i].segment_discount;
    }
    console.log(mySharedService.share_seg_comb_data);
    
    for(i=0;i<$scope.myDistAllOrderDetail.order_item.length;i++)
    {
      mySharedService.cart_arr.push({ segment_name: $scope.myDistAllOrderDetail.order_item[i].segment_name, catg_no: $scope.myDistAllOrderDetail.order_item[i].cat_no, quantity: $scope.myDistAllOrderDetail.order_item[i].qty, product_name: $scope.myDistAllOrderDetail.order_item[i].product_name, amount: $scope.myDistAllOrderDetail.order_item[i].rate, dist_id:0, feat_id: $scope.myDistAllOrderDetail.order_item[i].feat_id, feature: $scope.myDistAllOrderDetail.order_item[i].feature});
    }
    mySharedService.edit_enable=true;
    mySharedService.edit_enable_button=true;
    mySharedService.temp_cart_arr=mySharedService.cart_arr;
    
    
    
    $ionicHistory.clearCache().then(function () {
      $state.go('tab.addorder');
      $ionicLoading.hide();
    });
  }
  /*Edit Order Function End*/
  
  $scope.cart_arr=mySharedService.cart_arr;
  $scope.data.dist_name=mySharedService.dist_name;
  $scope.edit_enable=mySharedService.edit_enable;
  $scope.edit_enable_button=mySharedService.edit_enable_button;
  console.log($scope.data.dist_name);
  console.log($rootScope.seg_amt);
  console.log($rootScope.dist_array);
  console.log($rootScope.show_distributors);
  
  // if(!mySharedService.temp_dist_array.length)
  // {
  //    console.log("ONLY ONCE");
  //    mySharedService.temp_dist_array=$rootScope.dist_array;
  //    console.log(mySharedService.temp_dist_array);
  // }
  
  // console.log(mySharedService.dist_name);
  
  // if(!mySharedService.temp_dist_name.length)
  // {
  //    console.log("ONLY ONCE Dist");
  //    console.log(mySharedService.temp_dist_name.length);
  //    mySharedService.temp_dist_name=mySharedService.dist_name;
  // }
  //  console.log(mySharedService.temp_dist_name);
  
  //  console.log(mySharedService.edittt_val+" "+counter_edit +" "+mySharedService.temp_dist_array.length);
  //    console.log(mySharedService.temp_dist_array);
  
  // // var counter_edit=0;
  // if(mySharedService.edittt_val==true && mySharedService.temp_dist_array.length)
  // {
  //    console.log($rootScope.seg_amt);
  //    console.log(mySharedService.temp_dist_array);
  //    console.log(mySharedService.temp_dist_array.length);
  //    $rootScope.dist_array=[];
  //    mySharedService.dist_name=[];
  //    for(i=0;i<$rootScope.seg_amt.length;i++)
  //    {
  //      for(j=0;j<mySharedService.temp_dist_array.length;j++)
  //      {
  //        if($rootScope.seg_amt[i].segment_name==mySharedService.temp_dist_array[j].segment_name)
  //        {
  //          console.log(i+ " " + j);
  //         $rootScope.dist_array.push({segment_name: mySharedService.temp_dist_array[j].segment_name, distributors: mySharedService.temp_dist_array[j].distributors});
  //          console.log(mySharedService.temp_dist_name[$rootScope.seg_amt[i].segment_name]);
  //          mySharedService.dist_name[$rootScope.seg_amt[i].segment_name]=mySharedService.temp_dist_name[$rootScope.seg_amt[i].segment_name];
  //        }
  //      }
  //    }
  //    console.log(mySharedService.temp_dist_name);
  //    console.log(mySharedService.dist_name);
  //    counter_edit++;
  //  }
  
  //  console.log($rootScope.dist_array);
  //  console.log(mySharedService.dist_name);
  
  /*Retailer's Add Order Search Function Start*/
  $scope.data.segment_name;
  $scope.search_result;
  $scope.search_res=[];
  $scope.search_req=function(id, search_value)
  {
    console.log($scope.search_res);
    console.log(search_value);
    if($scope.search_result)
    {
      
      retailerService.get_search_res_val($scope.search_result.search_val)
      .then(function (result)
      {
        
        console.log(id +' '+ $scope.search_result.search_val);
        if(result.data.res == "seg")
        {
          console.log("SEG");
          // $scope.data.segment_namee=$scope.search_result.search_val;
          
          $scope.get_cat_no(id, $scope.search_result.search_val,2);
        }
        else
        {
          console.log("CAT");
          // $scope.data.cat_val=$scope.search_result.search_val;
          // console.log($scope.data.cat_val);
          
          $scope.get_cat_no(id, $scope.search_result.search_val,3,'1');
        }
        
      },
      function (err) {
        $ionicLoading.hide();
        console.error(err);
      })
    }
    
    retailerService.get_search(search_value)
    .then(function (result)
    {
      console.log(result);
      $scope.search_res=result.data;
    },
    function (err) {
      $ionicLoading.hide();
      console.error(err);
    })
  }
  /*Retailer's Add Order Search Function End*/
  
  
  
  /*Retailer's Notice start*/
  $scope.myNoticeList= mySharedService.shareNoticeList;
  console.log($scope.myNoticeList);
  $scope.notice_list = function ()
  {
    $ionicLoading.show({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    
    
    retailerService.notice_list()
    .then(function (result)
    {
      console.log(result);
      mySharedService.shareNoticeList = result.data;
      $state.go('tab.announcement');
      $ionicLoading.hide();
      
    }, function (err) {
      
      $ionicLoading.hide();
      console.error(err);
    })
  }
  /*Retailer's Notice End*/
  
  $scope.myNoticeDet= mySharedService.shareNoticeDet;
  $scope.ann_id=mySharedService.ann_id;
  $scope.notice_detail = function (id)
  {
    $scope.ann_id=id;
    $ionicLoading.show
    ({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    mySharedService.ann_id=id;
    retailerService.notice_detail(id)
    .then(function (result)
    {
      console.log(result);
      mySharedService.shareNoticeDet = result.data;
      $state.go('tab.announcement-detail');
      $ionicLoading.hide();
      
    }, function (err) {
      
      $ionicLoading.hide();
      console.error(err);
    })
  }
  
  
  $scope.showModal = function(templateUrl) {
    $ionicModal.fromTemplateUrl(templateUrl, {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });
  }
  
  $scope.closeModal = function() {
    $scope.modal.remove()
  };
  
  
  $scope.zoomMin = 1;
  $scope.showImages = function(index,img_val) {
    $scope.activeSlide = index;
    $scope.img_val=img_val;
    $scope.showModal('templates/zoom.html');
  };

  $scope.showinvoice = function(index,img_vals) {
    $scope.activeSlide = index;
    $scope.img_vals=img_vals;
    $scope.showModal('templates/invoice-modal.html');
  };
  
  $scope.range = function(min, max, step) {
    step = step || 1;
    var input = [];
    for (var i = min; i <= max; i += step) {
      input.push(i);
    }
    return input;
  }






  $scope.showModal = function(templateUrl) {
    $ionicModal.fromTemplateUrl(templateUrl, {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });
  }
  
  $scope.closeModal = function() {
    $scope.modal.remove()
  };
  
  
  $scope.zoomMin = 1;
  $scope.showImages = function(index,img_val) {
    $scope.activeSlide = index;
    $scope.img_val=img_val;
    $scope.showModal('templates/zoom.html');
  };

  $scope.showdocument = function(index,img_vals) {
    $scope.activeSlide = index;
    $scope.img_vals=img_vals;
    $scope.showModal('templates/document-modal.html');
  };
  
  $scope.range = function(min, max, step) {
    step = step || 1;
    var input = [];
    for (var i = min; i <= max; i += step) {
      input.push(i);
    }
    return input;
  }
  
  
  $scope.updateSlideStatus = function(slide) {
    var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
    if (zoomFactor == $scope.zoomMin) {
      $ionicSlideBoxDelegate.enableSlide(true);
    } else {
      $ionicSlideBoxDelegate.enableSlide(false);
    }
  };
  
  $scope.zoom= function(slide){
    $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).zoomBy(1.5,true);
  }
  
  /*Retailer's Notice Attachment Download start*/
  $scope.notice_download = function (file_name)
  {
    $ionicLoading.show({
      template: 'downloading...'
    });
    
    //     var fileName = "PointerEventsCordovaPlugin.wmv",
    //     uriString = "http://media.ch9.ms/ch9/8c03/f4fe2512-59e5-4a07-bded-124b06ac8c03/PointerEventsCordovaPlugin.wmv";
    
    // // open target file for download
    // window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
    //     fileSystem.root.getFile(fileName, { create: true }, function (targetFile) {
    
    //         var onSuccess, onError, onProgress; // plugin callbacks to track operation execution status and progress
    
    //         var downloader = new BackgroundTransfer.BackgroundDownloader();
    //         // Create a new download operation.
    //         var download = downloader.createDownload(uriString, targetFile);
    //         // Start the download and persist the promise to be able to cancel the download.
    //         app.downloadPromise = download.startAsync().then(onSuccess, onError, onProgress);
    //     });
    // });
    
    var url = upload_url + file_name;
    
    var targetPath = "///storage/emulated/0/Download/" + file_name;
    //var targetPath =  cordova.file.externalRootDirectory+'Download/'+ file_name;
    var trustHosts = true;
    var options = {};
    
    $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function(result) {
      // Success!
      $ionicLoading.hide();
      console.log('Download Successful');
      $cordovaToast.show('Notice Downloaded Successfully!', 'short', 'bottom');
      
    }, function(err) {
      // Error
      console.log(err);
      $ionicLoading.hide();
      $cordovaToast.show('Internet Not Found!', 'long', 'bottom');
      
    }, function (progress) {
      
      $timeout(function () {
        
        $scope.downloadProgress = (progress.loaded / progress.total) * 100;
        $ionicLoading.show({
          template: "Downloaded：" + Math.floor($scope.downloadProgress) + "%"
        });
        if ($scope.downloadProgress >= 100) {
          $ionicLoading.hide();
        }
        
        console.log('Notice Download = ' + $scope.downloadProgress);
      });
    });
  }
  /*Retailer's Notice Attachment Download End*/
  
  $rootScope.country_val={state_name:"West Bengal",district_name:"Kolkata",pincode:"700084"};
  
  /*Retailer's Profile Detail start*/
  $scope.myProfileDetail ={};
  $scope.myProfileDetail = mySharedService.shareProfileDetail;
  $scope.state_data = mySharedService.state_data;
  $scope.district_data = mySharedService.district_data;
  $scope.city_data = mySharedService.city_data;
  $scope.area_data = mySharedService.area_data;
  $scope.pincode_data = mySharedService.pincode_data;
  $scope.ship_state_data = mySharedService.ship_state_data;
  $scope.ship_district_data = mySharedService.ship_district_data;
  $scope.ship_city_data = mySharedService.ship_city_data;
  $scope.ship_area_data = mySharedService.ship_area_data;
  $scope.ship_pincode_data = mySharedService.ship_pincode_data;
  $scope.mysegments=[];
  $scope.mysegments=mySharedService.mysegments;
  $scope.disp_edit1=true;
  $scope.disp_edit2=true;
  $scope.disp_edit3=true;
  $scope.disp_edit4=true;
  $scope.disp_edit5=true;
  console.log($scope.myProfileDetail);
  $scope.profile_detail = function()
  {
    console.log("PROFILE");
    $ionicLoading.show({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    
    retailerService.profile_detail()
    .then(function (result)
    {
      // console.clear();
      console.log(result);
      // result.data.data.date_birth=moment(result.data.date_birth).format('DD-MMM-YYYY');
      $scope.myProfileDetail=result.data.data;
      mySharedService.shareProfileDetail = result.data.data;
      $rootScope.profile_state={state_name:result.data.data.state_name,district_name:result.data.data.district_name,pincode:result.data.data.pincode};
      console.log($rootScope.profile_state);
      $scope.state_data=result.data.state;
      mySharedService.state_data = result.data.state;
      $scope.district_data=result.data.dists;
      mySharedService.district_data = result.data.dists;
      $scope.city_data=result.data.city;
      mySharedService.city_data = result.data.city;
      $scope.area_data=result.data.area;
      mySharedService.area_data = result.data.area;
      $scope.pincode_data=result.data.pins;
      mySharedService.pincode_data = result.data.pins;
      
      $scope.ship_state_data=result.data.ship_states;
      mySharedService.ship_state_data = result.data.ship_states;
      $scope.ship_district_data=result.data.ship_dists;
      mySharedService.ship_district_data = result.data.ship_dists;
      $scope.ship_city_data=result.data.ship_city;
      mySharedService.ship_city_data = result.data.ship_city;
      $scope.ship_area_data=result.data.ship_area;
      mySharedService.ship_area_data = result.data.ship_area;
      $scope.ship_pincode_data=result.data.ship_pins;
      mySharedService.ship_pincode_data = result.data.ship_pins;
      
      $scope.mysegments=result.data.data1;
      mySharedService.mysegments = result.data.data1;
      $state.go('tab.profile');
      $ionicLoading.hide();
      
    }, function (err) {
      
      $ionicLoading.hide();
      console.error(err);
    })
  }
  /*Retailer's Profile Detail End*/
  
  console.log($rootScope.profile_state);
  console.log($rootScope.country_val);
  
  
  $scope.get_profile_districts=function(st_name,val)
  {
    console.log(st_name);
    retailerService.get_profile_districts(st_name)
    .then(function (result)
    {
      console.log(result);
      if(val==2)
      {
        $scope.ship_district_data=result.data.dists;
        mySharedService.ship_district_data = result.data.dists;
      }
      else
      {
        $scope.district_data=result.data.dists;
        mySharedService.district_data = result.data.dists;
      }
      $ionicLoading.hide();
    }, function (err) {
      $ionicLoading.hide();
      console.error(err);
    })
  }
  
  $scope.get_profile_city=function(dist_name,st_name,val)
  {
    console.log(dist_name+" "+st_name);
    retailerService.get_profile_city(dist_name,st_name)
    .then(function (result)
    {
      console.log(result);
      if(val==2)
      {
        $scope.ship_city_data=result.data.city;
        mySharedService.ship_city_data = result.data.city;
      }
      else
      {
        $scope.city_data=result.data.city;
        mySharedService.city_data = result.data.city;
      }
      $ionicLoading.hide();
    }, function (err) {
      $ionicLoading.hide();
      console.error(err);
    })
  }
  
  $scope.get_profile_area=function(city,st_name,val)
  {
    console.log(city+" "+st_name);
    retailerService.get_profile_area(city,st_name)
    .then(function (result)
    {
      console.log(result);
      if(val==2)
      {
        $scope.ship_area_data=result.data.area;
        mySharedService.ship_area_data = result.data.area;
      }
      else
      {
        $scope.area_data=result.data.area;
        mySharedService.area_data = result.data.area;
      }
      $ionicLoading.hide();
    }, function (err) {
      $ionicLoading.hide();
      console.error(err);
    })
  }
  
  $scope.get_profile_pincode=function(area,st_name,val)
  {
    console.log(area+" "+st_name);
    retailerService.get_profile_pincodes(area,st_name)
    .then(function (result)
    {
      console.log(result);
      if(val==2)
      {
        $scope.myProfileDetail.ship_pincode=result.data.pins[0].pincode;
      }
      else
      {
        $scope.myProfileDetail.pincode=result.data.pins[0].pincode;
      }
      $ionicLoading.hide();
    }, function (err) {
      $ionicLoading.hide();
      console.error(err);
    })
  }
  
  $scope.toggle_val=1;
  
  $scope.same_ship_as_bill_add=function(tg_val)
  {
    console.log(tg_val);
    if(tg_val==1)
    {
      $scope.myProfileDetail.ship_street=$scope.myProfileDetail.street;
      $scope.myProfileDetail.ship_state_name=$scope.myProfileDetail.state_name;
      $scope.myProfileDetail.ship_district_name=$scope.myProfileDetail.district_name;
      $scope.myProfileDetail.ship_pincode=$scope.myProfileDetail.pincode;
      $scope.myProfileDetail.ship_city=$scope.myProfileDetail.city;
      $scope.myProfileDetail.ship_area=$scope.myProfileDetail.area;
      
      $scope.ship_state_data=$scope.state_data;
      mySharedService.ship_state_data = mySharedService.state_data;
      $scope.ship_district_data=$scope.district_data;
      mySharedService.ship_district_data = mySharedService.district_data;
      $scope.ship_city_data=$scope.city_data;
      mySharedService.ship_city_data = mySharedService.city_data;
      $scope.ship_area_data=$scope.area_data;
      mySharedService.ship_area_data = mySharedService.area_data;
      $scope.toggle_val=2;
    }
    else
    {
      $scope.toggle_val=1;
      $scope.myProfileDetail.ship_street=[];
      $scope.myProfileDetail.ship_state_name='';
      $scope.myProfileDetail.ship_district_name='';
      $scope.myProfileDetail.ship_pincode='';
      $scope.myProfileDetail.ship_city='';
      $scope.myProfileDetail.ship_area='';
      $scope.ship_district_data=[];
      mySharedService.ship_district_data = [];
      $scope.ship_city_data=[];
      mySharedService.ship_city_data = [];
      $scope.ship_area_data=[];
      mySharedService.ship_area_data = [];
    }
  }
  
  $scope.select_state=function(val,pg)
  {
    console.log(val,pg);
    console.log(mySharedService.state_data);
    if(val.length)
    {
      for(i=0;i<mySharedService.state_data.length;i++)
      {
        if(mySharedService.state_data[i].state_name.slice(0,val.length)==val || (mySharedService.state_data[i].state_name.slice(0,val.length)).toLowerCase()==val)
        {
          console.log(i);
          $scope.state_data=[];
          $scope.state_data.push({'state_name':mySharedService.state_data[i].state_name});
          console.log($scope.state_data);
        }
      }
    }
  }
  
  
  $scope.select_district=function(val,pg)
  {
    console.log(val,pg);
    console.log(mySharedService.district_data);
    if(val.length)
    {
      for(i=0;i<mySharedService.district_data.length;i++)
      {
        if(mySharedService.district_data[i].district_name.slice(0,val.length)==val || (mySharedService.district_data[i].district_name.slice(0,val.length)).toLowerCase()==val)
        {
          console.log(i);
          $scope.district_data=[];
          $scope.district_data.push({'district_name':mySharedService.district_data[i].district_name,'state_name':mySharedService.district_data[i].state_name,'pincode':mySharedService.district_data[i].pincode});
          console.log($scope.district_data);
        }
      }
    }
  }
  
  
  $scope.select_state=function(val,pg)
  {
    console.log(val,pg);
    console.log(mySharedService.pincode_data);
    if(val.length)
    {
      for(i=0;i<mySharedService.pincode_data.length;i++)
      {
        if(mySharedService.pincode_data[i].pincode.slice(0,val.length)==val || (mySharedService.pincode_data[i].pincode.slice(0,val.length)).toLowerCase()==val)
        {
          console.log(i);
          $scope.pincode_data=[];
          $scope.pincode_data.push({'state_name':mySharedService.pincode_data[i].state_name,'district_name':mySharedService.pincode_data[i].district_name,'pincode':mySharedService.pincode_data[i].pincode});
          console.log($scope.pincode_data);
        }
      }
    }
  }
  
  
  $scope.get_add_infos=function(item,val)
  {
    console.log(item,val);
    
  }
  
  $scope.save_comp_info=function()
  {
    retailerService.save_comp_info($scope.myProfileDetail)
    .then(function (result)
    {
      console.log(result);
    }, function (err) {
      console.error(err);
    })
  }
  
  $scope.save_pers_info=function()
  {
    $scope.profile_date_birth=moment($scope.myProfileDetail.dob).format('YYYY-MM-DD');
    retailerService.save_pers_info($scope.myProfileDetail,$scope.profile_date_birth)
    .then(function (result)
    {
      console.log(result);
    }, function (err) {
      console.error(err);
    })
  }
  
  $scope.save_login_info=function()
  {
    retailerService.save_login_info($scope.myProfileDetail)
    .then(function (result)
    {
      var query = "UPDATE "+dbTableName+" SET password='"+$scope.myProfileDetail.password+"'";
      console.log(query);
      
      $cordovaSQLite.execute(db, query).then(function(res) {
        console.log(res);
      }, function (err) {
        console.error(err);
      });
      console.log(result);
    }, function (err) {
      console.error(err);
    })
  }
  
  $scope.save_add_info=function()
  {
    retailerService.save_add_info($scope.myProfileDetail)
    .then(function (result)
    {
      console.log(result);
    }, function (err) {
      console.error(err);
    })
  }
  
  $scope.save_ship_add_info=function()
  {
    retailerService.save_ship_add_info($scope.myProfileDetail)
    .then(function (result)
    {
      console.log(result);
    }, function (err) {
      console.error(err);
    })
  }
  
  /*Retailer's Profile Update start*/
  $scope.profile_update = function(type)
  {
    
    $ionicLoading.show({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    
    if(type == 1) {
      $scope.myProfileDetail.date_birth=moment($scope.myProfileDetail.date_birth).format('YYYY-MM-DD');
      
      retailerService.profile_update($scope.myProfileDetail)
      .then(function (result)
      {
        console.log(result);
        $scope.profile_detail();
        
        $timeout(function () {
          
          $cordovaToast.show('Profile Updated Successfully!', 'short', 'bottom').then(function(success) { },
          function (error) {
          });
          
        }, 500);
        
      }, function (err) {
        $ionicLoading.hide();
        console.error(err);
      })
    }
    
    if(type == 2) {
      
      var options = {
        
        fileKey: "file",
        fileName: "image.jpg",
        chunkedMode: false,
        mimeType: "image/*",
      };
      
      $cordovaFileTransfer.upload(server_url+"/profile_update.php?login_id="+login_id, $scope.mediaData[0].src, options).then(function(result) {
        
        console.log("SUCCESS: " + JSON.stringify(result));
        $scope.mediaData=[];
        
        $scope.profile_detail();
        
      }, function(err) {
        $ionicLoading.hide();
        console.log("ERROR: " + JSON.stringify(err));
      }, function (progress) {
        
      });
      
    }
  }
  /*Retailer's Profile Update End*/
  
  var posOptions = {
    timeout: 30000,
    maximumAge: 0
  };
  
  function onRequestSuccess(success) {
    $rootScope.isGpsEnabled = true;
    console.log("Successfully requested accuracy: "+success.message);
    
    var options = {timeout: 10000, enableHighAccuracy: true};
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      console.log(position.coords.latitude+" "+position.coords.longitude);
      
      $scope.latitude=position.coords.latitude;
      $scope.longitude=position.coords.longitude;
      console.log($scope.latitude);
      console.log($scope.longitude);
      mySharedService.lat=position.coords.latitude;
      mySharedService.long=position.coords.longitude;
      $state.go('point-location');
      $ionicLoading.hide();
    }, function(error){
      $ionicLoading.hide();
      console.log("Could not get location");
    });
  }
  
  
  function onRequestFailure(error) {
    
    $rootScope.isGpsEnabled = false;
    console.error("Accuracy request failed: error code="+error.code+"; error message="+error.message);
    
    if(error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED) {
      cordova.plugins.diagnostic.switchToLocationSettings();
      
      $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position){
        console.log(position.coords.latitude+" "+position.coords.longitude);
        
        $scope.latitude=position.coords.latitude;
        $scope.longitude=position.coords.longitude;
        console.log($scope.latitude);
        console.log($scope.longitude);
        mySharedService.lat=position.coords.latitude;
        mySharedService.long=position.coords.longitude;
        $state.go('point-location');
        $ionicLoading.hide();
      }, function(error){
        $ionicLoading.hide();
        console.log("Could not get location");
      });
      
    } else {
      ionic.Platform.exitApp();
    }
  }
  
  $scope.latitude=mySharedService.lat;
  $scope.longitude=mySharedService.long;
  $scope.last_gps_add=mySharedService.last_gps;
  $scope.point_my_loc = function()
  {
    console.log("HELLO");
    
    retailerService.get_gps_loc()
    .then(function (result)
    {
      console.log(result);
      
      $ionicLoading.show({
        template: '<span class="icon spin ion-loading-d"></span> Loading...'
      });
      
      $scope.last_gps_add=result.data.gps_address;
      mySharedService.last_gps=result.data.gps_address;
      
      cordova.plugins.locationAccuracy.request(onRequestSuccess, onRequestFailure, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
      
      // var options = {timeout: 10000, enableHighAccuracy: true};
      // $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      //   console.log(position.coords.latitude+" "+position.coords.longitude);
      
      //   $scope.latitude=position.coords.latitude;
      //   $scope.longitude=position.coords.longitude;
      //   console.log($scope.latitude);
      //   console.log($scope.longitude);
      //   mySharedService.lat=position.coords.latitude;
      //   mySharedService.long=position.coords.longitude;
      //   $state.go('point-location');
      // }, function(error){
      //   console.log("Could not get location");
      // });
      
    },function (err) {
      console.error(err);
    })
  }
  
  $scope.add_loc=function()
  {
    $ionicLoading.show({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    console.log(locat+" "+$('#latitude').val()+" "+$('#longitude').val());
    retailerService.add_loc(locat,$('#latitude').val(),$('#longitude').val())
    .then(function (result)
    {
      $scope.point_my_loc();
      $ionicLoading.hide();
    },function (err) {
      $ionicLoading.hide();
      console.error(err);
    })
  }
  
  $scope.getImageTimeStamp = function() {
    return $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
  };
  
  $scope.formatDate = function(date){
    return new Date(date)
  }
  
  
  $scope.doTheBack = function() {
    window.history.back();
  }
  
  $scope.retailer_list= function() {
    $state.go('tab.retailers');
  }
  
  
  $scope.distributer_list= function() {
    $state.go('tab.distributor');
  }
  
  
  $scope.profile= function() {
    $state.go('tab.profile');
  }
  //===============
  //===============SEARCH RETAILER & DISTRIBUTOR WITH MOBILE NO. MODAL DATA START
  //===============
  // ++++++++++++++++++ modal name +++++++++++++++++++++++ //
  $ionicModal.fromTemplateUrl('templates/search-ret-dis.html', {
    scope: $scope,
    animation: 'zoomIn'
  }).then(function(modal) {
    $scope.searchrtt = modal;
  });
  // ++++++++++++++++++ Open modal +++++++++++++++++++++++ //
  $scope.openrt = function() {
    $scope.searchrtt.show();
  };
  // ++++++++++++++++++ Close modal +++++++++++++++++++++++ //
  $scope.closert = function() {
    $scope.searchrtt.hide();
  };
  
  //===============
  //===============SEARCH RETAILER & DISTRIBUTOR WITH MOBILE NO. MODAL DATA END..........
  //===============
  
  
  //===============
  //===============SEARCH PAYMASTER RETAILER & DISTRIBUTOR MODAL DATA START
  //===============
  // ++++++++++++++++++ modal name +++++++++++++++++++++++ //
  $ionicModal.fromTemplateUrl('templates/search-paymaster.html', {
    scope: $scope,
    animation: 'zoomIn'
  }).then(function(modal) {
    $scope.searchrt = modal;
  });
  // ++++++++++++++++++ Open modal +++++++++++++++++++++++ //
  $scope.opensp = function() {
    $scope.searchrt.show();
  };
  // ++++++++++++++++++ Close modal +++++++++++++++++++++++ //
  $scope.closesp = function() {
    $scope.searchrt.hide();
  };
  
  //===============
  //===============SEARCH RETAILER & DISTRIBUTOR WITH MOBILE NO. MODAL DATA END..........
  //===============
  $scope.segment_names=mySharedService.segment_names;
  $scope.signup_data={};
  $scope.shareallstates=mySharedService.shareallstates;
  $scope.add_lead=function()
  {
    $ionicLoading.show({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    retailerService.get_all_states(1)
    .then(function (result)
    {
      console.log(result);
      $scope.shareallstates=result.data;
      mySharedService.shareallstates=result.data;
      $state.go('become-partner');
      $ionicLoading.hide();
    },function (err) {
      $ionicLoading.hide();
      console.error(err);
    })
    $scope.segment_names=[];
    mySharedService.segment_names=[];
    retailerService.get_segment_names()
    .then(function (result)
    {
      console.log(result);
      console.log(result.length);
      for(i=0;i<result.length;i++)
      {
        console.log(i);
        // $scope.segment_names.push(result[i].segment_name);
        mySharedService.segment_names.push(result[i].segment_name);
      }
      console.log($scope.segment_names);
    },
    function (err) {
      $ionicLoading.hide();
      console.error(err);
    })
  }
  $scope.sharealldistrict=mySharedService.sharealldistrict;
  $scope.shareallshipdistrict=mySharedService.shareallshipdistrict;
  $scope.get_signup_district=function(st,val)
  {
    retailerService.get_all_states(2,st)
    .then(function (result)
    {
      console.log(result);
      if(val==1)
      {
        $scope.sharealldistrict=result.data;
        mySharedService.sharealldistrict=result.data;
      }
      else
      {
        $scope.shareallshipdistrict=result.data;
        mySharedService.shareallshipdistrict=result.data;
      }
    },function (err) {
      $ionicLoading.hide();
      console.error(err);
    })
  }
  $scope.shareallcity=mySharedService.shareallcity;
  $scope.shareallshipcity=mySharedService.shareallshipcity;
  $scope.get_signup_city=function(dt,st,val)
  {
    retailerService.get_all_states(3,dt,st)
    .then(function (result)
    {
      console.log(result);
      if(val==1)
      {
        $scope.shareallcity=result.data;
        mySharedService.shareallcity=result.data;
      }
      else
      {
        $scope.shareallshipcity=result.data;
        mySharedService.shareallshipcity=result.data;
      }
    },function (err) {
      $ionicLoading.hide();
      console.error(err);
    })
  }
  $scope.shareallarea=mySharedService.shareallarea;
  $scope.shareallshiparea=mySharedService.shareallshiparea;
  $scope.get_signup_area=function(city,st,val)
  {
    retailerService.get_all_states(4,city,st)
    .then(function (result)
    {
      console.log(result);
      if(val==1)
      {
        $scope.shareallarea=result.data;
        mySharedService.shareallarea=result.data;
      }
      else
      {
        $scope.shareallshiparea=result.data;
        mySharedService.shareallshiparea=result.data;
      }
    },function (err) {
      $ionicLoading.hide();
      console.error(err);
    })
  }
  
  $scope.get_signup_pincode=function(area,st,val)
  {
    retailerService.get_all_states(5,area,st)
    .then(function (result)
    {
      console.log(result);
      if(val==1)
      {
        $scope.signup_data.pincode=result.data[0].pincode;
      }
      else
      {
        $scope.signup_data.ship_pincode=result.data[0].pincode;
      }
    },function (err) {
      $ionicLoading.hide();
      console.error(err);
    })
  }
  
  $scope.set_signup_area=function(pin,st)
  {
    retailerService.get_all_states(6,pin,st)
    .then(function (result)
    {
      console.log(result);
      $scope.signup_data.area=result.data[0].area;
      // $state.go('become-partner');
    },function (err) {
      $ionicLoading.hide();
      console.error(err);
    })
  }
  
  $scope.lead_toggle_val=1;
  $scope.show_ship=false;
  
  $scope.same_ship_as_bill_add_lead=function(l_tg_val)
  {
    console.log(l_tg_val);
    
    if(l_tg_val==1)
    {
      $scope.show_ship=false;
      
      $scope.shareallshipdistrict=$scope.sharealldistrict;
      $scope.shareallshiparea=$scope.shareallarea;
      $scope.shareallshipcity=$scope.shareallcity;
      
      $scope.signup_data.ship_pincode=$scope.signup_data.pincode;
      $scope.signup_data.ship_street=$scope.signup_data.street;
      $scope.signup_data.ship_district_name=$scope.signup_data.district_name;
      $scope.signup_data.ship_city=$scope.signup_data.city;
      $scope.signup_data.ship_area=$scope.signup_data.area;
      $scope.signup_data.ship_state=$scope.signup_data.state;
      
      $scope.lead_toggle_val=2;
    }
    else
    {
      $scope.show_ship=true;
      
      $scope.lead_toggle_val=1;
      
      $scope.shareallshipdistrict=[];
      $scope.shareallshiparea=[];
      $scope.shareallshipcity=[];
      
      $scope.signup_data.ship_pincode='';
      $scope.signup_data.ship_street='';
      $scope.signup_data.ship_district_name='';
      $scope.signup_data.ship_city='';
      $scope.signup_data.ship_area='';
      $scope.signup_data.ship_state='';
    }
  }
  
  $scope.pageone=true;
  $scope.pagetwo=false;
  $scope.pagethree=false;
  $scope.go_one=function()
  {
    retailerService.check_lead($scope.signup_data)
    .then(function (result)
    {
      if(result.data.message=='success')
      {
        $scope.pageone=false;
        $scope.pagetwo=true;
        $scope.pagethree=false;
        console.log($scope.signup_data);
        $ionicScrollDelegate.scrollTop();
      }
      else if(result.data.message=='Mobile1 Exist')
      {
        var alertPopup = $ionicPopup.alert({
          title: 'Sign-Up Denied!',
          template: 'Mobile Number 1 Already Exists!'
        });
      }
      else if(result.data.message=='Mobile2 Exist')
      {
        var alertPopup = $ionicPopup.alert({
          title: 'Sign-Up Denied!',
          template: 'Mobile Number 2 Already Exists!'
        });
      }
      else if(result.data.message=='Landline Exist')
      {
        var alertPopup = $ionicPopup.alert({
          title: 'Sign-Up Denied!',
          template: 'Landline Number Already Exists!'
        });
      }
      else if(result.data.message=='GST Exist')
      {
        var alertPopup = $ionicPopup.alert({
          title: 'Sign-Up Denied!',
          template: 'GST Number Already Exists!'
        });
      }
      
    },function (err) {
      $ionicLoading.hide();
      console.error(err);
    })
  }
  
  $scope.go_two=function()
  {
    $scope.pageone=false;
    $scope.pagetwo=false;
    $scope.pagethree=true;
    console.log($scope.signup_data);
    $ionicScrollDelegate.scrollTop();
  }
  
  $scope.save_lead=function()
  {
    $ionicLoading.show({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    $scope.signup_data.dob=moment($scope.signup_data.dob).format('YYYY-MM-DD');
    console.log($scope.signup_data);
    retailerService.save_lead($scope.signup_data)
    .then(function (result)
    {
      console.log(result);
      mySharedService.last_dr_id=result.data.id;
      var options = {
        fileKey: "file",
        fileName: "image.jpg",
        chunkedMode: false,
        mimeType: "image/*",
      };
      if($scope.mediaData.length)
      {
        $cordovaFileTransfer.upload(server_url+"/lead_pic.php?id="+mySharedService.last_dr_id, $scope.mediaData[0].src, options).then(function(result) {
          $ionicLoading.hide();
          $scope.mediaData=[];
          console.log("SUCCESS: " + JSON.stringify(result));
        }, function(err) {
          $ionicLoading.hide();
          console.log("ERROR: " + JSON.stringify(err));
        }, function (progress) {
        });
      }
      $state.go('assign-segment');
      $ionicLoading.hide();
      
    },function (err) {
      $ionicLoading.hide();
      console.error(err);
    })
  }
  
  function checkArrProperty(prop, newObj) {
    var result;
    Object.keys(newObj).forEach(function (key) {
      if (newObj[key]["value"] === prop) {
        result = key
      }
    });
    return result;
  }
  
  $scope.filter_data=[];
  $scope.seg_select=[];
  $scope.modifiedOrder=[];
  $scope.format=function(all,index){
    console.log(all);
    console.log(index);
    if(all==true)
    {
      $scope.modifiedOrder=[];
      retailerService.get_segment_names()
      .then(function (result)
      {
        console.log(result);
        console.log(result.length);
        for(i=0;i<result.length;i++)
        {
          $scope.modifiedOrder.push({'value':result[i].segment_name});
        }
        console.log($scope.modifiedOrder);
      },
      function (err) {
        $ionicLoading.hide();
        console.error(err);
      })
      
    }
    else if(all==false)
    {
      $scope.modifiedOrder=[];
    }
    else
    {
      console.log($scope.modifiedOrder);
      console.log(index);
      
      $scope.filter_data=$filter('filter')($scope.modifiedOrder, {value:$scope.segment_names[index]}, true);
      console.log($scope.filter_data);
      if($scope.filter_data.length)
      {
        var ind_value = checkArrProperty($scope.segment_names[index],$scope.modifiedOrder);
        console.log(ind_value);
        if($scope.modifiedOrder[ind_value].value!='')
        {
          $scope.modifiedOrder.splice(ind_value,1);
        }
        else
        {
          $scope.modifiedOrder[ind_value].value=$scope.segment_names[index];
        }
      }
      else
      {
        $scope.modifiedOrder.push({'value':$scope.segment_names[index]});
      }
    }
    console.log($scope.modifiedOrder);
  }
  
  $scope.add_dr_seg=function()
  {
    $ionicLoading.show({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    console.log($scope.modifiedOrder);
    console.log(mySharedService.last_dr_id);
    retailerService.add_dr_seg(mySharedService.last_dr_id,$scope.modifiedOrder)
    .then(function (result)
    {
      console.log(result);
      $ionicLoading.hide();
      mySharedService.sharealltaluk='';
      $state.go('login');
      var alertPopup = $ionicPopup.alert({
        title: 'Sign-Up Completed!',
        template: 'Your Request has been generated!'
      });
    },function (err) {
      $ionicLoading.hide();
      console.error(err);
    })
  }
  
  $scope.upload_url1 = upload_url+'invoice' ;
  $scope.upload_url2 = upload_url+'order_invoice' ;
  
  $scope.go_to_schemelist = function()
  {
    $scope.scheme_list();
    $state.go('tab.scheme_list');
  }
  
  $scope.go_to_status_list = function()
  {
    $scope.invoice_list();
  }
  
  $scope.invoice_details = mySharedService.invoice_detail;
  $scope.invoice_images = mySharedService.invoice_images;
  
  
  $scope.go_to_invoice_detail = function(inv_id)
  {
    $ionicLoading.show({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    
    retailerService.invoice_detail(inv_id).then(function(result)
    {
      console.log(result);
      $scope.invoice_details = result['data']['invoice_detail'];
      $scope.invoice_images = result['data']['invoice_image'];
      mySharedService.invoice_detail = $scope.invoice_details;
      mySharedService.invoice_images = $scope.invoice_images;
      $state.go('tab.scheme_my_status');
      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
    })        
  }
  
  $scope.go_to_add_invoice = function()
  {
    $scope.assign_distributor();
  }
  
  $scope.assign_distr_list = [];
  
  $scope.assign_distr_list =  mySharedService.assign_distributor_list;
  
  $scope.assign_distributor = function()
  {
    $ionicLoading.show({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    
    console.log(mySharedService.company_district);
    
    
    retailerService.assign_distributor($scope.company_district).then(function(result)
    {
      console.log(result);
      $scope.assign_distr_list = result;
      mySharedService.assign_distributor_list = $scope.assign_distr_list;
      $state.go('tab.upload_invoice');
      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
    })
  }
  
  $scope.get_assign_dis_id = function(dis_name)
  {
    for(var i=0; i < $scope.assign_distr_list.length; i++ )
    {
      if($scope.assign_distr_list[i]['dr_name'] == dis_name)
      {  
        $scope.inv_data.dr_id = $scope.assign_distr_list[i]['id'] ; 
      }
    }
  }
  
  
  $scope.submit_invoice = function()
  {

    console.log("order upload");
    if($scope.inv_data.inv_date)
    {
      $scope.inv_data.inv_date = moment($scope.inv_data.inv_date).format('YYYY-MM-DD');
    }
    
    $ionicLoading.show({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    
    retailerService.add_inv($scope.inv_data)
    .then(function (result)
    {
      console.log(result);
      $scope.insert_id = result['data']['id'];
      $scope.upload_inv();
      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
    },function (err) {
      $ionicLoading.hide();
      console.error(err);
    })
    
  }


  $scope.submit_order_invoice = function()
  {

    console.log("order upload");
    if($scope.inv_data.inv_date)
    {
      $scope.inv_data.inv_date = moment($scope.inv_data.inv_date).format('YYYY-MM-DD');
    }
    
    $ionicLoading.show({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    
    retailerService.add_inv($scope.inv_data)
    .then(function (result)
    {
      console.log(result);
      $scope.insert_id = result['data']['id'];
      $scope.upload_order_inv();
      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
    },function (err) {
      $ionicLoading.hide();
      console.error(err);
    })
    
  }
  
  
  
  $scope.camera = function(src)
  {
    if(src == 1 || !$scope.myProfileDetail.dr_image) 
    {
      var val = 'remove-pic';
    } 
    else 
    {
      var val = '';
    }
    
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: "<i class='icon ion-android-image'></i> Take Picture From Gallery"},
        { text: "<i class='icon ion-camera'></i> Open Camera" },
        { text: "<i class='icon ion-android-delete orange-color'></i> Remove Photo", className: val}
      ],
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
      },
      buttonClicked: function(index) {
        //return true;
        
        if(index === 0) { // Manual Button
          $scope.pic(src);
        }
        
        else if(index === 1){
          $scope.takePic(src);
        }
        
        else if(index === 2) {
          $scope.deletePic(src);
        }
        
        return true;
      }
    })
  }
  /*Doc Camera Click Function End*/
  
  $scope.mediaData = [];
  /*Doc & Profile Take Picture Function Start*/
  $scope.takePic = function (src, options) {
    
    var options = {
      quality : 50,
      targetWidth: 500,
      targetHeight: 500,
      saveToPhotoAlbum: false
    };
    
    Camera.getPicture(options).then(function(imageData) {
      
      var options = {
        fileKey: "image",
        fileName: "image.jpg",
        chunkedMode: false,
        mimeType: "image/*"
      };
      
      if(src==3)
      {
        $scope.mediaData = [];
      }
      
      $scope.mediaData.push({
        src: imageData
      });
      
      
      if(src == 2 && $scope.mediaData.length) {
        $scope.profile_update(2);
      }
      
    }, function(err) {
      
    })
  };
  /*Doc Take Picture Function End*/
  
  $scope.pic=function(src)
  {
    cordova.plugins.diagnostic.getCameraAuthorizationStatus({
      successCallback: function(status) {
        
        console.log('1st'+status);
        
        if(status === cordova.plugins.diagnostic.permissionStatus.GRANTED){
          
          $scope.getGallary(src);
          
        } else {
          
          cordova.plugins.diagnostic.requestCameraAuthorization({
            successCallback: function(data_status) {
              
              console.log('2nd'+data_status);
              
              if(data_status != 'DENIED') {
                $scope.getGallary(src);
              }
            },
            errorCallback: function(error){
              console.error(error);
            },
            externalStorage: true
          });
        }
      },
      errorCallback: function(error){
        console.error("The following error occurred: "+error);
      },
      externalStorage: true
    });
  }
  
  /*Doc & Profile Gallary Function Start*/
  // $scope.getGallary = function(src) {
  
  //   if(src == 2 || src== 3) {
  
  //     var options = {
  //       maximumImagesCount: 1, // Max number of selected images, I'm using only one for this example
  //       width: 500,
  //       height: 500,
  //       quality: 50  // Higher is better
  //     };
  
  //   } else  {
  
  //     var options = {
  //       maximumImagesCount: 10, // Max number of selected images, I'm using only one for this example
  //       width: 500,
  //       height: 500,
  //       quality: 50  // Higher is better
  //     };
  //   }
  
  //   $cordovaImagePicker.getPictures(options).then(function (results) {
  
  //     //Loop through acquired images
  
  
  
  //     if(src==3)
  //     {
  //       $scope.mediaData = [];
  //     }
  
  //     for (var i = 0; i < results.length; i++) {
  //       $scope.mediaData.push({
  //         src: results[i]
  //       });
  //       console.log($scope.mediaData);
  //     }
  //     console.log($scope.mediaData);
  
  //     if(src == 2 && $scope.mediaData.length) {
  //       $scope.profile_update(2);
  //     }
  
  //   }, function(error) {
  //     console.log('Error: ' + JSON.stringify(error));    // In case of error
  //   });
  // }
  /*Doc Gallary Function End*/
  
  /* Profile Image Delete Function Start*/
  $scope.deletePic = function(src) {
    
    if(src == 2) {
      $scope.myProfileDetail.dr_image = '';
      $scope.profile_update(1);
    }
  }
  /*Profile Image Delete Function End*/
  
  $scope.delete_img = function(index)
  {
    console.log(index);
    
    $scope.mediaData.splice(index,1);
  }
  
  /*Doc Upload Function Start*/
  
  $scope.upload_inv = function() 
  {
    
    $ionicLoading.show({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    
    console.log($scope.mediaData.length);
    
    if($scope.mediaData.length) {
      var cnt = 0;
      angular.forEach($scope.mediaData, function(val, key) {
        
        var options = {
          fileKey: "file",
          fileName: "image.jpg",
          chunkedMode: false,
          mimeType: "image/*",
        };
        
        // (server_url+"/doc_upload.php?login_id="+login_id+"&title="+$scope.data.title, val.src, options)
        
        $cordovaFileTransfer.upload(server_url+"/invoice_upload.php?login_id="+login_id+"&bill_id="+$scope.insert_id, val.src, options ).then(function(result) {
          
          console.log("SUCCESS: " + JSON.stringify(result));
          
          if($scope.mediaData.length == (cnt+1)) {
            
            console.log('length '+ $scope.mediaData.length);
            console.log('file key '+ (cnt+1));
            
            $scope.data = {};
            $scope.mediaData = [];
            $scope.inv_data = {};
            
            $scope.invoice_list();
            
            $ionicLoading.hide();
            
            $timeout(function () 
            {
              $cordovaToast.show('Document Saved Successfully!', 'short', 'bottom').then(function(success) { },
              function (error) {
              });
            }, 300);
          }
          
          cnt++;
        }, function(err) {
          $ionicLoading.hide();
          console.log("ERROR: " + JSON.stringify(err));
        }, function (progress) {
          
        });
      });
    }
  }


  $scope.upload_order_inv = function() 
  {
    
    $ionicLoading.show({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    
    console.log($scope.mediaData.length);
    
    if($scope.mediaData.length) {
      var cnt = 0;
      angular.forEach($scope.mediaData, function(val, key) {
        
        var options = {
          fileKey: "file",
          fileName: "image.jpg",
          chunkedMode: false,
          mimeType: "image/*",
        };
        
        // (server_url+"/doc_upload.php?login_id="+login_id+"&title="+$scope.data.title, val.src, options)
        console.log(mySharedService.saved_order_id);
        console.log($scope.myDistAllOrderDetail.order_id);
        console.log(server_url+"/order_invoice_upload.php?login_id="+login_id+"order_id="+mySharedService.saved_order_id);
        console.log(val.src);
        console.log(options);
        $cordovaFileTransfer.upload(server_url+"/order_invoice_upload.php?login_id="+login_id+"&order_id="+mySharedService.saved_order_id, val.src,  options ).then(function(result) {
          
          console.log("SUCCESS: " + JSON.stringify(result));
          console.log(mySharedService.saved_order_id);
          console.log($scope.myDistAllOrderDetail.order_id);
          
          if($scope.mediaData.length == (cnt+1)) {
            
            console.log('length '+ $scope.mediaData.length);
            console.log('file key '+ (cnt+1));
            
            $scope.data = {};
            $scope.mediaData = [];
            $scope.inv_data = {};
            
            $scope.order_detail('',mySharedService.saved_order_id);
            
            $ionicLoading.hide();
            
            $timeout(function () 
            {
              $cordovaToast.show('Document Saved Successfully!', 'short', 'bottom').then(function(success) { },
              function (error) {
              });
            }, 300);
          }
          
          cnt++;
        }, function(err) {
          $ionicLoading.hide();
          console.log("ERROR: " + JSON.stringify(err));
        }, function (progress) {
          
        });
      });
    }
  }
  
  
  $scope.scheme_list = function()
  {
    $ionicLoading.show({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    
    retailerService.schemes_list()
    .then(function(result)
    {
      console.log(result);
      $scope.scheme_lists = result; 
      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
    })
  }
  
  $scope.max_price = 0;
  $scope.min_price = 0;
  
  $scope.scheme_detail = mySharedService.schemes_detail;
  $scope.scheme_data = mySharedService.scheme_data;
  $scope.achieved_amount = mySharedService.achieved_amount;
  $scope.max_price = mySharedService.max_value;
  $scope.min_price = mySharedService.min_value;
  
  console.log($scope.max_price);
  console.log($scope.min_price);
  
  $scope.go_to_scheme_detail = function(scheme_id)
  {
    $ionicLoading.show({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    
    retailerService.scheme_detail(scheme_id, $rootScope.company_district)
    .then(function(result)
    {
      console.log(result);
      $scope.scheme_detail = result.scheme_detail;
      $scope.scheme_data = result.scheme_data[0];
      $scope.achieved_amount = result.achieved_amount.achieved_amt;
      mySharedService.achieved_amount = $scope.achieved_amount;
      mySharedService.scheme_data = $scope.scheme_data;
      mySharedService.schemes_detail = $scope.scheme_detail;
      
      mySharedService.max_value = 0;
      mySharedService.min_price=0;
      
      if($scope.scheme_detail.length > 1)
      {      
        for(var i=0; i<$scope.scheme_detail.length; i++)
        {
          if($scope.max_price<parseFloat($scope.scheme_detail[i].amount_from))
          $scope.max_price = parseFloat($scope.scheme_detail[i].amount_from);
          mySharedService.max_value = $scope.max_price;
          $scope.min_price = parseFloat($scope.scheme_detail[i].amount_from);
        }      
        for(var j=0; j<$scope.scheme_detail.length; j++)
        {
          if($scope.min_price>parseFloat($scope.scheme_detail[j].amount_from))
          $scope.min_price = parseFloat($scope.scheme_detail[j].amount_from);
          mySharedService.min_value = $scope.min_price;
        }
      }
      else
      {
        $scope.min_price = $scope.scheme_detail[0].amount_from;
        mySharedService.min_value = $scope.min_price;
      }
      
      $state.go('tab.schemecompletedetail');
      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
    })
  }
  
  $scope.invoice_lists = [];
  
  $scope.invoice_lists = mySharedService.invoice_list;
  console.log($scope.invoice_lists);
  
  $scope.invoice_list = function()
  {
    $ionicLoading.show({
      template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });
    
    retailerService.invoice_list()
    .then(function(result)
    {
      console.log(result);
      mySharedService.invoice_list = result['data'];
      $state.go('tab.status_list');
      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
    })
  }
  
  
  $scope.delete_invoice = function(invoice_id, index)
  {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Delete Item',
      template: 'Are you sure you want to delete this Invoice?',
      cancelText: 'No',
      okText: 'Yes'
    });
    
    confirmPopup.then(function(res) 
    {
      if(res) 
      {
        $ionicLoading.show({
          template: '<span class="icon spin ion-loading-d"></span> Loading...'
        });
        retailerService.delete_invoice(invoice_id)
        .then(function(result)
        {
          console.log(result);
          $scope.invoice_lists.splice(index,1);
          $ionicLoading.hide();
        })
      }
    })
  }
  
  $scope.today_date = new Date();
  
  $scope.maxdate = function()
  {
    $scope.mdate =  new Date(
      $scope.today_date.getFullYear(),
      $scope.today_date.getMonth(),
      $scope.today_date.getDate()
      );
      
      console.log($scope.mdate);
    }
    
    $scope.maxdate();
    
    
    $scope.aa = function(data)
    {
      console.log(data);
      console.log($scope.today_date);
    }
    
  })
  
  .controller('ChatsCtrl', function($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    
    $scope.doTheBack = function() {
      window.history.back();
    };
    
    
    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
      Chats.remove(chat);
    };
  })
  
  .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    
    $scope.doTheBack = function() {
      window.history.back();
    };
    
    $scope.chat = Chats.get($stateParams.chatId);
  })
  
  .controller('AccountCtrl', function($scope) {
    
    $scope.doTheBack = function() {
      window.history.back();
    };
    
    $scope.settings = {
      enableFriends: true
    };
    
  })
  
  
  .controller('ActivityCtrl', function($scope, $rootScope) {
    
    $scope.doTheBack = function() {
      window.history.back();
    };
    
    $rootScope.act=true;
    $rootScope.img=false;
    $rootScope.pop=false;
    $rootScope.ord=false;
    $rootScope.edit=false;
  })
  
  .controller('RETOrderCtrl', function($scope, $rootScope) {
    
    $scope.doTheBack = function() {
      window.history.back();
    };
    
    $rootScope.act=false;
    $rootScope.img=false;
    $rootScope.pop=false;
    $rootScope.ord=true;
    $rootScope.edit=false;
  })
  
  .controller('RADDproCtrl', function($scope, $rootScope) {
    
    $scope.doTheBack = function() {
      window.history.back();
    };
    
    $rootScope.act=false;
    $rootScope.img=false;
    $rootScope.pop=false;
    $rootScope.ord=true;
    $rootScope.edit=false;
  })
  
  .controller('OrderDtCtrl', function($scope, $rootScope) {
    
    $scope.doTheBack = function() {
      window.history.back();
    };
    
    $rootScope.act=false;
    $rootScope.ord=true;
    $rootScope.pop=false;
    $rootScope.img=false;
    $rootScope.edit=false;
  })
  
  
  .controller('ConfirmOrdCtrl', function($scope, $rootScope) {
    
    $scope.doTheBack = function() {
      window.history.back();
    };
    
    $rootScope.act=false;
    $rootScope.ord=true;
    $rootScope.pop=false;
    $rootScope.img=false;
    $rootScope.edit=false;
  })
  
  
  .controller('ImgDocCtrl', function($scope, $rootScope) {
    
    $scope.doTheBack = function() {
      window.history.back();
    };
    
    $rootScope.act=false;
    $rootScope.ord=false;
    $rootScope.pop=false;
    $rootScope.img=true;
    $rootScope.edit=false;
  })
  
  .controller('GalleryCtrl', function($scope, $rootScope) {
    
    $scope.doTheBack = function() {
      window.history.back();
    };
    
    $rootScope.act=false;
    $rootScope.ord=false;
    $rootScope.img=true;
    $rootScope.pop=false;
    $rootScope.edit=false;
  })
  
  .controller('PopCtrl', function($scope, $rootScope) {
    
    $scope.doTheBack = function() {
      window.history.back();
    };
    
    $rootScope.act=false;
    $rootScope.ord=false;
    $rootScope.img=false;
    $rootScope.pop=true;
    $rootScope.edit=false;
  })
  
  
  .controller('ADDPopCtrl', function($scope, $rootScope) {
    
    $scope.doTheBack = function() {
      window.history.back();
    };
    
    $rootScope.act=false;
    $rootScope.ord=false;
    $rootScope.img=false;
    $rootScope.pop=true;
    $rootScope.edit=false;
  })
  
  
  .controller('EditCtrl', function($scope, $rootScope) {
    
    $scope.doTheBack = function() {
      window.history.back();
    };
    
    $rootScope.act=false;
    $rootScope.ord=false;
    $rootScope.img=false;
    $rootScope.pop=false;
    $rootScope.edit=true;
  })
  
  
  .controller('AddpartnerCtrl', function ($scope, $rootScope, $state) {
    
    $scope.doTheBack = function () {
      window.history.back();
    }
    
    $scope.activeButton='1';
  });
  
  
  // controller('loginCtrl', function($scope, Platform) {
  //   Platform.ready(function() {
  //   Hide the status bar
  //   StatusBar.hide();
  // });
  // });
  