// ⭐ 선택된 색깔을 저장하는 변수 (처음 기본 색상)
let selectedColor = '#FFE5E5';

// ⭐ 색깔 선택 버튼들 가져오기
const colorOptions = document.querySelectorAll('.color-option');

// ⭐ 각각의 색깔 버튼에 클릭 이벤트 붙이기
colorOptions.forEach(function(option) {
    option.addEventListener('click', function() {

        // 1) 모든 버튼에서 'selected' 클래스를 제거
        colorOptions.forEach(function(opt) {
            opt.classList.remove('selected');
        });

        // 2) 클릭한 요소에 'selected' 클래스 추가
        this.classList.add('selected');

        // 3) 선택된 색깔을 변수에 저장
        selectedColor = this.dataset.color;
    });
});


// ⭐ 페이지가 로드되면 방명록 불러오기 실행
window.onload = function() {
    loadGuestbook();
};

// ⭐ 방명록 카드 추가 함수
function addCard() {
    const userName = document.getElementById('userName').value;
    const userMessage = document.getElementById('userMessage').value;

    // 이름 또는 메세지가 비어있는지 확인
    if (userName === '' || userMessage === '') {
        alert('이름과 소감을 모두 입력해주세요! 😊');
        return;
    }

    // ⭐ 현재 날짜 가져오기
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 0부터 시작하므로 +1
    const day = now.getDate();
    const hour = now.getHours();
    const minutes = now.getMinutes();

    // 분이 1자리일 경우 앞에 0을 붙여서 두 자리 만들기
    let fixedMinutes = minutes;
    if (minutes < 10) {
        fixedMinutes = '0' + minutes;
    }

    const dateString = year + '.' + month + '.' + day + ' ' + hour + ':' + fixedMinutes;

    // ⭐ 카드 데이터 만들기
    const cardData = {
        id: Date.now(), // 카드 고유값
        name: userName,
        message: userMessage,
        color: selectedColor,
        date: dateString
    };

    // localStorage 저장
    saveToLocalStorage(cardData);

    // 화면에 카드 추가
    createCardElement(cardData);

    // 입력창 초기화
    document.getElementById('userName').value = '';
    document.getElementById('userMessage').value = '';

    // 통계 업데이트
    updateStats();
}

// ⭐ 카드 HTML 생성해서 화면에 추가하는 함수
function createCardElement(data) {
    const grid = document.getElementById('guestbookGrid');

    const cardHTML = `
        <div class="card">
            <div class="card-inner" onclick="flipCard(event, this)">
                <div class="card-front" style="background:${data.color};">
                    <h3>${data.name}</h3>
                    <p class="date">${data.date}</p>
                    <p class="hint">👆 클릭하면 메시지가 보여요!</p>
                    <button class="delete-btn" onclick="deleteCard(event, ${data.id})">×</button>
                </div>
                <div class="card-back">
                    <p>${data.message}</p>
                </div>
            </div>
        </div>
    `;

    // 최신 카드가 위로 오도록 맨 앞에 추가
    grid.insertAdjacentHTML('afterbegin', cardHTML);
}

// ⭐ 카드 뒤집기 기능
function flipCard(event, cardInner) {
    // 삭제 버튼 클릭 시 뒤집히지 않도록 막기
    if (event.target.classList.contains('delete-btn')) {
        return;
    }

    // card-inner 클래스에 flipped를 넣었다 뺐다 하기
    cardInner.classList.toggle('flipped');
}

// ⭐ localStorage에 방명록 저장하기
function saveToLocalStorage(cardData) {
    let guestbook = localStorage.getItem('guestbook');

    // guestbook 값이 없으면 빈 배열로 만들기
    if (guestbook === null) {
        guestbook = [];
    } else {
        guestbook = JSON.parse(guestbook); // 문자열 → 배열 변환
    }

    guestbook.push(cardData);

    localStorage.setItem('guestbook', JSON.stringify(guestbook));
}

// ⭐ 저장된 방명록 불러오기
function loadGuestbook() {
    let guestbook = localStorage.getItem('guestbook');

    if (guestbook !== null) {
        guestbook = JSON.parse(guestbook);

        // 최신 데이터가 위로 오도록 역순으로 출력
        for (let i = guestbook.length - 1; i >= 0; i--) {
            createCardElement(guestbook[i]);
        }
    }

    updateStats();
}

// ⭐ 카드 삭제 기능
function deleteCard(event, id) {
    event.stopPropagation(); // 카드 뒤집힘 방지

    const choice = confirm('정말 삭제하시겠습니까?');

    if (choice === true) {
        let guestbook = localStorage.getItem('guestbook');
        guestbook = JSON.parse(guestbook);

        // 같은 id가 아닌 것만 남기기
        const newGuestbook = guestbook.filter(function(card) {
            return card.id !== id;
        });

        // 다시 저장
        localStorage.setItem('guestbook', JSON.stringify(newGuestbook));

        // 화면 다시 로딩
        document.getElementById('guestbookGrid').innerHTML = '';
        loadGuestbook();
    }
}

// ⭐ 통계 업데이트 (총 카드 개수 보여주기)
function updateStats() {
    let guestbook = localStorage.getItem('guestbook');

    let count = 0;

    if (guestbook !== null) {
        const list = JSON.parse(guestbook);
        count = list.length;
    }

    document.getElementById('totalCount').textContent = count;
}
