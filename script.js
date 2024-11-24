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
  let keywordsData = {}; // 키워드 데이터를 카페 ID를 기준으로 저장
  let cafesData = []; // 카페 데이터

  async function loadData() {
    try {
        const [keywordResponse, cafesResponse] = await Promise.all([
            fetch('keyword.json'), // 키워드 데이터
            fetch('cafes.json') // 카페 데이터
        ]);

        const keywords = await keywordResponse.json();
        const cafes = await cafesResponse.json();

        // 키워드 매핑
        keywords.forEach(keyword => {
            const cafeId = keyword["0"]; // 카페 ID
            const keywordText = keyword["1"]; // 키워드 텍스트

            if (!keywordsData[cafeId]) {
                keywordsData[cafeId] = [];
            }
            keywordsData[cafeId].push(keywordText); // 키워드 추가
        });

        cafesData = cafes; // 카페 데이터 저장
        console.log("Keywords Data:", keywordsData);
        console.log("Cafes Data:", cafesData);
    } catch (error) {
        console.error("데이터를 불러오는 중 오류 발생:", error);
    }
}

loadData(); // 데이터 로드

// 키워드 버튼 이벤트
function setupKeywordButtons() {
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
            console.log("Selected Keywords:", selectedKeywords); // 디버깅
            document.getElementById('confirm-keywords').disabled = selectedKeywords.length === 0;
        });
    });
}

// 키워드 확인 버튼 클릭 이벤트
document.getElementById('confirm-keywords').addEventListener('click', () => {
    const filteredCafes = cafesData.filter(cafe => {
        const keywords = keywordsData[cafe.이름] || [];
        console.log("Checking Cafe:", cafe.이름, "Keywords:", keywords); // 디버깅
        return selectedKeywords.some(keyword => keywords.includes(keyword));
    });
    localStorage.setItem('preferredKeywords', JSON.stringify(selectedKeywords));
    console.log("Filtered Cafes for Recommendations:", filteredCafes); // 디버깅
    displayRecommendations(filteredCafes); // 필터링된 데이터 전달
    document.getElementById('keyword-modal').style.display = 'none'; // 모달 숨기기
});

// function ModalsearchCafes(event) {
//     event.preventDefault(); // 기본 폼 제출 방지

//     const query = document.getElementById("searchInput").value.trim().toLowerCase(); // 검색어
//     const selectedKeywordsLower = selectedKeywords.map(kw => kw.toLowerCase()); // 키워드 소문자 변환

//     // 필터링 조건
//     const filteredCafes = cafesData.filter(cafe => {
//         const keywords = keywordsData[cafe.이름] || []; // 카페와 연관된 키워드
//         const cafeKeywordsLower = keywords.map(kw => kw.toLowerCase());

//         // 검색어와 키워드가 포함된 카페 필터링
//         return (
//             (query && (
//                 cafe.이름.toLowerCase().includes(query) ||
//                 cafe.카테고리.toLowerCase().includes(query) ||
//                 cafe.도로명주소.toLowerCase().includes(query)
//             )) ||
//             selectedKeywordsLower.some(keyword => cafeKeywordsLower.includes(keyword))
//         );
//     });

//     console.log("Filtered Cafes:", filteredCafes);
//     renderRecommendations(filteredCafes); // 결과 렌더링
// }


