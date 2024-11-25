// JSON 데이터에서 카페 정보를 불러와 카페 카드 생성
async function loadCafesData() {
    try {
        const response = await fetch('cafes.json');
        const cafesData = await response.json();

        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = ''; // 기존 결과 초기화

        cafesData.forEach(cafe => {
            const cafeCard = createCafeCard(cafe);
            resultsContainer.appendChild(cafeCard);
        });
    } catch (error) {
        console.error("카페 데이터를 불러오는 중 오류 발생:", error);
    }
}

// 카페 카드 생성 함수 (키워드 추가)
function createCafeCard(cafe) {
    console.log('Creating card for:', cafe["0"]);

    const cafeCard = document.createElement("div");
    cafeCard.classList.add("cafe-card");

    // 키워드 박스를 생성
    const keywordBox = createKeywordBox(cafe);

    // 카페 카드 내용 생성
    cafeCard.innerHTML = `
        <img src="${cafe.썸네일이미지URL || 'image/placeholder.png'}" alt="${cafe["0"]}" onerror="this.src='image/placeholder.png'">
        <div class="cafe-info">
            <div class="cafe-header">
                <h3>${cafe["0"]}</h3>
                <div class="keyword-box">${keywordBox}</div>
            </div>
            <p>주소: ${cafe.도로명주소 || "주소 정보 없음"}</p>
            <p>${cafe.부가설명 || "설명 없음"}</p>
        </div>
    `;

    return cafeCard;
}

// 키워드 박스 생성 함수
function createKeywordBox(cafe) {
    const keyword = cafe["1"]; // JSON에서 키워드 추출

    // 키워드가 없으면 빈 문자열 반환
    if (!keyword) return '';

    // 키워드 버튼 생성
    return `<button class="keyword-button">${keyword}</button>`;
}

// 페이지 로드 시 데이터 로드
window.onload = loadCafesData;
