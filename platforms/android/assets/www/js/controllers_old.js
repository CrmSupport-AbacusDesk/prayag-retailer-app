angular.module('starter.controllers', ['dcbImgFallback','ngCordova.plugins.nativeStorage'])

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

.controller('DashCtrl', function($scope,$state,$ionicLoading,$ionicPopup,$ionicHistory,$ionicModal,loginService,retailerService,mySharedService,$cordovaSQLite, $ionicActionSheet, Camera, $cordovaImagePicker, $cordovaFileTransfer, $rootScope, $filter, $cordovaToast, $timeout, $cordovaNativeStorage, $cordovaGeolocation) {

    // $scope.$on('$ionicView.loaded', function() {
    //   ionic.Platform.ready( function() {
    //     if(navigator && navigator.splashscreen) navigator.splashscreen.hide();
    //   });
    // });

    $scope.default_segment=[];
    $scope.default_category=[];
    $scope.default_products=[];


    $scope.data = {};
    $rootScope.search_data = {};
    $scope.upload_url = upload_url;

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
  /*Login function end*/
    console.log($scope.default_segment);
    $scope.default_segment=mySharedService.default_segment;
    $scope.default_category=mySharedService.default_category;
    $scope.default_products=mySharedService.default_products;

    if($scope.default_segment.length==0)
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
              mySharedService.default_category.push({'cat_nos':result.data.data1[j].product_category_no,'seg_name':result.data.data1[j].segment_name,'id':result.data.data1[j].id});

            }

            for(k=0;k<result.data.data2.length;k++)
            {
              // $scope.default_products.push({'cat_nos':result.data.data2[k].product_category_no,'seg_name':result.data.data2[k].segment_name,'product':result.data.data2[k].product_name});
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

        $scope.select_all=function(searchkey,pno)
        {
          console.log(searchkey+" "+pno);
        //   retailerService.get_result(searchkey) .then(function (result)
        // {
        //   console.log(result);
        // },
        // function (err) {
        //    console.error(err);
        // })
          console.log(searchkey.length);
          for(i=0;i<mySharedService.default_segment.length;i++)
          {
            if(mySharedService.default_segment[i].seg_name.slice(0,searchkey.length)==searchkey || (mySharedService.default_segment[i].seg_name.slice(0,searchkey.length)).toLowerCase()==searchkey)
            {
              console.log(i);
              $scope.default_segment=[];
              $scope.default_segment.push({'seg_name':mySharedService.default_segment[i].seg_name});
              console.log($scope.default_segment);
            }
          }
          if(searchkey.length==0)
          {
            $scope.default_segment=mySharedService.default_segment; 
          }
          console.log($scope.default_segment);
        }

        // $scope.select_all=function(searchkey,pno)
        // {
        //   for(i=0;i<mySharedService.default_segment.length;i++)
        //   {
        //     if(mySharedService.default_segment[i].seg_name.slice(0,searchkey.length)==searchkey || (mySharedService.default_segment[i].seg_name.slice(0,searchkey.length)).toLowerCase()==searchkey)
        //     {
        //       $scope.default_segment=[];
        //       $scope.default_segment.push({'seg_name':mySharedService.default_segment[i].seg_name});
        //     }
        //   }
        //   if(searchkey.length==0)
        //   {
        //     $scope.default_segment=mySharedService.default_segment; 
        //   }
        // }
    
    $scope.callMe=function(val)
    {
      console.log("HELLO "+val);
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
    $scope.distributor_list= function ()
    {
         $ionicLoading.show({
          template: '<span class="icon spin ion-loading-d"></span> Loading...'
         });

            retailerService.distributor_list()
            .then(function (result)
            {
                // console.clear();
                console.log(result.data);
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

          if(src == 1) {
            var val = 'remove-pic';
          } else {
            var val = '';
          }

          // Show the action sheet
          var hideSheet = $ionicActionSheet.show({
            buttons: [
              { text: "<i class='icon ion-android-image'></i> Take Picture From Gallery"},
            { text: "<i class='icon ion-camera'></i> Open Camera" },
            { text: "<i class='icon ion-android-delete orange'></i> Remove Photo", className: val}
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
              quality : 70,
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

          if(src == 2) {

              var options = {
               maximumImagesCount: 1, // Max number of selected images, I'm using only one for this example
               width: 500,
               height: 500,
               quality: 70  // Higher is better
              };

         } else  {

             var options = {
               maximumImagesCount: 10, // Max number of selected images, I'm using only one for this example
               width: 500,
               height: 500,
               quality: 70  // Higher is better
             };
         }

         $cordovaImagePicker.getPictures(options).then(function (results) {

            //Loop through acquired images
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
                        $scope.doc_add_list();

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
            }

            $ionicLoading.hide();

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
    console.log($scope.myDistAllOrderDetail);
    $scope.order_detail = function (dist_id, order_id)
    {
        $ionicLoading.show
        ({
            template: '<span class="icon spin ion-loading-d"></span> Loading...'
        });

        retailerService.order_detail(dist_id, order_id)
        .then(function (result)
        {
            console.log(result);
            $scope.myDistAllOrderDetail = result.data.data;
            mySharedService.shareDistAllOrderDetail = result.data.data;
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


  /*Retailer Add Order function start*/
  $scope.product_segment=mySharedService.shareProductsdata;
  $scope.add_product_ret = function(val)
  {
      $rootScope.cache_val=false;
      retailerService.fetch_prod_det_ret(val)
      .then(function (result)
      {
         mySharedService.shareProductsdata = result;
         $scope.product_segment=result;
         console.log($scope.product_segment);

          $ionicHistory.clearCache().then(function () {
             $state.go('tab.addorder');
          });

      }, function (err) {
         $ionicLoading.hide();
         console.error(err);
      })
  }
  /*Retailer Add Order function End*/

   $scope.product_cat_data={};
   $scope.product_data={};
   $scope.dist_array=[];
   $scope.gst_array=[];
   $scope.prod_feature={};
   $scope.segment_comb_array=[];
   $scope.data.disc_val=[];
   $scope.data.selectedValue4;
   $scope.data.selectedValue5;
   $scope.pass_seg_name;
   $scope.pass_prod_cat_val;
   $scope.prod_state_price=[];


   /*Retailer Add Order Category function Start*/
   $scope.product_cat_data= mySharedService.shareProductsCatdata;
   $scope.prod_feature= mySharedService.shareProdFeaturedata;


   $scope.get_cat_no = function(id, seg_name,valn,search_var)
   {
    console.log("GET CAT NO");
      $timeout(function () {

      $ionicLoading.show
      ({
          template: '<span class="icon spin ion-loading-d"></span> Loading...'
      });

     if(valn == 2)
     {
        $scope.data.selectedValue5=null;
        console.log($scope.data.selectedValue4);
        $scope.pass_seg_name=$scope.data.selectedValue4;

        $scope.product_data=[];
        $scope.prod_feature=[];
        $scope.prod_state_price=[];

        retailerService.fetch_prod_cat_det_ret($scope.data.selectedValue4,valn).then(function (result)  {
          console.log(result);

          mySharedService.shareProductsCatdata = result.data;
          $scope.product_cat_data=result.data;
          mySharedService.shareDistributordata = result.distributor_data;

          $scope.data.segment_name = {id: id, segment_name: $scope.data.selectedValue4} ;

          if($scope.dist_array.length)  {

              console.log($scope.dist_array);
              for(i=0;i<$scope.dist_array.length;i++)
              {
                  if($scope.dist_array[i].segment_name == $scope.data.selectedValue4) {

                       console.log("IF");
                       break;

                  }  else {

                      console.log("ELSE");
                      console.log($scope.seg_amt);

                      if($scope.seg_amt.length==0) {

                        console.log("IIF");
                        $scope.dist_array=[];
                        console.log($scope.dist_array);
                        $scope.dist_array.push({ segment_name: $scope.data.selectedValue4, distributors: result.distributor_data});

                      } else {

                        console.log("EEL");
                        $scope.dist_array.push({ segment_name: $scope.data.selectedValue4, distributors: result.distributor_data});
                      }
                      break;
                  }
              }

          } else {

            $scope.dist_array.push({ segment_name: $scope.data.selectedValue4, distributors: result.distributor_data});
          }

        if(result.disc_data.length)
        {
          for(i=0;i<result.disc_data.length;i++)
          {
            if(result.disc_data[i].segment_name)
            {
              $scope.data.disc_val[result.disc_data[i].segment_name]=result.disc_data[i].retailer;
            }
            else
            {
              $scope.data.disc_val[result.disc_data[i].segment_name]=0;
            }
          }
        }

          console.log($scope.dist_array);
          // console.log($scope.gst_array);
          $ionicLoading.hide();

      },function (err) {
         $ionicLoading.hide();
         console.error(err);
      })
   }

   if(valn == 3)
   {
      $scope.pass_prod_cat_val=$scope.data.selectedValue5;
      console.log($scope.data.selectedValue5);
      retailerService.fetch_prod_cat_det_ret($scope.data.selectedValue5, valn, search_var)
      .then(function (result)
      {
         console.log(result.data);
         if(search_var=='1')
         {
            $scope.data.selectedValue4=result.data[0].segment_name;
            $scope.pass_seg_name=result.data[0].segment_name;
            $scope.data.segment_name={id: id, segment_name: result.data[0].segment_name};
            $scope.data.cat_val= {id: id, product_category_no: result.data[0].product_category_no};

            $scope.product_cat_data=result.data;
            console.log( $scope.product_cat_data);
            console.log($scope.data.segment_name);
            console.log($scope.data.cat_val);
            console.log(result);

              if($scope.dist_array.length)  {

                  console.log($scope.dist_array);
                  for(i=0;i<$scope.dist_array.length;i++)
                  {
                      if($scope.dist_array[i].segment_name == result.data[0].segment_name) {

                           console.log("IF");
                           break;

                      }  else {

                          console.log("ELSE");
                          console.log($scope.seg_amt);

                          if($scope.seg_amt.length==0) {

                            console.log("IIF");
                            $scope.dist_array=[];
                            console.log($scope.dist_array);
                            $scope.dist_array.push({ segment_name: result.data[0].segment_name, distributors: result.distributor_data});

                          } else {

                            console.log("EEL");
                            $scope.dist_array.push({ segment_name: result.data[0].segment_name, distributors: result.distributor_data});
                          }
                          break;
                      }
                  }

              } else {

                $scope.dist_array.push({ segment_name: result.data[0].segment_name, distributors: result.distributor_data});
              }

            //   mySharedService.shareGstdata = result.gst_data;
            //
            //   if($scope.gst_array.length) {
            //
            //       for(i=0;i<$scope.gst_array.length;i++)
            //       {
            //           if($scope.gst_array[i].segment_name == result.data[0].segment_name)
            //           {
            //           //    $scope.dist_array[i].distributors= result.distributor_data;
            //               break;
            //           }
            //           else
            //           {
            //             $scope.gst_array.push({ segment_name: result.data[0].segment_name, gst: result.gst_data});
            //             break;
            //             // $scope.dist_array=result.distributor_data;
            //           }
            //       }
            //
            // } else {
            //
            //   $scope.gst_array.push({ segment_name: result.data[0].segment_name, gst: result.gst_data});
            // }

            if(result.disc_data.length)
            {
              for(i=0;i<result.disc_data.length;i++)
              {
                if(result.disc_data[i].segment_name)
                {
                    $scope.data.disc_val[result.disc_data[i].segment_name]=result.disc_data[i].retailer;
                }
                else
                {
                  $scope.data.disc_val[result.disc_data[i].segment_name]=0;
                }
              }
            }

         }

         mySharedService.shareProductsNamedata = result.data;
         $scope.product_data=result.data;
         $scope.prod_feature=result.data_feat;
         $scope.prod_state_price=result.prod_state_price;
        console.log($scope.prod_state_price);

         console.log($scope.dist_array);
         console.log(result);
         $ionicLoading.hide();
      }, function (err) {
         $ionicLoading.hide();
         console.error(err);
      })
    }
   }, 500);
  }
  /*Retailer Add Order Category function End*/

  /*Retailer Add Order Cart function Start*/
  $scope.price_val_chg=[];
  $scope.cart_arr=[];
  $scope.seg_amt=[];
  $scope.addtocart = function(qnty,product_name,product_amount)
  {
      console.log($scope.pass_seg_name);
      console.log($scope.pass_prod_cat_val);
      cat_no=$scope.pass_prod_cat_val;
      segment_name=$scope.pass_seg_name;
      $scope.data.prod_qty=1;
      console.log($scope.retailer_id);
      console.log(segment_name + cat_no + qnty + product_name + product_amount);
      if($scope.cart_arr.length)
      {
        for(i=0;i<$scope.cart_arr.length;i++)
        {
          if($scope.cart_arr[i].catg_no == cat_no)
          {
            $scope.cart_arr[i].quantity = (parseFloat($scope.cart_arr[i].quantity) + parseFloat(qnty));
            break;
          }
          else
          {
            if(i == $scope.cart_arr.length-1)
            {
              console.log("El IF");
              $scope.cart_arr.push({ segment_name: segment_name, catg_no: cat_no, quantity: parseFloat(qnty).toFixed(2), product_name: product_name, amount: parseFloat(product_amount).toFixed(2)});
              break;
            }
          }
        }
      }
      else
      {
        $scope.cart_arr.push({ segment_name: segment_name, catg_no: cat_no, quantity: parseFloat(qnty).toFixed(2), product_name: product_name, amount: parseFloat(product_amount).toFixed(2)});
      }
      console.log($scope.cart_arr);


      if($scope.seg_amt.length)
      {
        for(i=0;i<$scope.seg_amt.length;i++)
        {
          console.log($scope.seg_amt[i].segment_name + segment_name);
          if($scope.seg_amt[i].segment_name == segment_name)
          {
            $scope.seg_amt[i].price = (parseFloat($scope.seg_amt[i].price)+parseFloat(product_amount)*parseFloat(qnty)).toFixed(2);
            break;
          }
          else
            {
              if(i == $scope.seg_amt.length-1)
              {
                $scope.seg_amt.push({segment_name: segment_name, price:(parseFloat(product_amount)*parseFloat(qnty)).toFixed(2)});
                break;
              }
            }
        }
      }
      else
      {
        $scope.seg_amt.push({segment_name: segment_name, price:(parseFloat(product_amount)*parseFloat(qnty)).toFixed(2)});
      }

      if($scope.price_val_chg.length)
      {
        for(i=0;i<$scope.price_val_chg.length;i++)
        {
          if($scope.price_val_chg[i].seg_name == segment_name)
          {
            $scope.price_val_chg[i].price_val = (parseFloat($scope.price_val_chg[i].price_val)+parseFloat(product_amount)*parseFloat(qnty)).toFixed(2);
            break;
          }
          else
          {
            if(i == $scope.price_val_chg.length-1)
            {
              $scope.price_val_chg.push({seg_name: segment_name, price_val:(parseFloat(product_amount)*parseFloat(qnty)).toFixed(2)});
              break;
            }
          }
        }
      }
      else
      {
        $scope.price_val_chg.push({seg_name: segment_name, price_val:(parseFloat(product_amount)*parseFloat(qnty)).toFixed(2)});
      }

      console.log($scope.seg_amt);
      console.log($scope.price_val_chg);

      var seg_len= $scope.seg_amt.length;
      console.log(seg_len);

      if($scope.segment_comb_array.length!=seg_len)
      {
        $scope.valid=false;
      }
      else
      {
        $scope.valid=true;
      }


      $scope.product_segment=[];
      $scope.product_cat_data=[];
      $scope.product_data=[];
      $scope.prod_feature=[];
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
        console.log($scope.cart_arr);
        console.log($scope.seg_amt);
        console.log($scope.segment_comb_array);
        console.log($scope.dist_array);
        console.log($scope.price_val_chg);
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
        if($scope.seg_amt.length)
        {
          for(i=0;i<$scope.seg_amt.length;i++)
          {
            if($scope.seg_amt[i].segment_name == $scope.cart_arr[index].segment_name)
            {
              $scope.seg_amt[i].price = (parseFloat($scope.seg_amt[i].price)-parseFloat($scope.cart_arr[index].amount)*parseFloat($scope.cart_arr[index].quantity)).toFixed(2);
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

             for(i=0;i<$scope.seg_amt.length;i++)
             {
              if($scope.seg_amt[i].segment_name==$scope.cart_arr[index].segment_name)
              {
               $scope.seg_amt.splice(index,1);
              }
             }
           }

             $scope.cart_arr.splice(index,1);

          // for(i=0;i<$scope.seg_amt.length;i++)
          // {
          //    cnt = findOccurrences($scope.cart_arr, $scope.seg_amt[i].segment_name);

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
          $scope.dist_array.splice(index,1);
          $scope.price_val_chg.splice(index,1);
        
        console.log($scope.cart_arr);
        console.log($scope.seg_amt);
        console.log($scope.dist_array);
        console.log($scope.segment_comb_array);

        var seg_len= $scope.seg_amt.length;
        console.log(seg_len);

        if(seg_len==0)
        {
          $scope.valid=false;
        }

        for(i=0;i<seg_len;i++)
        {
          if($scope.segment_comb_array[i].dist==undefined)
          {
            $scope.valid=false;
          }
          else
          {
            if(i==seg_len-1)
            {
              $scope.valid=true;
            }
          }
        }

      } else {
        console.log('You are not sure');
      }
     });

  }
  /*Retailer Add Order Cart Delete function End*/


  /*Retailer Add Order Combo Segment function Start*/
  $scope.order_det=[];
  $scope.tot_order_det=[];

  $scope.seg_price_disc=0;
  $scope.valid=false;
  $scope.push_details=function(seg_name,seg_price,discount,distributor,dist_img,dist_id,typee)
  {
    console.log(seg_name + seg_price + discount + distributor);
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

    var seg_len= $scope.seg_amt.length;
        console.log(seg_len);
        for(i=0;i<seg_len;i++)
        {
          if($scope.segment_comb_array[i].dist==undefined)
          {
            $scope.valid=false;
            break;
          }
          else
          {
            if(i==seg_len-1)
            {
              $scope.valid=true;
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

  $scope.fetch_all=function()
  {
    $scope.tot_order_det=[];
    $scope.new_gst_arr=[];

    $ionicLoading.show
    ({
        template: '<span class="icon spin ion-loading-d"></span> Loading...'
    });

      for(i=0;i<$scope.seg_amt.length;i++)
      {
        $scope.seg_price_discount= (parseFloat($scope.seg_amt[i].price) - (parseFloat($scope.seg_amt[i].price)*parseFloat($scope.data.disc_val[$scope.seg_amt[i].segment_name]))/100).toFixed(2);

          var exists = checkProperty($scope.data.dist_name[$scope.seg_amt[i].segment_name].dr_name, $scope.tot_order_det);
                console.log(typeof(exists));
              if ($scope.tot_order_det.length == 0 || !exists)
                {
                   $scope.tot_order_det.push({seg_name: $scope.seg_amt[i].segment_name, segment_price_mrp: parseFloat($scope.seg_amt[i].price).toFixed(2), seg_price_disc:parseFloat($scope.seg_price_discount).toFixed(2), disc: parseFloat($scope.data.disc_val[$scope.seg_amt[i].segment_name]).toFixed(2), dist: $scope.data.dist_name[$scope.seg_amt[i].segment_name].dr_name, distr_img: $scope.data.dist_name[$scope.seg_amt[i].segment_name].dr_image, dist_id: $scope.data.dist_name[$scope.seg_amt[i].segment_name].id, gst: 18, after_gst_amt: 0, gst_amt: 0});
                }
              else {
                $scope.tot_order_det[exists].dist =  $scope.data.dist_name[$scope.seg_amt[i].segment_name].dr_name;
                $scope.tot_order_det[exists].seg_name = $scope.seg_amt[i].segment_name;
                $scope.tot_order_det[exists].segment_price_mrp = (parseFloat($scope.tot_order_det[exists].segment_price_mrp) + parseFloat($scope.seg_amt[i].price)).toFixed(2);
                $scope.tot_order_det[exists].seg_price_disc = (parseFloat($scope.tot_order_det[exists].seg_price_disc) + parseFloat($scope.seg_price_disc)).toFixed(2);
                $scope.tot_order_det[exists].disc = (parseFloat($scope.tot_order_det[exists].disc) + parseFloat($scope.data.disc_val[$scope.seg_amt[i].segment_name])).toFixed(2);
                $scope.tot_order_det[exists].distr_img = $scope.data.dist_name[$scope.seg_amt[i].segment_name].dr_image;
                $scope.tot_order_det[exists].dist_id = $scope.data.dist_name[$scope.seg_amt[i].segment_name].id;
              }
      }



    if($scope.segment_comb_array.length)
    {
      $scope.total_order_val=0;
      for(i=0;i<$scope.segment_comb_array.length;i++)
      {
        if($scope.segment_comb_array[i].seg_name==$scope.price_val_chg[i].seg_name && parseFloat($scope.segment_comb_array[i].segment_price_mrp).toFixed(2) != parseFloat($scope.price_val_chg[i].price_val).toFixed(2))
        {
          $scope.segment_comb_array[i].segment_price_mrp=parseFloat($scope.price_val_chg[i].price_val).toFixed(2);
          $scope.chg_val=(parseFloat($scope.price_val_chg[i].price_val)-(parseFloat($scope.segment_comb_array[i].disc)*parseFloat($scope.price_val_chg[i].price_val))/100).toFixed(2);
          $scope.segment_comb_array[i].seg_price_disc=parseFloat($scope.chg_val).toFixed(2);
        }
        $scope.segment_comb_array[i].gst_amt= ((parseFloat($scope.segment_comb_array[i].gst)*parseFloat($scope.segment_comb_array[i].seg_price_disc))/100).toFixed(2);

        $scope.segment_comb_array[i].after_gst_amt= (parseFloat($scope.segment_comb_array[i].seg_price_disc) + (parseFloat($scope.segment_comb_array[i].gst)*parseFloat($scope.segment_comb_array[i].seg_price_disc))/100).toFixed(2);
        $scope.total_order_val=(parseFloat($scope.total_order_val)+parseFloat($scope.segment_comb_array[i].after_gst_amt)).toFixed(2);
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
	    // for(i=0;i<$scope.tot_order_det.length;i++)
     //    {
     //      $scope.tot_order_det[i].seg_price_disc=Math.round($scope.tot_order_det[i].seg_price_disc);
     //      $scope.tot_order_det[i].after_gst_amt=Math.round($scope.tot_order_det[i].after_gst_amt);
     //      $scope.tot_order_det[i].gst_amt=Math.round($scope.tot_order_det[i].gst_amt);
     //    }

     //  for(i=0;i<$scope.segment_comb_array.length;i++)
     //    {
     //      $scope.segment_comb_array[i].seg_price_disc=Math.round($scope.segment_comb_array[i].seg_price_disc);
     //      $scope.segment_comb_array[i].after_gst_amt=Math.round($scope.segment_comb_array[i].after_gst_amt);
     //      $scope.segment_comb_array[i].gst_amt=Math.round($scope.segment_comb_array[i].gst_amt);
     //    }
    }

        console.log($scope.tot_order_det);
    console.log($scope.segment_comb_array);

    retailerService.insert_in_order($scope.cart_arr,$scope.segment_comb_array,$scope.total_order_val_final,$scope.tot_order_det)
    .then(function (result)
    {
      $scope.oid=result.data.data;
      mySharedService.shareLastOIDdata = result.data.data;
      mySharedService.shareDistListdata = $scope.segment_comb_array;
      mySharedService.shareOrdDistListdata = $scope.tot_order_det;
      $scope.distr_arr=$scope.segment_comb_array;
      $scope.order_lst=$scope.tot_order_det;
       $ionicLoading.hide();
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

  $scope.confirm_order=function(payment_type)
  {
        // $scope.distr_arr=[];
        $scope.segment_comb_array=[];
        $scope.gst_array=[];
        $scope.dist_array=[];
        $scope.seg_amt=[];
        $scope.seg_det=[];
        $scope.cart_arr=[];
        $scope.price_val_chg=[];
        console.log($scope.order_lst);

        if($scope.payment_mode=='Neft')
        {
          $scope.order_cno=[];
        }

        if($scope.payment_mode=='Cheque')
        {
          $scope.order_ref=[];
        }

         if($scope.next_followup_date.length)
        {
            for(i=0;i<$scope.next_followup_date.length;i++)
            {
              $scope.next_followup_dt[i]=moment($scope.next_followup_date[i]).format('YYYY-MM-DD');
            }
        }

        for(i=0;i<$scope.payment_type.length;i++)
        {
          if($scope.payment_type[i]=='Advance')
          {

            $scope.new_type_id_arr.push($scope.order_lst[i].dist_id);
            $scope.new_pay_type_arr.push($scope.payment_type[i]);
            $scope.new_pay_mode_arr.push($scope.payment_mode[i]);
            $scope.new_amt_arr.push($scope.order_amt[i]);
            $scope.new_ref_arr.push($scope.order_ref[i]);
            $scope.new_cno_arr.push($scope.order_cno[i]);
          }
          else
          {  
            $scope.new_credit_type_id_arr.push($scope.order_lst[i].dist_id);
            $scope.credit_arr.push($scope.payment_type[i]);
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
        retailerService.update_in_order($scope.oid,$scope.credit_date,$scope.new_pay_type_arr,$scope.new_pay_mode_arr,$scope.orderDate,$scope.new_type_id_arr,$scope.new_amt_arr,$scope.new_ref_arr,$scope.new_cno_arr,$scope.credit_arr,$scope.new_credit_type_id_arr)
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

   /*Retailer's Profile Detail start*/
    $scope.myProfileDetail = mySharedService.shareProfileDetail;
    $scope.mysegments=[];
    $scope.mysegments=mySharedService.mysegments;
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
          // result.data.date_birth=moment(result.data.date_birth).format('dd-MMM-y');
          $scope.myProfileDetail=result.data.data;
          mySharedService.shareProfileDetail = result.data.data;
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
               $scope.profile_detail();

          }, function(err) {
               $ionicLoading.hide();
               console.log("ERROR: " + JSON.stringify(err));
          }, function (progress) {

          });

      }
   }
   /*Retailer's Profile Update End*/

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
          $scope.last_gps_add=result.data.gps_address;
          mySharedService.last_gps=result.data.gps_address;

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
          }, function(error){
            console.log("Could not get location");
          });

        },function (err) {
             console.error(err);
          })
  }

   $scope.add_loc=function()
      {
        console.log(locat+" "+$('#latitude').val()+" "+$('#longitude').val());
        retailerService.add_loc(locat,$('#latitude').val(),$('#longitude').val())
        .then(function (result)
        {
          $scope.profile_detail();
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
