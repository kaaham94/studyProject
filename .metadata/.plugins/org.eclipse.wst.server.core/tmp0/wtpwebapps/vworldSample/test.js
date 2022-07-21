
/*
범위 설정
*/
var maxExtent = ol.proj.transformExtent([112.5, 29.53522956294847, 135, 45.089], 'EPSG:4326', 'EPSG:3857')
var newProj = ol.proj.get('EPSG:3857');
var newProjExtent = newProj.getExtent();
/*
초기 위치 줌 설정 tile 설정

브이월드 지도
source: new ol.source.XYZ({
	url: '//api.vworld.kr/req/wmts/1.0.0/CEB52025-E065-364C-9DBA-44880E3B02B8/Base/{z}/{y}/{x}.png'
})
OSM 지도
source: new ol.source.OSM()
*/


var map = new ol.Map({
	target: 'map',
	layers: [
		new ol.layer.Tile({
			source: new ol.source.XYZ({
				url: 'http://api.vworld.kr/req/wmts/1.0.0/CEB52025-E065-364C-9DBA-44880E3B02B8/Base/{z}/{y}/{x}.png'
			})
		})
	],
	view: new ol.View({
		//center: [127.3,36.3],
		center: [126.67025488428564, 37.45563443051662],
		zoom: 16,
		projection: ol.proj.get('EPSG:4326')
	})
});

$(function(){
	
	$.ajax({
		type: "get",
		url: "http://openapi.nsdi.go.kr/nsdi/eios/service/rest/AdmService/admCodeList.json",
		data : {authkey : $('#sido_key').val()},
		async: false,
		dataType: 'json',
		success: function(data) {
			var html = "<option>선택</option>";
			
			for(var i=0;i<data.admVOList.admVOList.length;i++){ 
				html +="<option value='"+data.admVOList.admVOList[i].admCode+"'>"+data.admVOList.admVOList[i].lowestAdmCodeNm+"</option>"
			}
			
            $('#sido_code').html(html);
			
		},
		error: function(xhr, stat, err) {}
	});
	
	
	$(document).on("change","#sido_code",function(){
		var thisVal = $(this).val();		
		
		$.ajax({
			type: "get",
			url: "http://openapi.nsdi.go.kr/nsdi/eios/service/rest/AdmService/admSiList.json",
			data : {admCode : thisVal, authkey : $('#sigoon_key').val()},
			async: false,
			dataType: 'json',
			success: function(data) {
				var html = "<option>선택</option>";
				
				for(var i=0;i<data.admVOList.admVOList.length;i++){ 
					html +="<option value='"+data.admVOList.admVOList[i].admCode+"'>"+data.admVOList.admVOList[i].lowestAdmCodeNm+"</option>"
				}
				
	            $('#sigoon_code').html(html);
				
			},
			error: function(xhr, stat, err) {}
		});
	});
	
	$(document).on("change","#sigoon_code",function(){ 
		var thisVal = $(this).val();		
		
		$.ajax({
			type: "get",
			url: "http://openapi.nsdi.go.kr/nsdi/eios/service/rest/AdmService/admDongList.json",
			data : {admCode : thisVal, authkey : $('#dong_key').val()},
			async: false,
			dataType: 'json',
			success: function(data) {
				var html = "<option>선택</option>";
				
				for(var i=0;i<data.admVOList.admVOList.length;i++){ 
					html +="<option value='"+data.admVOList.admVOList[i].admCode+"'>"+data.admVOList.admVOList[i].lowestAdmCodeNm+"</option>"
				}
				
	            $('#dong_code').html(html);
				
			},
			error: function(xhr, stat, err) {}
		});
	});
	$(document).on("change","#dong_code",function(){ 
		var thisVal = $(this).val();		
		var addressText= $("#sido_code option:selected").text()+" "+$("#sigoon_code option:selected").text()+" "+$("#dong_code option:selected").text()
		//address
		
		geocoder(addressText);
		
	});
	
})


var dataAjax = function(x,y){
	$.ajax({
		type: "get",
		url: "http://api.vworld.kr/req/data?geomFilter=POINT("+x+" "+y+")",
		data : $('#dataForm').serialize(),
		dataType: 'jsonp',
		async: false,
		success: function(data) {
		    var vectorSource = new ol.source.Vector({features: (new ol.format.GeoJSON()).readFeatures(data.response.result.featureCollection)})
		    console.log(data.response.result.featureCollection);
		    console.log(vectorSource);
		    var vector_layer = new ol.layer.Vector({
		  	  source: vectorSource
		  	})
		    
	   		vector_layer.set("vectorLayer","search_vector")
	        
	        map.getLayers().forEach(function(layer){ //기존검색결과 제거 
				if(layer.get("vectorLayer")=="search_vector"){
					map.removeLayer(layer);
				}
    	    });
	        
		 	map.addLayer(vector_layer);
		    
		    
		},
		complete: function(){
			$('#loading').text("");
		},
		
		error: function(xhr, stat, err) {}
	});
}