function displayRecommendations(cafes) {
    const recommendationList = document.getElementById("recommendation-list");
    recommendationList.innerHTML = ""; // 기존 내용 초기화
    recommendationList.style.display = "flex"; // 가로 스크롤을 위해 flex 레이아웃
    recommendationList.style.overflowX = "auto"; // 가로 스크롤 활성화
    recommendationList.style.gap = "16px"; // 카드 간 간격
    recommendationList.style.padding = "54px"; // 좌우 여백 추가
    recommendationList.style.scrollBehavior = "smooth"; // 부드러운 스크롤

    if (cafes.length === 0) {
        recommendationList.innerHTML = "<p>추천 결과가 없습니다.</p>";
        return;
    }

    cafes.forEach(cafe => {
        const cafeCard = document.createElement("div");
        cafeCard.classList.add("cafe-card");
        cafeCard.style.flex = "0 0 auto"; // 카드가 고정된 너비로 정렬되도록 설정
        cafeCard.style.width = "250px"; // 카드 너비
        cafeCard.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)"; // 그림자 효과
        cafeCard.style.borderRadius = "8px"; // 둥근 모서리
        cafeCard.style.overflow = "hidden"; // 내용 넘칠 경우 숨김

        cafeCard.innerHTML = `
            <img src="${cafe.썸네일이미지URL || 'image/placeholder.png'}" alt="${cafe.이름}" style="width: 100%; height: 150px; object-fit: cover;">
            <div class="cafe-info" style="padding: 8px; text-align: center;">
                <h3 style="margin: 8px 0;">${cafe.이름}</h3>
                <p style="font-size: 14px; color: #555;">${cafe.도로명주소 || "주소 없음"}</p>
                <p style="font-size: 13px; color: #999;">카테고리: ${cafe.카테고리 || "카테고리 없음"}</p>
            </div>
        `;
        recommendationList.appendChild(cafeCard);
    });

    // 좌우 스크롤 버튼 추가
    addScrollButtons(recommendationList);
}
function addScrollButtons(container) {
    const leftButton = document.createElement("button");
    leftButton.innerHTML = "&#9664;"; // ◄ 버튼
    Object.assign(leftButton.style, {
        position: "absolute",
        left: "10px", // 약간 안쪽으로 위치
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: "1000",
        background: "rgba(0, 123, 255, 0.8)", // 투명한 파란색 배경
        color: "#fff",
        border: "none",
        borderRadius: "50%",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)", // 그림자 추가
        padding: "12px 18px",
        cursor: "pointer",
        transition: "background 0.3s, transform 0.3s", // 호버 및 클릭 효과
    });

    leftButton.addEventListener("mouseover", () => {
        leftButton.style.background = "#0056b3"; // 진한 파란색으로 변경
    });
    leftButton.addEventListener("mouseout", () => {
        leftButton.style.background = "rgba(0, 123, 255, 0.8)";
    });

    const rightButton = document.createElement("button");
    rightButton.innerHTML = "&#9654;"; // ► 버튼
    Object.assign(rightButton.style, {
        position: "absolute",
        right: "10px", // 약간 안쪽으로 위치
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: "1000",
        background: "rgba(0, 123, 255, 0.8)", // 투명한 파란색 배경
        color: "#fff",
        border: "none",
        borderRadius: "50%",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)", // 그림자 추가
        padding: "12px 18px",
        cursor: "pointer",
        transition: "background 0.3s, transform 0.3s", // 호버 및 클릭 효과
    });

    rightButton.addEventListener("mouseover", () => {
        rightButton.style.background = "#0056b3"; // 진한 파란색으로 변경
    });
    rightButton.addEventListener("mouseout", () => {
        rightButton.style.background = "rgba(0, 123, 255, 0.8)";
    });

    // 클릭 시 살짝 눌리는 효과
    [leftButton, rightButton].forEach(button => {
        button.addEventListener("mousedown", () => {
            button.style.transform = "translateY(-50%) scale(0.9)"; // 작아짐
        });
        button.addEventListener("mouseup", () => {
            button.style.transform = "translateY(-50%) scale(1)"; // 원래 크기로
        });
    });

    // 스크롤 이벤트 추가
    leftButton.addEventListener("click", () => {
        container.scrollBy({ left: -300, behavior: "smooth" });
    });

    rightButton.addEventListener("click", () => {
        container.scrollBy({ left: 300, behavior: "smooth" });
    });

    // 컨테이너에 버튼 추가
    container.parentElement.appendChild(leftButton);
    container.parentElement.appendChild(rightButton);
}



// 페이지 로드 시 실행
window.addEventListener('DOMContentLoaded', async () => {
    await loadData(); // 데이터 로드
    setupKeywordButtons(); // 키워드 버튼 이벤트 연결
    document.getElementById('keyword-modal').style.display = 'flex'; // 모달 표시
});



// // 카페 카드 생성 함수
// function createCafeCard(cafe) {
//     const cafeCard = document.createElement("div");
//     cafeCard.classList.add("cafe-card");
//     cafeCard.innerHTML = `
//         <img src="${cafe.썸네일이미지URL || 'image/placeholder.png'}" alt="${cafe.이름}" onerror="this.src='image/placeholder.png'">
//         <div class="cafe-info">
//             <h3>${cafe.이름}</h3>
//             <p>주소: ${cafe.도로명주소 || "주소 정보 없음"}</p>
//             <p>${cafe.부가설명 || "설명 없음"}</p>
//         </div>
//     `;
//     return cafeCard;
// }



// 페이지 로드 시 모달 표시
window.onload = async () => {
    await loadKeywords();
    document.getElementById('keyword-modal').style.display = 'flex';
};
