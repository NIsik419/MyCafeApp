const cafes = [
    {
        "이름": "미 피아체",
        "평점": 4.0,
        "지역": "청담동",
        "인기메뉴": "런치 코스, 디너 코스",
        "리뷰수": 36455,
        "찜수": 99,
        "전화수": 164,
        "이미지": "image1.jpg"
    },
    {
        "이름": "파볼라",
        "평점": 4.9,
        "지역": "청담동",
        "인기메뉴": "Cold 구수체, Cold 부채페펜",
        "리뷰수": 16665,
        "찜수": 25,
        "전화수": 27,
        "이미지": "image2.jpg"
    },
    {
        "이름": "권숙수",
        "평점": 4.2,
        "지역": "청담동",
        "인기메뉴": "점심미식상, 저녁미식상",
        "리뷰수": 42282,
        "찜수": 130,
        "전화수": 166,
        "이미지": "image3.jpg"
    }
    
];

// 슬라이더 요소 가져오기
const slider = document.getElementById('cafe-slider');

// 카페 카드 생성 및 추가
cafes.forEach(cafe => {
    const cafeCard = document.createElement('div');
    cafeCard.classList.add('cafe-card');
    cafeCard.innerHTML = `
        <img src="${cafe.이미지}" alt="${cafe.이름}" onerror="this.src='image/placeholder.png'">
        <div class="cafe-info">
            <h3>${cafe.이름}</h3>
            <p class="rating">${cafe.평점} ⭐</p>
            <p>${cafe.지역}</p>
            <p class="popular-menu">인기 메뉴: ${cafe.인기메뉴}</p>
            <div class="icon-container">
                <span>👁 ${cafe.리뷰수}</span>
                <span>❤️ ${cafe.찜수}</span>
                <span>📞 ${cafe.전화수}</span>
            </div>
        </div>
    `;
    slider.appendChild(cafeCard);
});

// 슬라이더 좌우 스크롤 함수
function scrollLeft() {
    slider.scrollBy({ left: -300, behavior: 'smooth' });
}

function scrollRight() {
    slider.scrollBy({ left: 500, behavior: 'smooth' });
}


let selectedKeywords = [];
let keywordsData = {}; // 키워드 데이터를 저장할 객체

// 키워드 버튼 클릭 이벤트
document.querySelectorAll('.keyword-button').forEach(button => {
    button.addEventListener('click', () => {
        const keyword = button.getAttribute('data-keyword');
        if (selectedKeywords.includes(keyword)) {
            selectedKeywords = selectedKeywords.filter(kw => kw !== keyword);
            button.classList.remove('selected');
        } else {
            selectedKeywords.push(keyword);
            button.classList.add('selected');
        }
        document.getElementById('confirm-keywords').disabled = selectedKeywords.length === 0;
    });
});

// 키워드 확인 버튼 클릭 이벤트
document.getElementById('confirm-keywords').addEventListener('click', async () => {
    localStorage.setItem('preferredKeywords', JSON.stringify(selectedKeywords));
    await displayRecommendations(selectedKeywords);
    document.getElementById('keyword-modal').style.display = 'none';
});

async function displayRecommendations(keywords) {
    try {
        const response = await fetch('cafes.json'); // 카페 데이터 가져오기
        const cafes = await response.json();

        // 선택된 키워드 기반으로 카페 필터링
        const filteredCafes = cafes.filter(cafe => {
            const cafeId = cafe.이름; // 카페 ID와 JSON 데이터에서의 ID 매칭
            const cafeKeywords = keywordsData[cafeId] || []; // 키워드 가져오기
            return keywords.some(keyword => cafeKeywords.includes(keyword)); // 키워드 비교
        });

        const listContainer = document.getElementById('recommendation-list');
        listContainer.innerHTML = ''; // 기존 추천 목록 제거

        if (filteredCafes.length > 0) {
            filteredCafes.forEach(cafe => {
                const cafeCard = createCafeCard(cafe); // 카페 카드 생성
                listContainer.appendChild(cafeCard); // 추천 목록에 추가
            });
        } else {
            listContainer.innerHTML = '<p>선택한 키워드에 맞는 추천 카페가 없습니다.</p>';
        }
    } catch (error) {
        console.error("추천 목록을 불러오는 중 오류가 발생했습니다:", error);
    }
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

// 키워드 데이터 로드
async function loadKeywords() {
    try {
        const response = await fetch('keywords.json');
        const keywords = await response.json();

        keywords.forEach(keyword => {
            keywordsData[keyword.cafeName] = keyword.keywords;
        });
    } catch (error) {
        console.error("키워드 데이터를 불러오는 중 오류가 발생했습니다:", error);
    }
}

// 페이지 로드 시 모달 표시
window.onload = async () => {
    await loadKeywords();
    document.getElementById('keyword-modal').style.display = 'flex';
};
