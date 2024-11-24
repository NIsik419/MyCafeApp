let selectedKeywords = [];

// 키워드 버튼 클릭 이벤트
document.querySelectorAll('.keyword-button').forEach(button => {
    button.addEventListener('click', () => {
        const keyword = button.getAttribute('data-keyword');
        if (selectedKeywords.includes(keyword)) {
            // 이미 선택된 키워드는 제거
            selectedKeywords = selectedKeywords.filter(kw => kw !== keyword);
            button.classList.remove('selected');
        } else {
            // 새로운 키워드 추가
            selectedKeywords.push(keyword);
            button.classList.add('selected');
        }
        // 확인 버튼 활성화 여부
        document.getElementById('confirm-keywords').disabled = selectedKeywords.length === 0;
    });
});

// 키워드 확인 버튼 클릭 이벤트
document.getElementById('confirm-keywords').addEventListener('click', () => {
    // 선택된 키워드를 저장
    localStorage.setItem('preferredKeywords', JSON.stringify(selectedKeywords));

    // 추천 카페 표시
    displayRecommendations(selectedKeywords);

    // 키워드 선택 UI 숨기기
    document.getElementById('keyword-selection').style.display = 'none';
    document.querySelector('.content').style.display = 'block'; // 기존 콘텐츠 표시
});

// 추천 카페 표시 함수
function displayRecommendations(keywords) {
    // 여기서 추천 로직을 구현
    console.log("선호 키워드:", keywords);
    // 추천 카페 필터링 및 표시 구현
}
