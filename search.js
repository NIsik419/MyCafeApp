fetch('navbar.html')  // navbar.html 파일을 불러옵니다.
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar').innerHTML = data;
        })
        .catch(error => console.error('네비게이션 바를 불러오는 중 오류 발생:', error));
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');  // 검색어 가져오기
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
            const response = await fetch('cafes.json');  // 카페 데이터 로드
            const cafes = await response.json();

            // 쿼리가 없다면 검색 결과를 표시하지 않고 메시지를 출력
            if (!query) {
                document.getElementById('search-results').innerHTML = "<p>검색어가 없습니다.</p>";
                return;  // 함수 종료
            }

            // 검색 결과 필터링
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

                    // 검색된 카페 카드 클릭 시 해당 위치로 맵 이동
                    cafeCard.addEventListener('click', () => {
                        const cafePosition = { lat: cafe.위도, lng: cafe.경도 };
                        map.panTo(cafePosition); // 해당 위치로 지도 이동
                        map.setZoom(17); // 줌 레벨 설정

                        // 해당 위치에 마커와 인포윈도우 표시
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
                        openInfoWindow = infoWindow; // 열려 있는 인포윈도우 업데이트
                    });
                });
            } else {
                resultsContainer.innerHTML = '<p>검색된 결과가 없습니다.</p>';
            }
        } catch (error) {
            console.error("검색 결과를 불러오는 중 오류가 발생했습니다:", error);
        }
    }

    loadSearchResults();  // 페이지 로드 시 검색 결과 로드