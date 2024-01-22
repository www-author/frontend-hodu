let mapContainer = document.getElementById('map'),
    mapOption = {
        center: new kakao.maps.LatLng(37.481239, 126.952748),
        level: 3
    };

let iwContent = `<div style="padding:15px;">호두네 동네 🐈</div>`,
    iwPosition = new kakao.maps.LatLng(37.481239, 126.952748),
    iwRemoveable = true;

let infowindow = new kakao.maps.InfoWindow({
    map: new kakao.maps.Map(mapContainer, mapOption),
    position : iwPosition,
    content : iwContent,
    removable : iwRemoveable
});