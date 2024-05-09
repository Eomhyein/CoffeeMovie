//메인 로직을 구현하는 JS 파일입니다
import {
  test,
  addPosterToTopRanking,
} from "./JS/function.js";
window.addEventListener("load", fetchData);
test();
let dailyRanking = []; //오늘의 영화 TOP 10
let weekRanking = []; //이번주 영화 TOP 10

// 검색버튼 클릭시 수행 : 검색페이지로 파라미터값 추가하여 전달
let searchButton = document.querySelector("#btn_submit");
searchButton.addEventListener("click", (event) => {
  event.preventDefault();
  let target = document.querySelector(".inputSearch").value;
  // 경로 : ./HTML폴더/html파일?파라미터=value
  let searchURL = "./HTML/search.html?q=" + target;
  location.href = searchURL;
});


function mainMovie(num) {
  //메인페이지 상단 부분
  let imagePoster = document.createElement("img");
  imagePoster.setAttribute("src", dailyRanking[num].TMDB.posterUrl);
  document.querySelector(".imgBox").appendChild(imagePoster);

  let mainPoster = document.createElement("div");
  mainPoster.classList.add("moviePoster");
  mainPoster.innerHTML = `
<h1 class="posterTitle">${dailyRanking[num].movieNm}</h1>
      <!--02_2 영화 연령고지, 개봉년도-->
      <div class="ageYearReview">
        <div class="ageYear">
          <img class="ageImg" src="image/age/01_ALL.png" alt="연령고지 이미지">
          <span class="movieYear">${dailyRanking[num].openDt}</span>
        </div>
        <p class="movieReview"><i class='bx bxs-star'></i>${dailyRanking[num].TMDB.voteAverage}</p>
      </div>
`;
  document.querySelector(".moviePoster").appendChild(mainPoster);
  mainPoster.addEventListener("click", () => {
    window.location.href =
      "./HTML/search.html?q=" + encodeURIComponent(index.movieNm);
  });
}

function ScrollMain() {
  //자동으로 메인 무비를 바꿔주는 함수
  let num = 0;
  setInterval(function () {
    document.querySelector(".moviePoster").innerHTML = " ";
    document.querySelector(".imgBox").innerHTML = " ";
    mainMovie(num);
    num++;
    if (num > 3) {
      num = 0;
    }
  }, 5000); // 시간을 ms 단위로 입력하여 바뀌는 시간을 조절
}

function displayTodayTop() {
  //오늘의 영화 TOP
  let todayMovieBox = document.querySelector(".todayMovie");
  dailyRanking.forEach((index) => {
    let today = document.createElement("div");
    today.classList.add("todayMoviePosterBox");
    today.innerHTML = `
        <img class="todayMoviePoster" src="${index.TMDB.posterUrl}">
        <p class="vote"><i class='bx bxs-star'></i>${index.TMDB.voteAverage.toFixed(
          1
        )}</p>
        <div class="todayMovieTitle">${index.movieNm}</div> `;
    todayMovieBox.appendChild(today);
    today.addEventListener("click", () => {
      window.location.href =
        "./HTML/detailPage.html?q=" + encodeURIComponent(index.movieNm);
    });
  });
}

let moveDayTop = document.querySelector(".todayMovieBtn"); //오늘의 영화 TOP 옆에 전체보기 버튼 구현
moveDayTop.addEventListener("click", () => {
  window.location.href = "./HTML/search.html?q=오늘의영화";
});
let moveWeekTop = document.querySelector(".weekMovieBtn"); //오늘의 영화 TOP 옆에 전체보기 버튼 구현
moveWeekTop.addEventListener("click", () => {
  window.location.href = "./HTML/search.html?q=이번주영화";
});

function displayWeekTop() {
  //이번주 영화 TOP
  let weekMovieBox = document.querySelector(".weekMovie");
  weekRanking.forEach((index) => {
    let week = document.createElement("div");
    week.classList.add("weekMoviePosterBox");
    week.innerHTML = `
        <img class="weekMoviePoster" src=${index.TMDB.posterUrl}>
        <p class="vote"><i class='bx bxs-star'></i>${index.TMDB.voteAverage.toFixed(
          1
        )}</p>
        <div class="weekMovieTitle">${index.movieNm}</div>
        `;
    weekMovieBox.appendChild(week);
    week.addEventListener("click", () => {
      window.location.href =
        "./HTML/detailPage.html?q=" + encodeURIComponent(index.movieNm);
    });
  });
}

let move2 = document.querySelector(".weekMovieBtn"); //이번주의 영화 TOP 옆에 전체보기 버튼 구현
move2.addEventListener("click", () => {
  
  window.location.href = "./HTML/search.html?q=이번주영화";
});





function fetchData() {
  //캐싱 구현 함수 @@캐시 만료시간 추가해야함 github issue 확인@@

  // 로컬 스토리지에서 데이터 가져오기
  const Dcache = localStorage.getItem("dayCachedData");
  const Wcache = localStorage.getItem("weekCachedData");

  if (Dcache && Wcache) {
    // 캐시된 데이터가 있으면 이를 사용하여 페이지 업데이트
    console.log("캐싱 데이터 확인 완료. 캐싱데이터로 페이지를 구성합니다");
    updatePageWithData(JSON.parse(Dcache), JSON.parse(Wcache));
  } else {
    // 캐시된 데이터가 없으면 서버에서 데이터 가져오기
    console.log("캐싱 데이터 확인 불가. 캐싱데이터 저장후 페이지를 구성합니다");
    CacheAndDisply();
  }
}



async function CacheAndDisply() {
  // 데이터를 로컬 스토리지에 캐시
  await addPosterToTopRanking("day").then((data) => {
    localStorage.setItem("dayCachedData", JSON.stringify(data));
    dailyRanking = data;
  });
  await addPosterToTopRanking("week").then((data) => {
    localStorage.setItem("weekCachedData", JSON.stringify(data));
    weekRanking = data;
  });
  displayTodayTop();
  displayWeekTop();
  ScrollMain();
}

function updatePageWithData(Day, Week) {
  dailyRanking = Day;
  weekRanking = Week;
  mainMovie(0); //초기 호출
  displayTodayTop();
  displayWeekTop();
  ScrollMain();
}
