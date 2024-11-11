let map;
let openInfoWindow = null;
let markers = [];
let activeMarker = null;

function createInfoWindowContent(cafe) {
    const safeId = cafe.이름.replace(/[^a-zA-Z0-9]/g, '-');
    return `
        <div class="info-window-content" id="info-window-${safeId}">
            <div style="padding: 12px; max-width: 300px;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px;">${cafe.이름}</h3>
                <p style="margin: 4px 0; font-size: 14px;">주소: ${cafe.도로명주소}</p>
                <p style="margin: 4px 0; max-height: 60px; overflow: hidden; font-size: 14px;">${cafe.부가설명}</p>
                ${cafe.상세페이지URL ? `
                    <a href="${cafe.상세페이지URL}" 
                       target="_blank"
                       style="display: inline-block; margin-top: 8px; padding: 8px 16px; 
                              background-color: #4285f4; color: white; text-decoration: none; 
                              border-radius: 4px; font-size: 14px;">
                        상세 정보 보기
                    </a>` : ''}
            </div>
        </div>
    `;
}

function createCafeCard(cafe) {
    const cafeCard = document.createElement("div");
    cafeCard.classList.add("cafe-card");
    cafeCard.innerHTML = `
        <img src="${cafe.썸네일이미지URL}" alt="${cafe.이름}" onerror="this.src='image/placeholder.png'">
        <div class="cafe-info">
            <h3>${cafe.이름}</h3>
            <p>주소: ${cafe.도로명주소}</p>
            <p>${cafe.부가설명}</p>
        </div>
    `;
    return cafeCard;
}

function handleMarkerClick(marker, infoWindow, cafe) {
    if (openInfoWindow) {
        openInfoWindow.close();
    }
    infoWindow.open(map, marker);
    openInfoWindow = infoWindow;
    activeMarker = marker;
    map.panTo(marker.getPosition());
}

function addCafeToMap(cafe) {
    // Create a standard marker
    const marker = new google.maps.Marker({
        position: { lat: parseFloat(cafe.위도), lng: parseFloat(cafe.경도) },
        map: map,
        title: cafe.이름,
        animation: google.maps.Animation.DROP
    });

    // Create info window
    const infoWindow = new google.maps.InfoWindow({
        content: createInfoWindowContent(cafe),
        maxWidth: 300
    });

    // Add click event to marker
    marker.addListener('click', () => {
        handleMarkerClick(marker, infoWindow, cafe);
    });

    // Create cafe card
    const cafeCard = createCafeCard(cafe);

    // Add click event to cafe card
    cafeCard.addEventListener('click', (e) => {
        e.preventDefault();
        handleMarkerClick(marker, infoWindow, cafe);
        if (window.innerWidth < 768) {
            document.getElementById('map').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });

    return { marker, cafeCard };
}

async function initMap() {
    const mapOptions = {
        center: { lat: 37.6232666, lng: 127.0786027 },
        zoom: 17,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        clickableIcons: false,
        gestureHandling: 'greedy'
    };

    try {
        // Create map instance
        map = new google.maps.Map(document.getElementById("map"), mapOptions);

        // Load cafes from JSON
        const response = await fetch('cafes.json');
        const cafes = await response.json();

        const listContainer = document.getElementById('recommendation-list');
        listContainer.innerHTML = '';

        // Add cafes to the map and list
        cafes.forEach(cafe => {
            const { marker, cafeCard } = addCafeToMap(cafe);
            markers.push(marker);
            listContainer.appendChild(cafeCard);
        });

    } catch (error) {
        console.error("Error initializing map:", error);
        document.getElementById('recommendation-list').innerHTML = '<p>카페 데이터를 불러오는 중 오류가 발생했습니다.</p>';
    }
}

// Global registration
window.initMap = initMap;
