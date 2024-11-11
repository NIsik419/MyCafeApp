let map;
let openInfoWindow = null;
let markers = []; // Keep track of all markers


// 인포윈도우 내용 생성
function createInfoWindowContent(cafe) {
    const safeId = cafe.이름.replace(/[^a-zA-Z0-9]/g, '-');
    return `
        <div class="info-window-content" id="info-window-${safeId}" style="padding: 10px; max-width: 300px;">
            <h3 style="margin: 0 0 8px 0;">${cafe.이름}</h3>
            <p style="margin: 4px 0;">주소: ${cafe.도로명주소}</p>
            <p style="margin: 4px 0; max-height: 60px; overflow: hidden;">${cafe.부가설명}</p>
            ${cafe.상세페이지URL ? `
                <button class="visit-button" data-url="${cafe.상세페이지URL}"
                        style="margin-top: 8px; padding: 4px 8px; cursor: pointer; background-color: #4285f4; color: white; border: none; border-radius: 4px;">
                    상세 정보 보기
                </button>` : ''}
        </div>
    `;
}

// 카페 카드 생성
function createCafeCard(cafe) {
    const cafeCard = document.createElement("div");
    cafeCard.classList.add("cafe-card");
    cafeCard.setAttribute('data-cafe-id', cafe.이름.replace(/[^a-zA-Z0-9]/g, '-'));
    cafeCard.innerHTML = `
        <img src="${cafe.썸네일이미지URL}" alt="${cafe.이름}" onerror="this.src='image/placeholder.png'">
        <div class="cafe-info">
            <h3>${cafe.이름}</h3>
            <p>주소: ${cafe.도로명주소}</p>
            <p>${cafe.부가설명}</p>
        </div>
    `;
    return cafeCard;
}

// 마커와 인포윈도우 생성 및 이벤트 처리
function createMarkerAndInfoWindow(cafe, map) {
    // 마커 생성
    const marker = new google.maps.Marker({
        position: { lat: parseFloat(cafe.위도), lng: parseFloat(cafe.경도) },
        map: map,
        title: cafe.이름,
        animation: google.maps.Animation.DROP,
        optimized: false // Forces marker to be on top layer
    });

    // 인포윈도우 생성
    const infoWindow = new google.maps.InfoWindow({
        content: createInfoWindowContent(cafe),
        maxWidth: 300
    });

    // 마커 클릭 이벤트
    google.maps.event.addListener(marker, 'click', function() {
        console.log('Marker clicked:', cafe.이름); // Debugging
        if (openInfoWindow) {
            openInfoWindow.close();
        }
        infoWindow.open(map, marker);
        openInfoWindow = infoWindow;
        map.panTo(marker.getPosition());
    });

    // 인포윈도우가 열릴 때 이벤트
    google.maps.event.addListener(infoWindow, 'domready', function() {
        console.log('InfoWindow ready:', cafe.이름); // Debugging
        const visitButtons = document.getElementsByClassName('visit-button');
        Array.from(visitButtons).forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const url = button.getAttribute('data-url');
                if (url) {
                    window.open(url, '_blank');
                }
            });
        });
    });

    return { marker, infoWindow };
}

// 카페를 지도에 추가하는 함수
function addCafeToMap(cafe, map) {
    const { marker, infoWindow } = createMarkerAndInfoWindow(cafe, map);
    const cafeCard = createCafeCard(cafe);

    // 카페 카드 클릭 이벤트
    cafeCard.addEventListener('click', function() {
        console.log('Card clicked:', cafe.이름); // Debugging
        if (openInfoWindow) {
            openInfoWindow.close();
        }
        infoWindow.open(map, marker);
        openInfoWindow = infoWindow;
        map.panTo(marker.getPosition());

        // 모바일에서 지도로 스크롤
        if (window.innerWidth < 768) {
            document.getElementById('map').scrollIntoView({ 
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    });

    return { marker, cafeCard };
}

// 지도 초기화
async function initMap() {
    console.log('Initializing map...'); // Debugging

    const mapOptions = {
        center: { lat: 37.6232666, lng: 127.0786027 },
        zoom: 17,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        clickableIcons: false // Prevent clicks on POIs
    };

    try {
        map = new google.maps.Map(document.getElementById("map"), mapOptions);
        console.log('Map created successfully'); // Debugging

        const response = await fetch('cafes.json');
        const cafes = await response.json();
        console.log('Loaded', cafes.length, 'cafes'); // Debugging

        const listContainer = document.getElementById('recommendation-list');
        listContainer.innerHTML = '';

        cafes.forEach(cafe => {
            const { marker, cafeCard } = addCafeToMap(cafe, map);
            markers.push(marker);
            listContainer.appendChild(cafeCard);
        });

    } catch (error) {
        console.error("Error initializing map:", error);
        document.getElementById('recommendation-list').innerHTML = 
            '<p>카페 데이터를 불러오는 중 오류가 발생했습니다.</p>';
    }
}

// 전역 함수로 등록
window.initMap = initMap;
