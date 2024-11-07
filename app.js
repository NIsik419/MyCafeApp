// JSON 파일로부터 카페 데이터를 불러와 DOM에 추가하는 함수
async function loadCafes() {
    try {
        const response = await fetch('cafes.json'); // JSON 파일 경로
        if (!response.ok) throw new Error("네트워크 응답에 문제가 있습니다.");
        
        const cafes = await response.json(); // JSON 데이터로 변환
        const listContainer = document.getElementById('recommendation-list');

        cafes.forEach(cafe => {
            // 각 카페에 대한 카드 생성
            const cafeCard = document.createElement('div');
            cafeCard.classList.add('cafe-card');
            
            cafeCard.innerHTML = `
                <img src="${cafe.썸네일이미지URL}" alt="${cafe.이름}">
                <div class="cafe-info">
                    <h3>${cafe.이름}</h3>
                    <p>주소: ${cafe.도로명주소}</p>
                    <p>영업 시간: ${cafe.영업시간}</p>
                    <p>평점: ${cafe.방문자평점} ★</p>
                </div>
            `;

            // 리스트 컨테이너에 카드 추가
            listContainer.appendChild(cafeCard);
        });
    } catch (error) {
        console.error("데이터를 불러오는 중 오류가 발생했습니다.", error);
    }
}

// 페이지 로드 시 카페 데이터 불러오기
document.addEventListener('DOMContentLoaded', loadCafes);
