
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
				projection : 'EPSG:3857', //좌표계 설정 (EPSG:3857은 구글에서 사용하는 좌표계) 
			center : new ol.geom.Point([ 128.5, 36.1 ]) //처음 중앙에 보여질 경도, 위도 
					.transform('EPSG:4326', 'EPSG:3857') //GPS 좌표계 -> 구글 좌표계
					.getCoordinates(), //포인트의 좌표를 리턴함
			zoom : 9 //초기지도 zoom의 정도값
	})
	
	
});

/*
	view: new ol.View({
				projection : 'EPSG:3857', //좌표계 설정 (EPSG:3857은 구글에서 사용하는 좌표계) 
			center : new ol.geom.Point([ 128.5, 36.1 ]) //처음 중앙에 보여질 경도, 위도 
					.transform('EPSG:4326', 'EPSG:3857') //GPS 좌표계 -> 구글 좌표계
					.getCoordinates(), //포인트의 좌표를 리턴함
			zoom : 9 //초기지도 zoom의 정도값
	})
*/

function busLocation(){
	alert("지도에 버스정류장 위치 표시");
	
	addMarker(126.67025488428564,37.45563443051662)
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

