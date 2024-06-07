//공통으로 사용할 기능을 구현하는 JS 파일입니다.
export function test() {
  console.log("function.js의 메서드와 연결이 잘 되었습니다");
}
const apiKey = ""; //TMDB API KEY 
const googleApikey = ""; //google custom search API KEY 

const searchEngineID = ""; //구글 엔진 ID (포스터용)
const kobisApiKey = ""; //영화진흥 위원회
//영화진흥위원회 호출횟수 초과하면 ~~~
// GET TheMovieDB Top-Rated
export async function getTopRated() {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer ~~",
    },
  };

  return fetch(
    "https://api.themoviedb.org/3/movie/top_rated?language=ko-US&page=1",
    options
  )
    .then((response) => response.json())
    .then((data) => {
      return data.results;
    })
    .catch((error) => console.error("Error fetching data:", error));
}

// 영화진흥위원회API용 날짜지정 함수
function getBeforeDate(tar = -1) {
  let getToday = new Date();
  let today =
    getToday.getFullYear() + // 년
    "0" +
    Number(getToday.getMonth() + 1) + // 월
    "0" +
    Number(getToday.getDate() + tar); // 일

  return today;
}

// GET 영화진흥위원회 일별 박스오피스
export async function getDailyRanking() {
  const targetDate = getBeforeDate(); // 당일조회는 되지않음
  return fetch(
    `http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=${kobisApiKey}&targetDt=${targetDate}`
  )
    .then((response) => response.json())
    .then((data) => {
      return data.boxOfficeResult.dailyBoxOfficeList;
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
}

function getLastMonday() {
  let today = new Date();
  let day = today.getDay(); // 현재 요일 (0: 일요일, 1: 월요일, ..., 6: 토요일)
  let diff = today.getDate() - day - 6; // 저번 주 월요일로 이동
  if (day === 1) {
    // 만약 오늘이 월요일이라면 이번 주 월요일이 아닌 저번 주 월요일을 반환
    diff -= 7;
  }
  let lastMonday = new Date(today.setDate(diff));

  let year = lastMonday.getFullYear();
  let month = (lastMonday.getMonth() + 1).toString().padStart(2, "0"); // 월은 0부터 시작하므로 1을 더하고 2자리로 포맷팅
  let date = lastMonday.getDate().toString().padStart(2, "0"); // 일을 2자리로 포맷팅

  return year + month + date;
}

// GET 영화진흥위원회 주간/주말 박스오피스
// range 값 | 0 : 월~일 / 1 : 금~일 / 2 : 월~목 | 기본값 : 0 (월~일)
export async function getWeeklyRanking(range = 0) {
  let key = ""; // API-Key 값
  let targetDate = getLastMonday(); // 조회할 주의 시작일(월요일) 지정
  let fetch_url = `http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchWeeklyBoxOfficeList.json?key=${key}&targetDt=${targetDate}&weekGb=${range}`;

  let res;
  return await fetch(fetch_url)
    .then((response) => response.json())
    .then((data) => {
      res = data.boxOfficeResult.weeklyBoxOfficeList;
      return res;
    })
    .catch((err) => {
      console.error(err);
    });
}
//영화이름을 기준으로 TMDB에서 검색한뒤 포스터URL,평점,줄거리를 추가해줌 추가한 데이터는 TMDB.poster_path / TMDB.vote_average / TMDB.overView로 접근가능

async function searchMovieByName(movieName) {
  const SpacedMovieNm = addSpace(movieName);
  let posterUrl = "";
  let voteAverage = 0;
  let overView = "줄거리 없음";
  let movieData;
  try {
    await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
        SpacedMovieNm
      )}&language=ko`
    )
      .then((response) => response.json())
      .then((data) => {
        movieData = data;
      });
    posterUrl =
      "https://image.tmdb.org/t/p/w500/" + movieData.results[0].poster_path;
    if (movieData.results[0].poster_path == null) {
      posterUrl = await altSearchPoster(SpacedMovieNm);
    }
    voteAverage = movieData.results[0].vote_average;
    overView = movieData.results[0].overview;
  } catch (error) {
    console.error("영화 검색 중 오류 발생:", error);
    posterUrl = await altSearchPoster(SpacedMovieNm);
  }

  return { posterUrl, voteAverage, overView };
}

export async function addPosterToTopRanking(range) {
  //function.js 외부에서 영화진흥원의 정보를 받기 위한 API

  let rawArray; //데이터를 합치기 전의 배열

  range = range.toLowerCase();
  if (range === "day") {
    //일간 박스오피스 기준으로 데이터를 합침
    rawArray = await getDailyRanking();
  } else if (range === "week") {
    //주간 박스오피스 기준으로 데이터를 합침
    rawArray = await getWeeklyRanking();
  } else {
    console.log(
      "addPosterToTopRanking 함수에 입력한 값이 올바르지 않습니다 대소문자 구분없이 Day 혹은 Week를 써 주세요"
    );
    return 0;
  }

  // 각 영화에 대한 이미지 URL과 평점을 가져오는 작업을 병렬적으로 처리
  const posterPromises = rawArray.map(async (index) => {
    let movieNm = index.movieNm; //영화진흥원의 이름을 저장
    const results = await searchMovieByName(movieNm);
    index.TMDB = results;
  });

  // 모든 이미지 URL을 가져올 때까지 기다림
  await Promise.all(posterPromises);

  return rawArray;
}

async function altSearchPoster(movieName) {
  //구글 커스텀 검색 API 설정 (TMDB에 검색에도 포스터가 나오지 않을때 실행됨)
  let requestUrl =
    "https://www.googleapis.com/customsearch/v1?key=" +
    googleApikey +
    "&cx=" +
    searchEngineID +
    "&q=" +
    encodeURIComponent(movieName + "영화 나무위키") +
    "&searchType=image" +
    "&num=1";
  return fetch(requestUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // 이미지 검색 결과를 처리하는 코드
      console.log("TMDB 포스터 확인 불가 ! 대체검색 실시 영화명:" + movieName);
      return data.items[0].link; // 이미지 검색 결과가 포함된 항목(items)을 출력
    })
    .catch((error) => {
      // 오류 발생 시 처리하는 코드
      console.error("나무위키에도 사진 못찾음", error);
    });
}

//영화이름을 기반으로 영화진흥위원회에서 맨 처음 값을 찾음, 이후 포스터 이미지,줄거리,평점을 TMDB로 부터 요청함
export async function findToMovieName(movieName) {
  const fetch_url = `http://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=${kobisApiKey}&movieNm=${encodeURIComponent(
    movieName
  )}`;
  return await fetch(fetch_url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      let result = data.movieListResult.movieList[0];
      return searchMovieByName(result.movieNm).then((data) => {
        result.TMDB = data;
        return result;
      });
    });
}
export async function findToMovieNameAll(movieName) {
  console.log("인풋과 일치하는 모든 영화 정보를 가져옵니다: " + movieName);
  const fetch_url = `http://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=${kobisApiKey}&movieNm=${encodeURIComponent(
    movieName
  )}`;

  return await fetch(fetch_url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("네트워크가 원활하지 않습니다");
      }
      return response.json();
    })
    .then(async (data) => {
      let results = data.movieListResult.movieList;
      for (let index of results) {
        const tmdbData = await searchMovieByName(index.movieNm);
        index.TMDB = tmdbData;
      }

      return results;
    });
}

function addSpace(str) {
  //시리즈물 번호 사이를 띄워주는 함수
  //TMDB의 영화이름 검색은 시리즈물에 포함된 시리즈 번호 앞에 띄워쓰기가 없으면 검색이 안된다..... 쿵푸팬더4=X / 쿵푸팬더 4=O
  if (str.length > 0) {
    const lastChar = str.charAt(str.length - 1);
    if (!isNaN(parseInt(lastChar))) {
      return str.slice(0, -1) + " " + lastChar;
    }
  }
  return str;
}

export async function youtubeLink(movieName) {
  try {
    // YouTube API를 통해 영화 이름으로 검색하여 동영상 정보 가져오기 (최대 1개 결과만 받아옴)
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${movieName}+예고편&type=video&maxResults=1&key=${googleApikey}`
    );
    const data = await response.json();

    // API 응답에서 첫 번째 동영상 정보 추출
    const video = data.items[0];

    if (!video) {
      throw new Error("영화 예고편이 없습니다.");
    }

    // 동영상 정보 반환
    const videoId = video.id.videoId;
    const videoLink = `https://www.youtube.com/embed/${videoId}`;

    return videoLink;
  } catch (error) {
    console.error("YouTube API 오류:", error);
    throw error;
  }
}

// GET TheMovieDB Now_Playing
export async function getNowPlaying() {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer ~~",
    },
  };

  return fetch(
    "https://api.themoviedb.org/3/movie/now_playing?language=ko-US&page=1&region=410",
    options
  )
    .then((response) => response.json())
    .then((data) => {
      return data.results;
    })
    .catch((error) => console.error("Error fetching data:", error));
}
