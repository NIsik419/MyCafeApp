document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.getElementById("navbar");
    
    fetch("navbar.html")
        .then(response => {
            if (!response.ok) throw new Error("네비게이션 로드 실패");
            return response.text();
        })
        .then(html => {
            navbar.innerHTML = html;
        })
        .catch(error => {
            console.error("네비게이션 로드 에러:", error);
            navbar.innerHTML = "<p>네비게이션을 불러오는 데 실패했습니다.</p>";
        });
});
