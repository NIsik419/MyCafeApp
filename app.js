let map;
let openInfoWindow = null;

// 구글 지도 초기화 함수
function initMap() {
    // 지도 옵션 설정
    const mapOptions = {
        center: { lat: 37.6232666, lng: 127.0786027 },
        zoom: 17
    };

    // 구글 지도 생성
    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // 카페 데이터 로드 및 마커 추가 함수 호출
    loadCafes();
}

// 카페 데이터를 불러오고 마커 및 추천 카드 생성 함수
async function loadCafes() {
    try {
        // JSON 파일에서 카페 데이터 불러오기
        const response = await fetch('cafes.json');
        const cafes = await response.json();
        const listContainer = document.getElementById('recommendation-list');

        // 키워드 데이터 불러오기 및 그룹화
        const keywordResponse = await fetch('keyword.json');
        const keywordData = await keywordResponse.json();
        const transformedData = keywordData.map(item => ({
            cafename: item["0"],
            keyword: item["1"],
            frequency: item["2"]
        }));

        // 카페 이름별 키워드 그룹핑
        const groupedKeywords = transformedData.reduce((acc, { cafename, keyword, frequency }) => {
            if (!acc[cafename]) acc[cafename] = [];
            acc[cafename].push({ keyword, frequency });
            return acc;
        }, {});

        cafes.forEach(cafe => {
            // 각 카페 위치에 마커 추가
            const marker = new google.maps.Marker({
                position: { lat: cafe.위도, lng: cafe.경도 },
                map: map,
                title: cafe.이름
            });

            // 각 마커에 인포윈도우 추가
            const infoWindow = new google.maps.InfoWindow({
                content: `<div><strong>${cafe.이름}</strong><br>주소: ${cafe.도로명주소}<br>평점: ${cafe.rating} ★</div>`
            });

            // 마커 클릭 시 인포윈도우 표시
            marker.addListener('click', () => {
                if (openInfoWindow) {
                    openInfoWindow.close(); // 이전 인포윈도우 닫기
                }
                infoWindow.open(map, marker); // 현재 마커의 인포윈도우 열기
                openInfoWindow = infoWindow; // 열려 있는 인포윈도우 업데이트
            });

            // 각 카페 카드 생성
            const cafeCard = document.createElement('div');
            cafeCard.classList.add('cafe-card');

            // 키워드 박스 생성 (frequency가 높은 순으로 최대 3개 표시)
            const keywords = groupedKeywords[cafe.이름] || [];
            const sortedKeywords = keywords.sort((a, b) => b.frequency - a.frequency).slice(0, 3);
            const keywordHTML = sortedKeywords.map(({ keyword }) => `
                <div class="keyword">${keyword}</div>
            `).join('');

            // 카페 카드 내용 설정
            cafeCard.innerHTML = `
                <img src="${cafe.썸네일이미지URL}" alt="${cafe.이름}">
                <div class="cafe-info">
                    <h3>${cafe.이름}</h3>
                    <p>주소: ${cafe.도로명주소}</p>
                    <p>" ${cafe.부가설명}"</p>
                    <div class="keyword-box">
                        ${keywordHTML}
                    </div>
                </div>
            `;

            // 카드 클릭 시 해당 마커 위치로 지도 이동 및 인포윈도우 열기
            cafeCard.addEventListener('click', () => {
                map.panTo(marker.getPosition());
                if (openInfoWindow) openInfoWindow.close();
                infoWindow.open(map, marker);
                openInfoWindow = infoWindow;
            });

            // 리스트 컨테이너에 카드 추가
            listContainer.appendChild(cafeCard);
        });
    } catch (error) {
        console.error("카페 데이터를 불러오는 중 오류가 발생했습니다:", error);
    }
}

// initMap 함수를 전역으로 등록
window.initMap = initMap;
