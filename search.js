    document.addEventListener('DOMContentLoaded', () => {
        fetch('navbar.html')  // navbar.html 파일을 불러옵니다.
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar').innerHTML = data;
        })
        .catch(error => console.error('네비게이션 바를 불러오는 중 오류 발생:', error));
        loadSearchResults(); // DOM이 완전히 로드된 후에 실행
    });
        
    
    
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q')?.trim();  // 검색어 가져오기
    let map;
    let openInfoWindow = null;

    // 구글 맵 초기화 함수
    function initMap() {
        const mapOptions = {
            center: { lat: 37.6232666, lng: 127.0786027 },
            zoom: 17
        };

        map = new google.maps.Map(document.getElementById('map'), mapOptions);
    }
    

    // 검색 결과 로드 함수
    async function loadSearchResults() {
        try {
            console.log('Fetching cafes.json...');
            const response = await fetch('cafes.json');
            console.log('Response status:', response.status);
    
            if (!response.ok) {
                throw new Error('Failed to fetch cafes.json');
            }
    
            const cafes = await response.json();
            console.log('Cafes data:', cafes);
    
            if (!query) {
                document.getElementById('search-results').innerHTML = "<p>검색어가 없습니다.</p>";
                return;
            }
    
            const filteredCafes = cafes.filter(cafe => {
                return (
                    (cafe.이름 && cafe.이름.toLowerCase().includes(query.toLowerCase())) ||
                    (cafe.카테고리 && cafe.카테고리.toLowerCase().includes(query.toLowerCase())) ||
                    (cafe.도로명주소 && cafe.도로명주소.toLowerCase().includes(query.toLowerCase())) ||
                    (cafe.부가설명 && cafe.부가설명.toLowerCase().includes(query.toLowerCase()))
                );
            });
    
            const resultsContainer = document.getElementById('search-results');
            if (filteredCafes.length > 0) {
                resultsContainer.innerHTML = ''; // 기존 내용 제거
                filteredCafes.forEach(cafe => {
                    const cafeCard = document.createElement("div");
                    cafeCard.classList.add("cafe-card");
                    cafeCard.innerHTML = `
                        <img src="${cafe.썸네일이미지URL}" alt="${cafe.이름}">
                        <div class="cafe-info">
                            <h3>${cafe.이름}</h3>
                            <p>주소: ${cafe.도로명주소}</p>
                            <p>사장님 소개: ${cafe.부가설명}</p>
                        </div>
                    `;
                    resultsContainer.appendChild(cafeCard);
    
                    cafeCard.addEventListener('click', () => {
                        const cafePosition = { lat: cafe.위도, lng: cafe.경도 };
                        map.panTo(cafePosition);
                        map.setZoom(16);
    
                        const marker = new google.maps.Marker({
                            position: cafePosition,
                            map: map,
                            title: cafe.이름
                        });
    
                        const infoWindow = new google.maps.InfoWindow({
                            content: `<div><strong>${cafe.이름}</strong><br>주소: ${cafe.도로명주소}<br>사장님 소개: ${cafe.부가설명}</div>`
                        });
    
                        if (openInfoWindow) {
                            openInfoWindow.close();
                        }
                        infoWindow.open(map, marker);
                        openInfoWindow = infoWindow;
                    });
                });
            } else {
                resultsContainer.innerHTML = '<p>검색된 결과가 없습니다.</p>';
            }
        } catch (error) {
            console.error("검색 결과를 불러오는 중 오류가 발생했습니다:", error);
        }
    }

    //loadSearchResults();  // 페이지 로드 시 검색 결과 로드