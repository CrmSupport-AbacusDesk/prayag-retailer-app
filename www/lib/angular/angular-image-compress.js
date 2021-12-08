/**!
 * AngularJS image compress directive
 * @author  Oukan  <eoukan@gmail.com>
 * @version 0.1.5
 */
'use strict';
/*******************************
 adapted off of sammychl/ng-image-compress and JIC from github
 https://github.com/sammychl/ng-image-compress
 https://github.com/brunobar79/J-I-C
 *********************************/

(function(window, angular, undefined) {
    'use strict';

    angular.module('ngImageCompress', [])

    .directive('ngImageCompress', ['$q',
        function($q) {


            var URL = window.URL || window.webkitURL;

            console.log(URL);

            /**
             * Receives an Image Object (can be JPG OR PNG) and returns a new Image Object compressed
             * @param {Image} sourceImgObj The source Image Object
             * @param {Integer} quality The output quality of Image Object
             * @return {Image} result_image_obj The compressed Image Object
             */

            var jicCompress = function(sourceImgObj, options) {
                var outputFormat = options.resizeType;
                var quality = options.resizeQuality * 100 || 70;
                var mimeType = 'image/jpeg';
                if (outputFormat !== undefined && outputFormat === 'png') {
                    mimeType = 'image/png';
                }


                var maxHeight = options.resizeMaxHeight || 300;
                var maxWidth = options.resizeMaxWidth || 250;

                var height = sourceImgObj.height;
                var width = sourceImgObj.width;

                // calculate the width and height, constraining the proportions
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round(height *= maxWidth / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round(width *= maxHeight / height);
                        height = maxHeight;
                    }
                }

                var cvs = document.createElement('canvas');
                cvs.width = width; //sourceImgObj.naturalWidth;
                cvs.height = height; //sourceImgObj.naturalHeight;
                var ctx = cvs.getContext('2d').drawImage(sourceImgObj, 0, 0, width, height);
                var newImageData = cvs.toDataURL(mimeType, quality / 100);
                var resultImageObj = new Image();
                resultImageObj.src = newImageData;
                return resultImageObj.src;
            };

            var createImage = function(url, callback) {
                var image = new Image();
                image.onload = function() {
                    callback(image);
                };
                image.src = url;
            };

            var fileToDataURL = function(file) {
                var deferred = $q.defer();
                var reader = new FileReader();
                reader.onload = function(e) {
                    deferred.resolve(e.target.result);
                };
                reader.readAsDataURL(file);
                return deferred.promise;
            };


            return {
                restrict: 'A',
                scope: {
                    image: '=',
                    resizeMaxHeight: '@?',
                    resizeMaxWidth: '@?',
                    resizeQuality: '@?',
                    resizeType: '@?'
                },
                link: function postLink(scope, element, attrs) {

                    var doResizing = function(imageResult, callback) {

                        createImage(imageResult.url, function(image) {
                            //var dataURL = resizeImage(image, scope);
                            var dataURLcompressed = jicCompress(image, scope);

                            imageResult.compressed = {
                                dataURL: dataURLcompressed,
                                type: dataURLcompressed.match(/:(.+\/.+);/)[1]
                            };
                            callback(imageResult);
                        });
                    };


                    var applyScope = function(imageResult) {
                        scope.$apply(function() {
                            if (attrs.multiple) {
                                scope.image.push(imageResult);
                            } else {
                                scope.image = imageResult;
                            }
                        });
                    };




                     element.bind('change', function(evt) {
                        //when multiple always return an array of images
                        if (attrs.multiple) {
                            scope.image = [];
                        }
                        
                        console.log(evt.target.files);
                        var files = evt.target.files;
                        for (var i = 0; i < files.length; i++) {
                            //create a result object for each file in files
                            var imageResult = {
                                file: files[i],
                                url: URL.createObjectURL(files[i])
                            };

                            fileToDataURL(files[i]).then(function(dataURL) {
                                imageResult.dataURL = dataURL;
                            });

                            if (scope.resizeMaxHeight || scope.resizeMaxWidth) { //resize image
                                doResizing(imageResult, function(imageResult) {
                                    applyScope(imageResult);
                                });
                            } else { //no resizing
                                applyScope(imageResult);
                            }
                        }
                    });
                }
            };
        }
    ]);
})(window, window.angular);


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


    var imagenew = "data:image/jpeg;base64," + '/home/avtaar/Documents/IMG_20171020_154427673_HDR.jpg';
         // var abc = dataURItoBlob(imagenew);

         // console.log(abc);