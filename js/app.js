let map;
let openInfoWindow = null;
let markers = [];
let activeMarker = null;
let keywordsData = {}; // 키워드를 저장할 객체

// 지도 초기화 함수
async function initMap() {
    const mapOptions = {
        center: { lat: 37.6232666, lng: 127.0786027 },
        zoom: 17
    };

    try {
        // 지도 생성
        map = new google.maps.Map(document.getElementById("map"), mapOptions);

        // 키워드와 카페 데이터를 비동기로 불러오기
        await loadKeywords();
        await loadCafes();

        // 목록 표시
        document.getElementById('recommendation-list').style.display = 'block';
    } catch (error) {
        console.error("Error initializing map:", error);
        document.getElementById('recommendation-list').innerHTML = '<p>카페 데이터를 불러오는 중 오류가 발생했습니다.</p>';
    }
}


// 키워드 데이터 불러오기
async function loadKeywords() {
    try {
        const response = await fetch('keyword.json');
        const keywords = await response.json();

        // 키워드 데이터를 카페 이름을 기준으로 저장
        keywords.forEach(keyword => {
            const cafeName = keyword["0"];
            const keywordText = keyword["1"];
            keywordsData[cafeName] = keywordText;
        });

        console.log('Loaded keywords:', keywordsData);
    } catch (error) {
        console.error("Error loading keywords:", error);
    }
}

// 카페 데이터 불러오기
async function loadCafes() {
    try {
        const response = await fetch('cafes.json');
        const cafes = await response.json();

        const listContainer = document.getElementById('recommendation-list');
        listContainer.style.display = 'block'; // 목록을 항상 표시
        listContainer.innerHTML = ''; // 기존 내용 초기화

        cafes.forEach(cafe => {
            const { marker, cafeCard } = addCafeToMap(cafe);
            markers.push(marker);
            listContainer.appendChild(cafeCard);
        });

    } catch (error) {
        console.error("Error loading cafes:", error);
    }
    window.onload = () => {
        document.getElementById('recommendation-list').style.display = 'block'; // 목록 항상 표시
        initMap();
}
}

// 카페를 지도에 추가하고 카드 생성
function addCafeToMap(cafe) {
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

    marker.addListener('click', () => {
        handleMarkerClick(marker, infoWindow, cafe);
    });

    const cafeCard = createCafeCard(cafe);
    cafeCard.addEventListener('click', () => {
        handleMarkerClick(marker, infoWindow, cafe);
        if (window.innerWidth < 768) {
            document.getElementById('map').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });

    return { marker, cafeCard };
}

// 마커 클릭 핸들러
function handleMarkerClick(marker, infoWindow, cafe) {
    if (openInfoWindow) openInfoWindow.close();
    infoWindow.open(map, marker);
    openInfoWindow = infoWindow;
    map.panTo(marker.getPosition());
}

// 인포윈도우 콘텐츠 생성
function createInfoWindowContent(cafe) {
    const keyword = keywordsData[cafe.이름] || "키워드 없음";
    return `
     <img src="${cafe.썸네일이미지URL || 'image/placeholder.png'}" alt="${cafe.이름}" style="width: 100%; height: 150px; object-fit: cover;">

        <div style="padding: 12px;">
            <h3>${cafe.이름}</h3>
            <p>주소: ${cafe.도로명주소}</p>
            <p style="
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                white-space: normal;
            ">
                ${cafe.부가설명|| "설명없음"}</p>
            <a href="${cafe.홈페이지URL || cafe.상세페이지URL||'#'}" target="_blank" 
               style="
                   display: inline-block; 
                   margin-top: 10px; 
                   padding: 4px 12px; 
                   background-color: #007bff; 
                   color: #fff; 
                   text-decoration: none; 
                   border-radius: 4px; 
                   font-size: 16px;
               ">
               상세페이지 열기
            </a>
        </div>
    `;
}


// 카페 카드 생성 함수
// 카페 카드 생성 함수
function createCafeCard(cafe) {
    const cafeCard = document.createElement("div");
    cafeCard.classList.add("cafe-card");

    // 키워드 박스 생성 (최대 2개만 표시)
    const keywordBox = createKeywordBox(cafe);

    // 카페 카드 내용 생성
    cafeCard.innerHTML = `
        <div class="cafe-header">
            <h3>${cafe.이름}</h3>
            <div class="keyword-box">${keywordBox}</div>
        </div>
        <img src="${cafe.썸네일이미지URL || 'image/placeholder.png'}" alt="${cafe.이름}" class="cafe-image" onerror="this.src='image/placeholder.png'">
        <div class="cafe-info">
            <p>주소: ${cafe.도로명주소 || "주소 정보 없음"}</p>
            <p>${cafe.부가설명 || "설명 없음"}</p>
        </div>
    `;
    return cafeCard;
}

// 키워드 박스 생성 함수 (최대 2개 표시)
function createKeywordBox(cafe) {
    const keyword = keywordsData[cafe.이름] || "";
    if (!keyword) return '';

    // 키워드를 쉼표로 구분하고 최대 2개만 표시
    const keywordsArray = keyword.split(',').map(kw => kw.trim()).slice(0, 2);
    return keywordsArray.map(kw => `<button class="keyword-button">${kw}</button>`).join(' ');
}

// 페이지 로드 시 지도 초기화
window.onload = () => {
    initMap();
};