/**
 *  지오코더 호출 
 */
var geocoder = function(name){
	$.ajax({
		type: "get",
		url: "http://api.vworld.kr/req/address?service=address&version=2.0&request=getcoord&format=json&type=parcel",
		data : {apiKey : $('[name=apiKey]').val(), address : name},
		dataType: 'jsonp',
		success: function(data) {
			result= data;
			move(data.response.result.point.x*1,data.response.result.point.y*1,11);
			addMarker(data.response.result.point.x*1,data.response.result.point.y*1,'ddddddddddddddd')
			var point = [ data.response.result.point.x*1, data.response.result.point.y*1];
			dataAjax(point[0],point[1]);
		},
		beforeSend: function(){
			$('#loading').text("로딩중....");
		},

		error: function(xhr, stat, err) {}
	});
}

/**
 *  역 지오코더 호출 
 */
var geocoder_reverse = function(x,y){
	$.ajax({
		type: "get",
		url: "http://api.vworld.kr/req/address?service=address&version=2.0&request=getaddress&format=json&type=parcel", //&crs=epsg:900913
		data : {apiKey : $('[name=apiKey]').val(), point : x+","+y},
		dataType: 'jsonp',
		success: function(data) {
			var geoResult =""; 
			for( i in data.response.result)
			{ 
				geoResult +=data.response.result[i].text;
			}
			$('#geoAddress').text(geoResult);
		},
		beforeSend: function(){
		},

		error: function(xhr, stat, err) {}
	});
}
/**
 * 버스 정류소 조회
 */ //
var features = new Array();
var bus_where = function(x,y){
	
    map.getLayers().forEach(function(layer){ //기존검색결과 제거 
		if(layer.get("name")=="bus_vector"){
			map.removeLayer(layer);
		}
    });	
	
	
	$.ajax({
		type: "get",
		url: "http://apis.data.go.kr/1613000/BusSttnInfoInqireService/getCrdntPrxmtSttnList?serviceKey=00or70hls9PydYMI8XAjYCRgMhIA8l3KbkNtjf2qxxyQIvJC6t09soj6DWFcEDHN0OuUXc9cvFxVetPfV3tJ2A==&gpsLati=36.3&gpsLong=127.3", 
		//data : {apiKey : $('[name=apiKey]').val(), point : x+","+y},
		dataType: 'xml',
		success: function(data) {
			
		
	
			feature.set("nodeid",nodeid);
			feature.set("nodenm",nodenm);
			feature.set("citycode",citycode);
			features.push(feature);
			
	
		    var iconStyle = new ol.style.Style({
	            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
	              anchor: [0.5, 46],
	              anchorXUnits: 'fraction',
	              anchorYUnits: 'pixels',
	              src: 'http://image.flaticon.com/icons/png/128/164/164955.png',
	              scale : 0.1
	            }))
	        });
			var vectorSource = new ol.source.Vector({
				features: features,
			});
			   
			var vector_layer = new ol.layer.Vector({
				source: vectorSource,
		  	    style: iconStyle
			})
			
			vector_layer.set("name","bus_vector")
	        
		 	map.addLayer(vector_layer);
		
		},
		beforeSend: function(){
		},

		error: function(xhr, stat, err) {}
	});
	
	/* 
	getFile("http://openapi.tago.go.kr/openapi/service/BusSttnInfoInqireService/getCrdntPrxmtSttnList?serviceKey=00or70hls9PydYMI8XAjYCRgMhIA8l3KbkNtjf2qxxyQIvJC6t09soj6DWFcEDHN0OuUXc9cvFxVetPfV3tJ2A==&gpsLati="+y+"&gpsLong="+x, "xml",
	function(response){
		result =  jQuery.parseXML(response.responseText);
		
		$(result).find('item').each(function(){ 
			var nodenm = $(this).find('nodenm').text(); //성북3통굿개말길
			var gpslong = $(this).find('gpslong').text() //127
			var gpslati = $(this).find('gpslati').text() //36 
			var nodeid = $(this).find('nodeid').text() //36 //
			var citycode = $(this).find('citycode').text() //citycode
			var feature = new ol.Feature({
		        geometry: new ol.geom.Point([gpslong,gpslati])
		    });
			feature.set("nodeid",nodeid);
			feature.set("nodenm",nodenm);
			feature.set("citycode",citycode);
			features.push(feature);
			
		})	
	    var iconStyle = new ol.style.Style({
            image: new ol.style.Icon(@type {olx.style.IconOptions}  ({
              anchor: [0.5, 46],
              anchorXUnits: 'fraction',
              anchorYUnits: 'pixels',
              src: 'http://image.flaticon.com/icons/png/128/164/164955.png',
              scale : 0.1
            }))
        });
		var vectorSource = new ol.source.Vector({
			features: features,
		});
		   
		var vector_layer = new ol.layer.Vector({
			source: vectorSource,
	  	    style: iconStyle
		})
		
		vector_layer.set("name","bus_vector")
        
	 	map.addLayer(vector_layer);
		
	})
	*/
}

