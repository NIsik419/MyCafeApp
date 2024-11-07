document.addEventListener("DOMContentLoaded", () => {
    const reviewsSection = document.querySelector(".reviews-section");

    // 예시 리뷰 데이터
    const reviews = [
        {
            title: "멋진 카페 투어",
            text: "이 카페는 훌륭한 분위기와 커피를 제공합니다. 꼭 방문해보세요!",
            rating: "★★★★☆",
            image: "https://via.placeholder.com/100"
        },
        {
            title: "아름다운 해변",
            text: "해변가에서 즐기는 산책은 정말 멋져요. 추천합니다!",
            rating: "★★★★★",
            image: "https://via.placeholder.com/100"
        }
    ];

    // 리뷰 카드 생성
    reviews.forEach(review => {
        const reviewCard = document.createElement("div");
        reviewCard.classList.add("review-card");

        reviewCard.innerHTML = `
            <img src="${review.image}" alt="리뷰 이미지" class="review-image">
            <div class="review-info">
                <h3 class="review-title">${review.title}</h3>
                <p class="review-text">${review.text}</p>
                <div class="review-rating">평점: ${review.rating}</div>
            </div>
        `;

        reviewsSection.appendChild(reviewCard);
    });
});

