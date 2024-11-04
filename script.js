document.addEventListener("DOMContentLoaded", function () {
    // 검색 버튼 클릭 이벤트
    document.getElementById("search-btn").addEventListener("click", function () {
        const query = document.querySelector(".search-bar input").value;
        alert(`'${query}'로 검색합니다.`);
        // AJAX를 이용해 검색 결과 가져오기 로직을 추가할 수 있음
    });

    // 추천 키워드 버튼 클릭 이벤트
    const keywordButtons = document.querySelectorAll(".keyword-btn");
    keywordButtons.forEach(button => {
        button.addEventListener("click", function () {
            const keyword = button.textContent;
            alert(`'${keyword}' 카페를 추천합니다.`);
            // AJAX 요청으로 해당 키워드의 추천 카페 리스트를 가져오는 로직 추가 가능
        });
    });

    // 내 주변 카페 찾기 버튼 클릭 이벤트
    document.getElementById("nearby-btn").addEventListener("click", function () {
        alert("내 주변 카페를 검색합니다.");
        // 위치 기반 API를 사용해 주변 카페 리스트를 가져오는 로직 추가
    });

    // 지도로 보기 버튼 클릭 이벤트
    document.getElementById("map-btn").addEventListener("click", function () {
        alert("지도로 주변 카페를 표시합니다.");
        // 지도로 전환하는 기능 추가 가능
    });
});
