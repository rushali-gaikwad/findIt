/**
 * Created by M033 on 06-09-2016.
 */

import loadGoogleMapsAPI from 'load-google-maps-api';
var markerImage = require('../../assets/images/marker.png');

export  default  function ($scope, $http) {
  'ngInject';

  var map;
  var mapObj;
  $scope.appHeading = "Who What Where";
  $scope.query = null;
  $scope.place = null;
  $scope.data = null;
  $scope.listData = null;

  loadGoogleMapsAPI({key: 'AIzaSyCacK0RUYx2LFOaTVnEE1Mqdu4Tp4XaETw', timeout: 5000}).then(function (Map) {
    mapObj = Map;
  }).catch(function (error) {
    console.error(error);
  });

  function scrollAnimate(index) {
    var top = $('.result-'+index).get(0).offsetTop - 152;
    $('.list-cls').animate({
      scrollTop:top
    },1500);
  }

  function addMarker(feature) {
    var marker = new mapObj.Marker({
      position: feature.position,
      icon: markerImage,
      map: map,
      animation: mapObj.Animation.DROP,
      dragable:true
    });

    var infowindow = new mapObj.InfoWindow({
      content: feature.title + '<br>' + feature.data.city + '<br>' + feature.data.address
    });


    marker.addListener('mouseover', function () {
      infowindow.open(map, marker);
    });

    marker.addListener('mouseout', function () {
      infowindow.close();
    });


    marker.addListener('click', function (event) {
      console.log('click marker',event);
      scrollAnimate(feature.index);
    });
  }

  //load map
  function loadGoogleMap(cords) {
    map = new mapObj.Map(document.getElementById('map-canvas'), {
      zoom: 16,
      center: new mapObj.LatLng(cords.lat, cords.lon)
    });
  }

  //load google map
  function loadGoogle() {
    loadGoogleMapsAPI({key: 'AIzaSyCacK0RUYx2LFOaTVnEE1Mqdu4Tp4XaETw'}).then(function (Map) {
      mapObj = Map;
    }).catch(function (error) {
      console.error(error);
    });
  }

  //find data on search
  $scope.find = function () {
    $scope.data = {
      query: $scope.query || 'food',
      location: $scope.place
    };
    $http.post('/getdata', $scope.data).then(function (resp) {
      if (resp.data instanceof Array && resp.data.length > 0) {
        $('#map-canvas').show();
        loadGoogleMap(resp.data[0].cords);

        $scope.listData = resp.data;
        for (var i = 0; i < resp.data.length; i++) {
          var business = resp.data[i];
          var _marker = {
            position: new mapObj.LatLng(business.cords.lat, business.cords.lon),
            title: business.name,
            data: business,
            index:i
          };
          addMarker(_marker);
        }
      } else {
        alert("Please enter valid Data");
        $scope.listData = null;
        $scope.query = null;
        $scope.place = null;
        $('#map-canvas').hide();
      }
    }, function (error) {
      console.error('error',error);
      alert("Data not found");
      $scope.listData = null;
      $scope.query = null;
      $scope.listData = null;
    });
  };

  //Business Name click
  $scope.openApp = function (url) {
    if(url !== 'NA'){
      window.open(url,'_blank');
    }else{
      alert('Url is not there');
    }
  };


}