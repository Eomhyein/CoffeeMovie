import {
  test,
  addPosterToTopRanking,
  findToMovieName,
  findToMovieNameAll,
} from "./function.js";
import { movieList, weekmovieList } from "./movieList.js";

starter();
function starter() {
  let search = document.querySelector("#btn_submit");
  search.addEventListener("click", (event) => {
    event.preventDefault();
    const input = document.querySelector(".form-control").value;
    let searchURL = "../HTML/search.html?q=" + input;
    location.href = searchURL;
  });
}

//로고를 눌렀을때 메인페이지로 이동하는 버튼구현
let home = document.querySelector(".logo");
home.addEventListener("click", () => {
  window.location.href = "../index.html";
});

test();
let searchResults;
let Ranking; // 기본 로드된 랭킹 배열이 들어가는 변수
let RankingList = []; //현재 로딩된 모든 요소들을 가지고 있음 ->나중에 sort by 구현시 사용
async function load(dayOrWeek) {
  //주간or일간 영화 받아오기
  await addPosterToTopRanking(dayOrWeek).then((data) => {
    Ranking = data;
    postMovie(Ranking);
    RankingList.push(data);
  });
}

function postMovie(movieArray) {
  //화면 출력 함수
  const moiveBox = document.querySelector(".moiveBox");

  movieArray.forEach((index) => {
    const makeMoviePoster = document.createElement("div");
    makeMoviePoster.classList.add("moviePoster", "col");
    makeMoviePoster.innerHTML = `
        <div class="card h-100">
          <img src='${index.TMDB.posterUrl}' class="card-img-top" alt="..." />
          <p class="vote"><i class='bx bxs-star'></i>${index.TMDB.voteAverage.toFixed(
            1
          )}</p>
          <h5 class="card-title">${index.movieNm}</h5>
          <div class="card-footer">
            <small class="text-body-secondary">${index.TMDB.overView}</small>
          </div>
        </div>
        `;
    moiveBox.appendChild(makeMoviePoster);
    makeMoviePoster.addEventListener("click", () => {
      window.location.href =
        "./detailPage.html?q=" + encodeURIComponent(index.movieNm);
    });
  });
}

let timer;
let referIndex = 1;
let roading = false; //로딩 여부확인 -> 이벤트 중복 등록을 방지하기 위한 변수
const cat = document.querySelector(".loadingCat");
window.onscroll = function () {
  if (
    (roading === false && searchParams == "오늘의영화") ||
    searchParams == "이번주영화"
  ) {
    clearTimeout(timer);
    timer = setTimeout(async function () {
      var windowHeight = window.innerHeight;
      var currentScroll = window.scrollY;
      var totalHeight = document.body.scrollHeight;

      if (currentScroll + windowHeight >= totalHeight) {
        roading = true;
        cat.style.display = "block"; //고양이 나옴
        let newMovieNm;
        if (searchParams == "이번주영화") {
          newMovieNm = weekmovieList(referIndex);
          console.log("이번주영화 리스트"+newMovieNm);
        } else {
          newMovieNm = movieList(referIndex);
          console.log("오늘의영화 리스트"+newMovieNm);
        }

        let nextPage = [];

        // 각각의 비동기 호출을 병렬로 처리
        const promises = newMovieNm.map((index) => findToMovieName(index));

        // 모든 비동기 호출이 완료될 때까지 기다림
        await Promise.all(promises)
          .then((results) => {
            // 결과를 nextPage 배열에 추가
            nextPage = results;
            RankingList.push(results); //현재 로드된 배열정보에 새로운 요소들을 추가함
          })
          .catch((error) => {
            console.error(error);
          });

        // 병렬로 처리된 결과를 postMovie 함수에 전달
        cat.style.display = "none"; //고양이 사라짐
        postMovie(nextPage);
        referIndex++;
        roading = false;
      }
    }, 100); // 0.1초간 동작을 기다림
  }
};

let searchParams = new URLSearchParams(window.location.search).get("q"); //검색결과를 받아오는 테스트 코드
let showQuery = document.querySelector(".showQuery");
showQuery.textContent = searchParams;
findIfNeed();
async function findIfNeed() {
  //검색 결과 쿼리가 있을때 즉시 검색
  if (searchParams) {
    if (searchParams == "이번주영화") {
      console.log("week검색");
      await load("Week");
    } else if (searchParams == "오늘의영화") {
      await load("Day");
    } else {
      await findToMovieNameAll(searchParams).then((data) => {
        searchResults = data;
        RankingList.push(data);
        postMovie(searchResults);
      });
    }
  }
}

//페이지에 존재하는 영화 목록들을 특정 순서에 맞게 정렬

let oderByName = document.querySelector(".btn_name");
let oderByNew = document.querySelector(".btn_new");
let oderByRecommend = document.querySelector(".btn_recommended");

oderByName.addEventListener("click", () => {
  doSort("name");
});
oderByNew.addEventListener("click", () => {
  doSort("new");
});
oderByRecommend.addEventListener("click", () => {
  doSort("Recommend");
});

function doSort(kind) {
  //Ranking 변수의 데이터를 펼치는 작업
  const moiveBox = document.querySelector(".moiveBox");
  let flatRanking = RankingList.flat(1);

  if (kind == "name") {
    console.log("이름순 정렬");
    flatRanking.sort((a, b) => a.movieNm.localeCompare(b.movieNm));
    moiveBox.innerHTML = "";
    postMovie(flatRanking);
  } else if (kind == "new") {
    console.log("출시일 순 정렬");
    flatRanking.sort((a, b) => {
      let dateA = new Date(a.openDt);
      let dateB = new Date(b.openDt);
      return dateB - dateA;
    });
    moiveBox.innerHTML = "";
    postMovie(flatRanking);
  } else if (kind == "Recommend") {
    console.log("평점순 정렬");
    flatRanking.sort((a, b) => {
      let ratingA = parseFloat(a.TMDB.voteAverage.toFixed(1));
      let ratingB = parseFloat(b.TMDB.voteAverage.toFixed(1));

      return ratingB - ratingA;
    });
    moiveBox.innerHTML = "";
    postMovie(flatRanking);
  } else {
    console.log("알 수 없는 값");
  }
}
//정렬관련 함수 끝 --------------------------------------------------------