//http://openapi.tago.go.kr/openapi/service/ArvlInfoInqireService/getSttnAcctoArvlPrearngeInfoList?serviceKey=c%2B5hfI5EOx%2F1RnQ5OxVAJ0hEV%2FqglJInaW%2FKQmtuxHnvhN1FhCTcTJj3P71keILvLP8xGDQlN2kyMYFyYWabqQ%3D%3D&cityCode=25&nodeId=DJB8001793ND

/**
 * 선택한 버스 정류소 조회 
 
 */

var bus_result = function(cityCode,nodeId){
	//http://openapi.tago.go.kr/openapi/service/ArvlInfoInqireService/getSttnAcctoArvlPrearngeInfoList?serviceKey=c%2B5hfI5EOx%2F1RnQ5OxVAJ0hEV%2FqglJInaW%2FKQmtuxHnvhN1FhCTcTJj3P71keILvLP8xGDQlN2kyMYFyYWabqQ%3D%3D&cityCode=25&nodeId=DJB8001793ND
			
	getFile("http://openapi.tago.go.kr/openapi/service/ArvlInfoInqireService/getSttnAcctoArvlPrearngeInfoList?serviceKey=c%2B5hfI5EOx%2F1RnQ5OxVAJ0hEV%2FqglJInaW%2FKQmtuxHnvhN1FhCTcTJj3P71keILvLP8xGDQlN2kyMYFyYWabqQ%3D%3D&cityCode="+cityCode+"&nodeId="+nodeId, "xml",
	function(response){
		result =  jQuery.parseXML(response.responseText);
		//console.log(result);
		
		if($(result).find('item').text() == null||$(result).find('item').text() == ""){
			$("#result_bus").html("결과없음")
		}else{
			var resultBus = "<strong>"+$(result).find('item:eq(0)').find('nodenm').text()+"</strong><ul>";
	   		$(result).find('item').each(function(){ 
				resultBus+="<li>"+$(this).find("routetp").text()+$(this).find("routeno").text()+" 도착예정시간초 : "+$(this).find("arrtime").text()+ "초 "+$(this).find("arrprevstationcnt").text()+"정거장 전</li>";
			})	
			
			resultBus +="</ul>"
			
			$("#result_bus").html(resultBus);
			
		}
	})		
}
 

/**
 * 화면 이동
 */
var move = function(x,y,zoom){//127.10153, 37.402566
	map.getView().setCenter([ x, y ]); // 지도 이동
	map.getView().setZoom(zoom);
}


/**
	오버레이 삭제
*/
var deleteOverlay = function(id){
	map.removeOverlay(map.getOverlayById(id));
}


/* 클릭 이벤트 제어 */ 
map.on("click", function(evt) {
	var coordinate = evt.coordinate //좌표정보
	var pixel = evt.pixel
	
	//선택한 픽셀정보로  feature 체크 
    map.forEachFeatureAtPixel(pixel, function(feature, layer) {
    	var emd_cd = feature.get("emd_cd");
   		if(emd_cd!=null&&emd_cd.length>0){ // 폴리곤 선택시
   		
	   		var overlayElement= document.createElement("div"); // 오버레이 팝업설정 
	   		overlayElement.setAttribute("class", "overlayElement");
	   		overlayElement.setAttribute("style", "background-color: #3399CC; border: 2px solid white; color:white");
	   		overlayElement.setAttribute("onclick", "deleteOverlay('"+feature.get("emd_cd")+"')");
	   		overlayElement.innerHTML="<p>"+feature.get("full_nm")+"("+feature.get("emd_cd")+")"+"</p>";
	   		
	   		var overlayInfo = new ol.Overlay({
	   			id:feature.get("emd_cd"),
	   			element:overlayElement,
	   			position: coordinate
	   		});
	   		
	   		if(feature.get("emd_cd") != null){
	   			map.removeOverlay(map.getOverlayById(feature.get("emd_cd")));
	   		}
	   		
	   		map.addOverlay(overlayInfo);
    	}
			
    	var nodenm = feature.get("nodenm");
    	if(nodenm.length>0){ //정류소 선택시 
    		var overlayElement= document.createElement("div"); // 오버레이 팝업설정 
	   		overlayElement.setAttribute("class", "overlayElement");
	   		overlayElement.setAttribute("style", "background-color: #3399CC; border: 2px solid white; color:white");
	   		overlayElement.setAttribute("onclick", "deleteOverlay('"+feature.get("nodeid")+"')");
	   		overlayElement.innerHTML="<p>"+feature.get("nodeid")+"("+feature.get("nodenm")+")"+"</p>";
	   		
	   		var overlayInfo = new ol.Overlay({
	   			id:feature.get("nodeid"),
	   			element:overlayElement,
	   			position: coordinate
	   		});
	   		
	   		if(feature.get("nodeid") != null){
	   			map.removeOverlay(map.getOverlayById(feature.get("nodeid")));
	   		}
	   		map.addOverlay(overlayInfo);
	   		
	   		var citycode = feature.get("citycode");
	   		var nodeid = feature.get("nodeid");
	   		
	   		
	   		bus_result(citycode,nodeid);
    	}
		
    		
    });
});

