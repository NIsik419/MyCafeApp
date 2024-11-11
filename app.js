let map;
let openInfoWindow = null;
let markers = [];
let activeMarker = null;

// 인포윈도우 생성 함수
function createInfoWindowContent(cafe) {
    const safeId = cafe.이름.replace(/[^a-zA-Z0-9]/g, '-');
    console.log('Creating InfoWindow content for:', cafe.이름);
    return `
        <div class="info-window-content" id="info-window-${safeId}">
            <div style="padding: 12px; max-width: 300px;">
                <h3>${cafe.이름}</h3>
                <p>주소: ${cafe.도로명주소}</p>
                <p>${cafe.부가설명}</p>
                ${cafe.상세페이지URL ? `
                    <a href="${cafe.상세페이지URL}" 
                       target="_blank" 
                       style="display: inline-block; margin-top: 8px; padding: 8px 16px; 
                              background-color: #4285f4; color: white; text-decoration: none; 
                              border-radius: 4px;">
                        상세 페이지 보기
                    </a>` : ''}
            </div>
        </div>
    `;
}

// 카페 카드 생성 함수
function createCafeCard(cafe) {
    console.log('Creating card for:', cafe.이름);
    const cafeCard = document.createElement("div");
    cafeCard.classList.add("cafe-card");
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

// 마커 클릭 핸들러
function handleMarkerClick(marker, infoWindow, cafe) {
    console.log('Marker clicked for:', cafe.이름);
    if (openInfoWindow) {
        openInfoWindow.close();
    }
    infoWindow.open(map, marker);
    openInfoWindow = infoWindow;
    map.panTo(marker.getPosition());
}

// 카페를 지도에 추가
function addCafeToMap(cafe) {
    console.log('Adding cafe to map:', cafe.이름);

    const marker = new google.maps.Marker({
        position: { lat: parseFloat(cafe.위도), lng: parseFloat(cafe.경도) },
        map: map,
        title: cafe.이름,
        animation: google.maps.Animation.DROP
    });

    const infoWindow = new google.maps.InfoWindow({
        content: createInfoWindowContent(cafe),
        maxWidth: 300
    });

    // 마커 클릭 이벤트 추가
    marker.addListener('click', () => {
        console.log('Marker click event triggered for:', cafe.이름);
        handleMarkerClick(marker, infoWindow, cafe);
    });

    // 카페 카드 생성 및 클릭 이벤트 추가
    const cafeCard = createCafeCard(cafe);
    cafeCard.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Card clicked for:', cafe.이름);
        handleMarkerClick(marker, infoWindow, cafe);
        if (window.innerWidth < 768) {
            document.getElementById('map').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });

    return { marker, cafeCard };
}

// 추천 목록을 열고 닫는 토글 함수
function toggleRecommendationList() {
    const recommendationSection = document.getElementById('cafe-list');
    const toggleButton = document.getElementById('toggle-button');
    
    if (recommendationSection.style.display === 'block') {
        recommendationSection.style.display = 'none';
        toggleButton.textContent = '추천 목록 보기';
    } else {
        recommendationSection.style.display = 'block';
        toggleButton.textContent = '목록 닫기';
    }
}

// 지도 초기화 함수
async function initMap() {
    console.log('Initializing map...');

    const mapOptions = {
        center: { lat: 37.6232666, lng: 127.0786027 },
        zoom: 17
    };

    try {
        map = new google.maps.Map(document.getElementById("map"), mapOptions);
        console.log('Map initialized successfully');

        const response = await fetch('cafes.json');
        const cafes = await response.json();
        console.log('Loaded cafes:', cafes);

        const listContainer = document.getElementById('recommendation-list');
        listContainer.innerHTML = '';

        cafes.forEach(cafe => {
            const { marker, cafeCard } = addCafeToMap(cafe);
            markers.push(marker);
            listContainer.appendChild(cafeCard);
        });

    } catch (error) {
        console.error("Error initializing map:", error);
        document.getElementById('recommendation-list').innerHTML = '<p>카페 데이터를 불러오는 중 오류가 발생했습니다.</p>';
    }
}

// 페이지 로드 시 추천 목록이 기본적으로 표시되도록 설정
window.onload = () => {
    document.getElementById('cafe-list').style.display = 'block';
};

// 전역으로 initMap 함수 등록
window.initMap = initMap;
