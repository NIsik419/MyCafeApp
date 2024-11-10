async function searchCafes(event) {
    event.preventDefault();  // 폼 제출 기본 동작 막기

    const query = document.getElementById('searchInput').value.toLowerCase();  // 검색어
    const response = await fetch('cafes.json');  // 카페 데이터 JSON 파일 가져오기
    const cafes = await response.json();  // JSON 파싱
    const listContainer = document.getElementById('recommendation-list');  // 추천 리스트 컨테이너

    // 검색된 결과만 필터링
    const filteredCafes = cafes.filter(cafe => {
        return cafe.이름.toLowerCase().includes(query) ||
               cafe.카테고리.toLowerCase().includes(query) ||
               cafe.도로명주소.toLowerCase().includes(query) ||
               cafe.부가설명.toLowerCase().includes(query);
    });

    // 필터링된 카페 목록 출력
    listContainer.innerHTML = '';  // 기존 리스트 초기화
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
            listContainer.appendChild(cafeCard);
        });
    } else {
        listContainer.innerHTML = '<p>검색된 결과가 없습니다.</p>';
    }
    window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
}

// 검색 버튼 클릭 시 동작
document.querySelector('.search-form').addEventListener('submit', searchCafes);