angular.module('starter.services', [])

.service('loginService',function($q, $http,$state)
{
    
    return {
        
        /*login function  start*/
        login: function(username, password)
        {
            
            var deferred = $q.defer();
            var promise = deferred.promise;
            
            $http.post(server_url+"/login.php",
            {
                'username':username,
                'password':password,
            })
            .then(function (response) {
                
                console.log(response);
                if (response.data.id) {
                    console.log("User 1st login successful: " + JSON.stringify(response.data));
                    deferred.resolve(response);
                } else {
                    console.log("User 1st login failed: Wrong Username And Password !");
                    deferred.reject(response);
                }
            }, function (error) {
                console.log("Server Error on 1st login: " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        }
        /* login function  end*/
        
    }
    
})


.service('retailerService',function($q, $http,$state)
{
    
    return {
        
        /*Default Segment list start*/
        default_segment: function()
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            
            $http.post(server_url+"/get_all_segment.php", {
                'login_id':login_id
                
            }).then(function (response)  {
                console.log(response);
                deferred.resolve(response);
            }, function (error) {
                console.log("Server Error : " + JSON.stringify(error));
                deferred.reject(error);
            });
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },


        orpPostServiceRequest: function(url,data)
        {
            // console.log(data);
            
           
            
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.post(root_url+url,JSON.stringify({
                data
            }),{timeout:15000})
            .then(function (response) {
                
                console.log(response);
                deferred.resolve(response.data);
            }, function (error) {
                console.log("Server Error on response: " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        
        /*Default Segment list end*/
        
        /*Distributor list start*/
        distributor_list: function(company_district)
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            
            $http.post(server_url+"/get_distributor_list.php", {
                
                'login_id':login_id,
                'company_district':company_district
                
            }).then(function (response)  {
                console.log(response);
                deferred.resolve(response);
            }, function (error) {
                console.log("Server Error : " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        
        /*Distributor list of distributor function end*/
        
        /*Distributor Detail start*/
        dist_detail: function(dist_id)
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            
            $http.post(server_url+"/get_dist_detail.php", {
                
                'dist_id':dist_id,
            })
            .then(function (response) {
                
                deferred.resolve(response);
                
            }, function (error) {
                
                console.log("Server Error : " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /*Distributor Detail end*/
        
        
        /*Retailer All Payment start*/
        payment_all_list: function()
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            
            $http.post(server_url+"/get_payment_all_list.php", {
                'login_id':login_id,
            })
            .then(function (response) {
                
                deferred.resolve(response);
                
            }, function (error) {
                
                console.log("Server Error : " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /*Retailer All Payment End*/
        
        /* Payment of Retailer's Distributor start*/
        payment_dist_list: function(dist_id)
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.post(server_url+"/get_payment_dist_list.php",
            {
                'login_id':login_id,
                'dist_id':dist_id
                
            }).then(function (response) {
                console.log(response);
                deferred.resolve(response);
                
            }, function (error) {
                console.log("Server Error on response: " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /* Payment of Retailer's Distributor end*/
        
        /*Retailer pop and gift list start*/
        gift_update_list: function(gift_id)
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            
            $http.post(server_url+"/get_gift_update_list.php", {
                
                'login_id':login_id,
                'gift_id' : gift_id
                
            }).then(function (response)  {
                
                deferred.resolve(response);
                
            }, function (error) {
                console.log("Server Error : " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /*Retailer pop and gift list End*/
        
        /*Retailer pop and gift Update start*/
        dr_gift_update: function()
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            
            $http.post(server_url+"/get_pop_gift_list.php", {
                
                'login_id':login_id
                
            }).then(function (response)  {
                
                deferred.resolve(response);
                
            }, function (error) {
                console.log("Server Error : " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /*Retailer pop and gift Update End*/
        
        /*Retailer Doc Add service start*/
        doc_add_list: function()
        {    
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.post(server_url+"/get_doc_add_list.php",
            {
                'login_id':login_id,
                
            }).then(function (response) {
                console.log(response);
                deferred.resolve(response);
                
            }, function (error) {
                console.log("Server Error on response: " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /*Retailer Doc Add service End*/
        
        /* Retailer Doc Add of service start */
        doc_add_gallary_list: function(document_title)
        {    
            var deferred = $q.defer();
            var promise = deferred.promise;
            
            $http.post(server_url+"/doc_add_gallary_list.php",
            {
                'login_id':login_id,
                'document_title':document_title
                
            }).then(function (response) {
                
                deferred.resolve(response);
                
            }, function (error) {
                
                console.log("Server Error on response: " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /* Retailer Doc Add of service End*/
        
        /*Retailer's Distributor Order Listing function start*/
        order_list: function(dist_id)
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.post(server_url+"/get_order_list.php",
            {
                'login_id':login_id,
                'dist_id':dist_id
                
            }).then(function (response) {
                console.log(response);
                deferred.resolve(response);
            }, function (error) {
                console.log("Server Error on response: " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /*Retailer's Distributor Order Listing function End*/
        
        /*Retailer's Distributor Order Detail function start*/
        order_detail: function(dist_id, order_id)
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.post(server_url+"/get_order_detail.php",
            {
                'login_id':login_id,
                'dist_id':dist_id,
                'order_id':order_id
                
            }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                console.log("Server Error on response: " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /*Retailer's Distributor Order Detail function End*/
        
        /*Retailer Order Segment Detail start*/
        fetch_prod_det_ret: function(val)
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.post(server_url+"/get_product_details.php",
            {
                'val':val,
                'login_id':login_id,
                
            }).then(function (response) {
                console.log(response);
                deferred.resolve(response.data);
                
            }, function (error) {
                
                console.log("Server Error on response: " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
        /*Retailer Order Segment Detail end*/
        
        /*Retailer Order Cat Detail start*/
        fetch_prod_cat_det_ret: function(seg,val,seg_name)
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.post(server_url+"/get_product_details.php",
            {
                'login_id':login_id,
                'seg':seg,
                'seg_name':seg_name,
                'val':val,
                'state':state_name
                
                
            }).then(function (response) {
                console.log(response);
                deferred.resolve(response.data);
                
            }, function (error) {
                
                console.log("Server Error on response: " + JSON.stringify(error));
                deferred.reject(error);
                
            });
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
        /*Retailer Order Cat Detail End*/
        
        /*Insert Into Order,Order_Item,Segment Delivery function start*/
        insert_in_order: function(json_arr,seg_order_det,total_order,tot_order_det,value,oid)
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.post(server_url+"/insert_in_order.php",
            {
                'login_id':login_id,
                'json':json_arr,
                'order_seg':seg_order_det,
                'total_order':total_order,
                'tot_ord_child':tot_order_det,
                'val':value,
                'oid':oid
                
            }).then(function (response) {
                console.log(response);
                deferred.resolve(response);
            }, function (error) {
                console.log("Server Error on response: " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        
        /*Insert Into Order,Order_Item,Segment Delivery function end*/
        
        /*Update Into Add Order Process 1 to 0 function start*/
        update_in_order: function(oid,next_followup,payment_type,payment_mode,orderdate,payee,amt,refno,ch_no,credit_type,credit_type_id,s_val)
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.post(server_url+"/update_in_order.php",
            {
                'oid':oid,
                'next_followup':next_followup,
                'payment_type':payment_type,
                'payment_mode':payment_mode,
                'orderdate':orderdate,
                'created_by':login_id,
                'dr_id':login_id,
                'type_id_name':payee,
                'amount':amt,
                'ref':refno,
                'ch_no':ch_no,
                'credit_type':credit_type,
                'credit_type_id':credit_type_id,
                's_val':s_val
                
            }).then(function (response) {
                console.log(response);
                deferred.resolve(response);
            }, function (error) {
                console.log("Server Error on response: " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /*Update Into Add Order Process 1 to 0 function End*/
        
        /*Search In Order function start*/
        
        get_search: function(s_val)
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.post(server_url+"/get_ret_order_search.php",
            {
                'search_val':s_val
                
            }).then(function (response) {
                console.log(response);
                deferred.resolve(response.data);
            }, function (error) {
                console.log("Server Error on response: " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        
        /*Search In Order function end*/
        
        
        /*Search for Segment/Category function start*/
        get_search_res_val: function(value)
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.post(server_url+"/get_ret_order_search_val.php",
            {
                'value':value
                
            }).then(function (response) {
                console.log(response);
                deferred.resolve(response);
            }, function (error) {
                console.log("Server Error on response: " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /*Search for Segment/Category function end*/
        
        /*Retailer's Notice list start*/
        notice_list: function()
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            
            $http.post(server_url+"/get_notice_list.php", {
                
                'login_id':login_id
                
            }).then(function (response)  {
                
                deferred.resolve(response);
                
            }, function (error) {
                
                console.log("Server Error : " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /*Retailer's Notice list End*/
        
        /*Notice Detail function Start*/
        notice_detail: function(id)
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            
            $http.post(server_url+"/get_notice_detail.php", {
                
                'id':id,
                'login_id':login_id
                
            }).then(function (response)  {
                
                deferred.resolve(response);
                
            }, function (error) {
                
                console.log("Server Error : " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /*Notice Detail function End*/
        
        /*Retailer's Profile Detail start*/
        profile_detail: function()
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            
            $http.post(server_url+"/get_profile_detail.php", {
                
                'login_id':login_id
                
            }).then(function (response)  {
                
                deferred.resolve(response);
                
            }, function (error) {
                
                console.log("Server Error : " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /*Retailer's Profile Detail End*/
        
        /*Save Company Detail start*/
        save_comp_info: function(val)
        {
            console.log(val);
            var deferred = $q.defer();
            var promise = deferred.promise;
            
            $http.post(server_url+"/save_profile_detail.php", {
                
                'login_id':login_id,
                'counter':val.dr_name,
                'email':val.email,
                'gst':val.gst_no,
                'landline':val.landline_no,
                'type':'1'
                
            }).then(function (response)  {
                
                deferred.resolve(response);
                
            }, function (error) {
                
                console.log("Server Error : " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /*Save Company Detail End*/
        
        /*Save Personal Detail start*/
        save_pers_info: function(val,date_birth)
        {
            console.log(val);
            var deferred = $q.defer();
            var promise = deferred.promise;
            
            $http.post(server_url+"/save_profile_detail.php", {
                
                'login_id':login_id,
                'contact_person':val.contact_person,
                'date_birth':date_birth,
                'contact_1':val.contact_1,
                'contact_2':val.contact_2,
                'type':'2'
                
            }).then(function (response)  {
                
                deferred.resolve(response);
                
            }, function (error) {
                
                console.log("Server Error : " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /*Save Personal Detail End*/
        
        /*Save Login Detail start*/
        save_login_info: function(val)
        {
            console.log(val);
            var deferred = $q.defer();
            var promise = deferred.promise;
            
            $http.post(server_url+"/save_profile_detail.php", {
                
                'login_id':login_id,
                // 'username':val.username,
                'password':val.password,
                'type':'3'
                
            }).then(function (response)  {
                
                deferred.resolve(response);
                
            }, function (error) {
                
                console.log("Server Error : " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /*Save Company Detail End*/
        
        /*Save Company Detail start*/
        save_add_info: function(val)
        {
            console.log(val);
            var deferred = $q.defer();
            var promise = deferred.promise;
            
            $http.post(server_url+"/save_profile_detail.php", {
                
                'login_id':login_id,
                'street':val.street,
                'district_name':val.district_name,
                'state_name':val.state_name,
                'city':val.city,
                'area':val.area,
                'pincode':val.pincode,
                'type':'4'
                
            }).then(function (response)  {
                
                deferred.resolve(response);
                
            }, function (error) {
                
                console.log("Server Error : " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /*Save Company Detail End*/
        
        /*Save Shipping Company Detail start*/
        save_ship_add_info: function(val)
        {
            console.log(val);
            var deferred = $q.defer();
            var promise = deferred.promise;
            
            $http.post(server_url+"/save_profile_detail.php", {
                
                'login_id':login_id,
                'street':val.ship_street,
                'district_name':val.ship_district_name,
                'state_name':val.ship_state_name,
                'city':val.ship_city,
                'area':val.ship_area,
                'pincode':val.ship_pincode,
                'bank_name':val.bank_name,
                'account_no': val.bank_account,
                'branch_address':val.branch_adress,
                'ifsc_code': val.ifsc_code,
                'pan_card': val.pan_card,
                'type':'5'
                
            }).then(function (response)  {
                
                deferred.resolve(response);
                
            }, function (error) {
                
                console.log("Server Error : " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /*Save Shipping Company Detail End*/
        
        /*Retailer's Profile Update start*/
        profile_update: function(profile_data)
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            
            $http.post(server_url+"/profile_update.php", {
                
                'login_id':login_id,
                'profile_data': profile_data
                
            }).then(function (response)  {
                
                deferred.resolve(response);
                
            }, function (error) {
                
                console.log("Server Error : " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /*Retailer's Profile Update End*/
        
        /*Add GPS LOCATION start*/
        add_loc: function(loc,lat,lng)
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            
            $http.post(server_url+"/add_location.php", {
                
                'login_id':login_id,
                'loc':loc,
                'lat':lat,
                'lng':lng,
                
            }).then(function (response)  {
                
                deferred.resolve(response);
                
            }, function (error) {
                
                console.log("Server Error : " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /*Add GPS LOCATION End*/
        
        /*GET GPS LOCATION start*/
        get_gps_loc: function()
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            
            $http.post(server_url+"/get_location.php", {
                
                'login_id':login_id
                
            }).then(function (response)  {
                
                deferred.resolve(response);
                
            }, function (error) {
                
                console.log("Server Error : " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /*GET GPS LOCATION End*/
        
        /*GET Search Result Start*/
        get_result: function()
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            
            $http.post(server_url+"/get_search_result.php", {
                
                'login_id':login_id
                
            }).then(function (response)  {
                
                deferred.resolve(response);
                
            }, function (error) {
                
                console.log("Server Error : " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /*GET Search Result End*/
        
        /*GET Search Result Start*/
        show_last_payment: function(oid)
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            
            $http.post(server_url+"/get_last_payment.php", {
                
                'login_id':login_id,
                'oid':oid
                
            }).then(function (response)  {
                console.log(response);
                
                deferred.resolve(response);
                
            }, function (error) {
                
                console.log("Server Error : " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /*GET Search Result End*/
        
        /*GET Search Result Start*/
        get_my_seg_dists: function()
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            
            $http.post(server_url+"/get_seg_dists.php", {
                
                'dr_id':login_id,
                'district_name':district_name
                
            }).then(function (response)  {
                console.log(response);
                
                deferred.resolve(response);
                
            }, function (error) {
                
                console.log("Server Error : " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /*GET Search Result End*/
        
        /*GET Profile State Info Result Start*/
        get_profile_districts: function(st_name)
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            
            $http.post(server_url+"/get_profile_state_info.php", {
                
                'st_name':st_name,
                'val':1
                
            }).then(function (response)  {
                console.log(response);
                
                deferred.resolve(response);
                
            }, function (error) {
                
                console.log("Server Error : " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /**GET Profile State Info Result End*/
        
        /*GET Profile State Info Result Start*/
        get_profile_city: function(dist_name,st_name)
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            
            $http.post(server_url+"/get_profile_state_info.php", {
                
                'dist_name':dist_name,
                'st_name':st_name
                
            }).then(function (response)  {
                console.log(response);
                
                deferred.resolve(response);
                
            }, function (error) {
                
                console.log("Server Error : " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /**GET Profile State Info Result End*/
        
        /*GET Profile State Info Result Start*/
        get_profile_area: function(city,st_name)
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            
            $http.post(server_url+"/get_profile_state_info.php", {
                
                'city':city,
                'st_name':st_name
                
            }).then(function (response)  {
                console.log(response);
                
                deferred.resolve(response);
                
            }, function (error) {
                
                console.log("Server Error : " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /**GET Profile State Info Result End*/
        
        /*GET Profile State Info Result Start*/
        get_profile_pincodes: function(area,st_name)
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            
            $http.post(server_url+"/get_profile_state_info.php", {
                
                'area':area,
                'st_name':st_name
                
            }).then(function (response)  {
                console.log(response);
                
                deferred.resolve(response);
                
            }, function (error) {
                
                console.log("Server Error : " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /**GET Profile State Info Result End*/
        
        /*GET Profile State Info Result Start*/
        get_all_states: function(type,dist_pin,st_name)
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.post(server_url+"/get_state.php", {
                
                'type':type,
                'dist_pin':dist_pin,
                'st_name':st_name
                
            }).then(function (response)  {
                console.log(response);
                deferred.resolve(response);
            }, function (error) {
                console.log("Server Error : " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /**GET Profile State Info Result End*/
        
        /*Check Lead Info Result Start*/
        check_lead: function(val)
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.post(server_url+"/check_lead.php", {
                
                'val':val,
                
            }).then(function (response)  {
                console.log(response);
                deferred.resolve(response);
            }, function (error) {
                console.log("Server Error : " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /*Check Lead Info Result End*/
        
        /*Save Lead Info Result Start*/
        save_lead: function(val)
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.post(server_url+"/signup.php", {
                
                'val':val,
                
            }).then(function (response)  {
                console.log(response);
                deferred.resolve(response);
            }, function (error) {
                console.log("Server Error : " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /*Save Lead Info Result End*/
        
        /*Get Segment Info Result Start*/
        get_segment_names: function()
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.post(server_url+"/get_segments.php",
            {
                
            })
            .then(function (response) {
                console.log(response);
                deferred.resolve(response.data);
            }, function (error) {
                console.log("Server Error on response: " + JSON.stringify(error));
                deferred.reject(error);
            });
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        },
        /*Get Segment Info Result End*/

         /*Get Assign Distributor Start*/
         assign_distributor: function(company_district)
         {
             var deferred = $q.defer();
             var promise = deferred.promise;
             $http.post(server_url+"/assign_distributor.php",
             {
                'login_id':login_id,
                'company_district':company_district
             })
             .then(function (response) {
                 console.log(response);
                 deferred.resolve(response.data);
             }, function (error) {
                 console.log("Server Error on response: " + JSON.stringify(error));
                 deferred.reject(error);
             });
             promise.success = function (fn)
             {
                 promise.then(fn);
                 return promise;
             };
             promise.error = function (fn)
             {
                 promise.then(null, fn);
                 return promise;
             };
             return promise;
         },
         /*Get Assign Distributor End*/

         /*Get sheme list Start*/
         schemes_list: function()
         {
             var deferred = $q.defer();
             var promise = deferred.promise;
             $http.post(server_url+"/scheme_list.php",
             {
                'login_id':login_id,
             })
             .then(function (response) {
                 console.log(response);
                 deferred.resolve(response.data);
             }, function (error) {
                 console.log("Server Error on response: " + JSON.stringify(error));
                 deferred.reject(error);
             });
             promise.success = function (fn)
             {
                 promise.then(fn);
                 return promise;
             };
             promise.error = function (fn)
             {
                 promise.then(null, fn);
                 return promise;
             };
             return promise;
         },
         /*Get sheme list End*/

          /*Get sheme detail Start*/
          scheme_detail: function(scheme_id, company_district)
          {
              var deferred = $q.defer();
              var promise = deferred.promise;
              $http.post(server_url+"/scheme_detail.php",
              {
                'login_id':login_id,
                'scheme_id' : scheme_id,
                'company_district' : company_district
              })
              .then(function (response) {
                  console.log(response);
                  deferred.resolve(response.data);
              }, function (error) {
                  console.log("Server Error on response: " + JSON.stringify(error));
                  deferred.reject(error);
              });
              promise.success = function (fn)
              {
                  promise.then(fn);
                  return promise;
              };
              promise.error = function (fn)
              {
                  promise.then(null, fn);
                  return promise;
              };
              return promise;
          },
          /*Get sheme detail End*/
        
        /*Add invoice function start*/
        add_inv: function(inv_data)
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.post(server_url+"/add_invoice.php",
            {
                'login_id':login_id,
                'data':inv_data
                
            }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                console.log("Server Error on response: " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },


      

        /*Invoice list function start*/
        invoice_list: function()
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.post(server_url+"/invoice_list.php",
            {
                'login_id':login_id
                
            }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                console.log("Server Error on response: " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /*Invoice list function End*/
        
        /*Invoice detail function start*/
        invoice_detail: function(inv_id)
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.post(server_url+"/invoice_detail.php",
            {
                'login_id':login_id,
                'inv_id' : inv_id
                
            }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                console.log("Server Error on response: " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /*Invoice detail function End*/

        /*Invoice delete function start*/
        delete_invoice: function(inv_id)
        {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.post(server_url+"/delete_invoice.php",
            {
                'login_id':login_id,
                'inv_id' : inv_id
                
            }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                console.log("Server Error on response: " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /*Invoice delete function End*/


        /*Add DR Segment function start*/
        add_dr_seg: function(last_dr_id,seg_name_arr,type)
        {
            console.log(seg_name_arr);
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.post(server_url+"/add_dr_seg.php",
            {
                'last_id':last_dr_id,
                'seg_arr':seg_name_arr
                
            }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                console.log("Server Error on response: " + JSON.stringify(error));
                deferred.reject(error);
            });
            
            promise.success = function (fn)
            {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn)
            {
                promise.then(null, fn);
                return promise;
            };
            
            return promise;
        },
        /*Add DR Segment function End*/
        
    }
})


.factory('mySharedService', function() {
    var mySharedService = {};
    
    mySharedService.shareDistList = {};
    mySharedService.shareDistDetail = '';
    mySharedService.shareAllPaymentList = {};
    mySharedService.shareDistPaymentList = {};
    mySharedService.sharePopGiftList = {};
    mySharedService.shareDocAddList = {};
    mySharedService.shareDocAddGallaryList = {};
    mySharedService.shareDistAllOrderList = {};
    mySharedService.shareDistAllOrderDetail = {};
    mySharedService.company_name = '';
    
    /* Retailer Add Order Service Start */
    mySharedService.shareProductsdata = '';
    mySharedService.shareProductsCatdata = '';
    mySharedService.shareDistributordata = '';
    mySharedService.shareGstdata = '';
    mySharedService.shareProductsNamedata = '';
    
    mySharedService.shareLastOIDdata = '';
    mySharedService.shareDistListdata = '';
    mySharedService.shareOrdDistListdata = [];
    mySharedService.my_dist_seg=[];
    mySharedService.orderDists=[];
    mySharedService.mysegments=[];
    mySharedService.lat='';
    mySharedService.long='';
    mySharedService.last_gps='';
    mySharedService.default_segment=[];
    mySharedService.default_category=[];
    mySharedService.default_products=[];
    mySharedService.show_default_category=[];
    mySharedService.show_default_product=[];
    mySharedService.temp_default_category=[];
    mySharedService.temp_default_products=[];
    mySharedService.cart_arr=[];
    mySharedService.temp_cart_arr=[];
    mySharedService.dist_name=[];
    mySharedService.edit_enable='';
    mySharedService.edit_enable_button='';
    mySharedService.saved_qty='';
    mySharedService.share_seg_comb_data=[];
    mySharedService.saved_order_id='';
    mySharedService.show_proceed_btn='';
    mySharedService.payment_type=[];
    mySharedService.payment_mode=[];
    mySharedService.order_amt=[];
    mySharedService.order_cno=[];
    mySharedService.order_ref=[];
    mySharedService.next_followup_date=[];
    mySharedService.last_payment='';
    mySharedService.distributor_idd=[];
    mySharedService.new_arrr=[];
    mySharedService.new_result_arr=[];
    mySharedService.state_data=[];
    mySharedService.district_data=[];
    mySharedService.city_data=[];
    mySharedService.area_data=[];
    mySharedService.pincode_data=[];
    mySharedService.ship_state_data=[];
    mySharedService.ship_district_data=[];
    mySharedService.ship_city_data=[];
    mySharedService.ship_area_data=[];
    mySharedService.ship_pincode_data=[];
    mySharedService.temp_dist_array=[];
    mySharedService.edittt_val='';
    mySharedService.temp_dist_name=[];
    mySharedService.temp_arrange_dist_name=[];
    mySharedService.saved_seg_dist=[];
    mySharedService.shareallstates=[];
    mySharedService.sharealldistrict=[];
    mySharedService.shareallcity=[];
    mySharedService.shareallarea=[];
    mySharedService.shareallshipdistrict=[];
    mySharedService.shareallshipcity=[];
    mySharedService.shareallshiparea=[];
    mySharedService.segment_names=[];
    mySharedService.last_dr_id='';
    
    /* Retailer Add Order Service End */
    
    mySharedService.shareNoticeList = [];
    mySharedService.shareNoticeDet=[];
    mySharedService.ann_id='';
    mySharedService.shareProfileDetail = {};
    mySharedService.assign_distributor_list = [];
    mySharedService.schemes_list = [];
    mySharedService.schemes_detail = [];
    mySharedService.invoice_detail = [];
    mySharedService.company_district = '';
    mySharedService.invoice_images = [];
    mySharedService.invoice_list = [];
    mySharedService.scheme_data = {};
    mySharedService.achieved_amount = {};
    mySharedService.max_value = 0;
    mySharedService.min_value = 0;
    
    return mySharedService;
})


.factory('Camera', function($q) {
    return {
        getPicture: function(options) {
            var q = $q.defer();
            
            navigator.camera.getPicture(function(result) {
                q.resolve(result);
            }, function(err) {
                q.reject(err);
            }, options);
            
            return q.promise;
        }
    }
})


.filter('trustUrl', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
})

.filter('titlecase', function() {
    return function(input) {
      if (!input || typeof input !== 'string') {
        return '';
      }

      return input.toLowerCase().split(' ').map(value => {
        return value.charAt(0).toUpperCase() + value.substring(1);
      }).join(' ');
    }
})

.filter('setDecimal', function ($filter) {
    return function (input, places) {
        if (isNaN(input)) return input;
        // If we want 1 decimal place, we want to mult/div by 10
        // If we want 2 decimal places, we want to mult/div by 100, etc
        // So use the following to create that factor
        var factor = "1" + Array(+(places > 0 && places + 1)).join("0");
        return Math.round(input * factor) / factor;
    };
})

.factory('Chats', function() {
    // Might use a resource here that returns a JSON array
    
    // Some fake testing data
    var chats = [{
        id: 0,
        name: 'Ben Sparrow',
        lastText: 'You on your way?',
        face: 'img/ben.png'
    }, {
        id: 1,
        name: 'Max Lynx',
        lastText: 'Hey, it\'s me',
        face: 'img/max.png'
    }, {
        id: 2,
        name: 'Adam Bradleyson',
        lastText: 'I should buy a boat',
        face: 'img/adam.jpg'
    }, {
        id: 3,
        name: 'Perry Governor',
        lastText: 'Look at my mukluks!',
        face: 'img/perry.png'
    }, {
        id: 4,
        name: 'Mike Harrington',
        lastText: 'This is wicked good ice cream.',
        face: 'img/mike.png'
    }];
    
    return {
        all: function() {
            return chats;
        },
        remove: function(chat) {
            chats.splice(chats.indexOf(chat), 1);
        },
        get: function(chatId) {
            for (var i = 0; i < chats.length; i++) {
                if (chats[i].id === parseInt(chatId)) {
                    return chats[i];
                }
            }
            return null;
        }
    };
})



function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
    byteString = atob(dataURI.split(',')[1]);
    else
    byteString = unescape(dataURI.split(',')[1]);
    
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([ia], {type:mimeString});
}