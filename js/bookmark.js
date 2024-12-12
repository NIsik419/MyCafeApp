document.addEventListener("DOMContentLoaded", loadBookmarks);

// 북마크 목록 로드
function loadBookmarks() {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    const bookmarkList = document.getElementById("bookmark-list");

    // 북마크 목록이 없을 경우 메시지 표시
    if (bookmarks.length === 0) {
        bookmarkList.innerHTML = "<p>북마크된 카페가 없습니다.</p>";
        return;
    }

    // 북마크 목록 생성
    bookmarkList.innerHTML = ""; // 기존 내용 초기화
    bookmarks.forEach((bookmark) => {
        const bookmarkCard = createBookmarkCard(bookmark);
        bookmarkList.appendChild(bookmarkCard);
    });
}

// 북마크 카드 생성
function createBookmarkCard(bookmark) {
    const bookmarkCard = document.createElement("div");
    bookmarkCard.classList.add("bookmark-card");

    bookmarkCard.innerHTML = `
        <div class="bookmark-header">
            <h3>${bookmark.이름}</h3>
            <button class="remove-bookmark-button" data-name="${bookmark.이름}">삭제</button>
        </div>
        <img src="${bookmark.썸네일이미지URL || 'image/placeholder.png'}" alt="${bookmark.이름}" class="bookmark-image">
        <p class="truncate-text">${bookmark.도로명주소 || "주소 정보 없음"}</p>
        <p class="truncate-text">${bookmark.부가설명 || "설명 없음"}</p>
    `;

    // 북마크 제거 버튼
    bookmarkCard.querySelector(".remove-bookmark-button").addEventListener("click", (e) => {
        const cafeName = e.target.dataset.name;
        removeBookmark(cafeName);
        loadBookmarks(); // 목록 새로고침
    });

    return bookmarkCard;
}

// 북마크 제거
function removeBookmark(cafeName) {
    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    bookmarks = bookmarks.filter((bookmark) => bookmark.이름 !== cafeName);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}
