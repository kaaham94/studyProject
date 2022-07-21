<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<!-- 지오코더2.0, 역지오코더 2.0 데이터 API 2.0 샘플 -->
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>

<script  src="http://code.jquery.com/jquery-latest.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.4.4/proj4.js"></script>
<script src="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.3.0/build/ol.js"></script>
<script src="https://code.jquery.com/jquery-2.2.3.min.js"></script>
<script type="text/javascript" src="test.js" defer ></script>

<body>
<div id="map" style="width: 1000px; height: 800px; left: 0px; top: 0px"></div>
<div>
	<form id="searchForm" action="#" class="form_data" onsubmit="return false;search();">
<!-- nsdi apikey 시작 -->	
		<input type="hidden" id="sido_key" value="12685d425f1af0872d756c" />
		<input type="hidden" id="sigoon_key" value="b0888bae39fbd0463a9252" /> 
		<input type="hidden" id="dong_key" value="91afccaa8d7f499151ee3b" /> <!--  아직 key 인증을 받지 못함... -->
<!-- nsdi apikey 종료 -->		
		<input type="hidden" name="apiKey" value="CEB52025-E065-364C-9DBA-44880E3B02B8" />
		
		<div>
			<select id="sido_code">
				<option>선택</option>
			</select>
			<select id="sigoon_code">
				<option>선택</option>
			</select>
			<select id="dong_code">
				<option>선택</option>
			</select>
			<input type="button" value="정류소 검색" onclick="bus_where(map.getView().getCenter()[0],map.getView().getCenter()[1])">
			<input type="button" value="위치" id="geolocate" onclick="whereisit()">
			<input type="button" value="지도에 버스정류장 위치에 표시" onclick="busLocation()">
			
			<p><span>역지오코더 위치 : </span><span id="geoAddress"></span> </p>
		</div>
		
	<ul id="result_ajax">
		<li></li>
	</ul>
	<p id="result_count"></p>
	<p id="result_pos"></p>
	<p id="loading"></p>
	<p id="result_bus"></p>
	</form>
	
	
	
	<form id="dataForm">
		<input type="hidden" name="key" value="CEB52025-E065-364C-9DBA-44880E3B02B8">
		<input type="hidden" name="domain" value="http://localhost:8080">
		<input type="hidden" name="service" value="data">
		<input type="hidden" name="version" value="2.0">
		<input type="hidden" name="request" value="getfeature">
		<input type="hidden" name="format" value="json">
		<input type="hidden" name="size" value="10">
		<input type="hidden" name="page" value="1">
		<!-- <input type="hidden" name="data" value="LT_C_ADSIDO_INFO"> -->
		<input type="hidden" name="data" value="LT_C_ADEMD_INFO">
		<input type="hidden" name="geometry" value="true">
		<input type="hidden" name="attribute" value="true">
		<input type="hidden" name="crs" value="EPSG:4326">
	</form>
	
</div>
	

</body>
</html>