/** 선택시 스타일 설정*/
var stylep = new ol.style.Style({
	stroke: new ol.style.Stroke({
	    color: [51, 51, 51, .0],
	    width: 3
	}),
	fill: new ol.style.Fill({
	    color: [51, 51, 51, .7]
	})
});
/* var selectInteraction = new ol.interaction.Select({
	features: function (feature) {
		return true;
	},
	style: [stylep]
});
map.getInteractions().extend([selectInteraction]);
 */

/* 지도이동 후 지오코더 호출  */ 
map.on("moveend", function(evt) {
	var center = map.getView().getCenter();
	geocoder_reverse(center[0],center[1]);
});

/**
 * 웹 프록시 사용 
 * @param theURL
 * @param type
 * @param callback
 * @returns 
 * https://gist.github.com/rickdog/d66a03d1e1e5959aa9b68869807791d5
 */
function getFile(theURL, type, callback)
{
	jQuery.ajax = (function(_ajax)
	{
		var protocol = location.protocol,
			hostname = location.hostname,
			exRegex = RegExp(protocol + '//' + hostname),
			YQL = 'http' + (/^https/.test(protocol)?'s':'') + '://query.yahooapis.com/v1/public/yql?callback=?',
			query = 'select * from html where url="{URL}" and xpath="*"';

		function isExternal(url)
		{
			return !exRegex.test(url) && /:\/\//.test(url);
		}

		return function(o)
		{
			var url = o.url;
			if (o.dataType == 'xml')  
				query = 'select * from xml where url="{URL}"';	// XML
			if ( /get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url) )
			{
				o.url = YQL;
				o.dataType = 'json';
				o.data = {
					q: query.replace('{URL}', url + (o.data ? (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data) : '')),
					format: 'xml'
				};

				if (!o.success && o.complete) {
					o.success = o.complete;
					delete o.complete;
				}

				o.success = (function(_success)
				{
					return function(data)
					{
						if (_success) {
							_success.call(this, {
								responseText: (data.results[0] || '').replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
							}, 'success');
						}
					};
				})(o.success);
			}
			return _ajax.apply(this, arguments); 
		};
	})(jQuery.ajax);


	return $.ajax({
		url: theURL,
		type: 'GET',
		dataType: type,
		success: function(res) {
			callback ? callback(res) : undefined;
		}
	})
};

var whereisit = function(){
	navigator.geolocation.getCurrentPosition(function(location) {
		  	map.getView().setCenter([location.coords.longitude,location.coords.latitude ]); // 지도 이동
		  	map.getView().setZoom(16);
	});
}


function busLocation(){
	
	alert("지도에 버스정류장 위치 표시");
}


function addMarker(lon, lat, name){ //경도 위도 이름값(마커들을 구분하기위해)
	// 마커 feature 설정
	debugger
    var feature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat])), //경도 위도에 포인트 설정
        name: name
    });

    // 마커 스타일 설정
    var markerStyle = new ol.style.Style({
        image: new ol.style.Icon({ //마커 이미지
        	opacity: 50, //투명도 1=100% 
        	scale: 4, //크기 1=100%
            src: 'http://map.vworld.kr/images/ol3/marker_blue.png'
        }),
        zindex: 10
    });

    // 마커 레이어에 들어갈 소스 생성
    var markerSource = new ol.source.Vector({
        features: [feature] //feature의 집합
    });

    // 마커 레이어 생성
    var markerLayer = new ol.layer.Vector({
        source: markerSource, //마커 feacture들
        style: markerStyle //마커 스타일
    });
    
    // 지도에 마커가 그려진 레이어 추가
    console.log(markerLayer)
    map.addLayer(markerLayer);
    
}
$(document).ready(function() {
	
	//addMarker(127.01505740643591, 37.2338880796069, '포인트1');
});

