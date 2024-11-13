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
