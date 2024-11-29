document.addEventListener('DOMContentLoaded', () => {
    fetch('navbar.html') // navbar.html 파일을 불러옵니다.
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar').innerHTML = data;
        })
        .catch(error => console.error('네비게이션 바를 불러오는 중 오류 발생:', error));

    const query = new URLSearchParams(window.location.search).get('q')?.trim() || null; // 쿼리 가져오기
    console.log("Query:", query);

    if (query) {
        initMap(); // 구글 맵 초기화
        loadSearchResults(query); // 검색 결과 로드
    } else {
        document.getElementById('search-results').innerHTML = "<p>검색어를 입력하세요.</p>";
    }
});

let map;
let openInfoWindow = null; // 열린 인포윈도우 참조
let markers = [];

// 지도 초기화 함수
function initMap() {
    const mapOptions = {
        center: { lat: 37.6232666, lng: 127.0786027 },
        zoom: 16
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);
}
function searchCafes(event) {
    event.preventDefault(); // 기본 폼 제출 방지

    const queryInput = document.getElementById("searchInput");
    if (!queryInput) {
        console.error("검색 입력 필드(#searchInput)를 찾을 수 없습니다.");
        return;
    }

    const query = queryInput.value.trim();
    if (query) {
        console.log("Search Query:", query);
        window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
    } else {
        alert("검색어를 입력하세요.");
    }
}


async function loadSearchResults(query) {
    try {
        console.log('Fetching cafes.json...');
        const response = await fetch('cafes.json');
        if (!response.ok) throw new Error('Failed to fetch cafes.json');

        const cafes = await response.json();
        const filteredCafes = cafes.filter(cafe => {
            return (
                (cafe.이름 && cafe.이름.toLowerCase().includes(query.toLowerCase())) ||
                (cafe.카테고리 && cafe.카테고리.toLowerCase().includes(query.toLowerCase())) ||
                (cafe.도로명주소 && cafe.도로명주소.toLowerCase().includes(query.toLowerCase())) ||
                (cafe.부가설명 && cafe.부가설명.toLowerCase().includes(query.toLowerCase()))
            );
        });

        // 이름을 기준으로 우선순위 정렬
        filteredCafes.sort((a, b) => {
            const nameMatchA = a.이름?.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
            const nameMatchB = b.이름?.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
            return nameMatchB - nameMatchA; // 이름 일치 여부로 우선순위
        });

        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = ''; // 기존 내용 제거

        if (filteredCafes.length > 0) {
            filteredCafes.forEach(cafe => {
                const { marker, cafeCard } = addCafeToMap(cafe);
                markers.push(marker);
                resultsContainer.appendChild(cafeCard);
            });
        } else {
            resultsContainer.innerHTML = '<p>검색된 결과가 없습니다.</p>';
        }
    } catch (error) {
        console.error("검색 결과를 불러오는 중 오류가 발생했습니다:", error);
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
        handleMarkerClick(marker, infoWindow);
    });

    const cafeCard = createCafeCard(cafe);
    cafeCard.addEventListener('click', () => {
        handleMarkerClick(marker, infoWindow);
        if (window.innerWidth < 768) {
            document.getElementById('map').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });

    return { marker, cafeCard };
}

// 마커 클릭 핸들러
function handleMarkerClick(marker, infoWindow) {
    if (openInfoWindow) openInfoWindow.close(); // 기존 열린 인포윈도우 닫기
    infoWindow.open(map, marker);
    openInfoWindow = infoWindow;
    map.panTo(marker.getPosition()); // 마커 위치로 맵 이동
}

// 인포윈도우 콘텐츠 생성
function createInfoWindowContent(cafe) {
    return `
    <img src="${cafe.썸네일이미지URL || 'image/placeholder.png'}" alt="${cafe.이름}" style="width: 100%; height: 150px; object-fit: cover;">
        <div style="padding: 12px;">
            <h3>${cafe.이름}</h3>
            <p>주소: ${cafe.도로명주소 || "주소 정보 없음"}</p>
            <p style="
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                white-space: normal;
            ">
                ${cafe.부가설명 || "설명 없음"}
            </p>
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
function createCafeCard(cafe) {
    const cafeCard = document.createElement("div");
    cafeCard.classList.add("cafe-card");

    cafeCard.innerHTML = `
        <img src="${cafe.썸네일이미지URL || 'image/placeholder.png'}" alt="${cafe.이름}" onerror="this.src='image/placeholder.png'">
        <div class="cafe-info">
            <h3>${cafe.이름}</h3>
            <p>주소: ${cafe.도로명주소 || "주소 정보 없음"}</p>
            <p>${cafe.부가설명 || "설명 없음"}</p>
        </div>
    `;
    return cafeCard;
}
