### 🎥프로젝트 소개
: 자바스크립트로 영화 소개 페이지, 영화 상세 페이지 제작
- 시연영상 : https://youtu.be/wLYU51tA4D8
- 팀 깃허브 : https://github.com/4cozm/Team_Project_No.2

### 프로젝트 목적
- 자바스크립트 문법 활용 능력 향상
- 바닐라 JS로 결과물을 온전히 만드는 경험

### 팀원구성
- 팀장 : 안홍걸 @[4cozm](https://github.com/4cozm)
- 팀원 : 김동규 @[Kdkplaton](https://github.com/Kdkplaton)
- 팀원 : 정서윤 @[YOON0425](https://github.com/YOON0425)
- 팀원 : 엄혜인 @[Eomhyein](https://github.com/Eomhyein)

### 1. 개발기간
- 2024.05.02 (목) ~05.09 (목)

### 2. 개발환경
- HTML, CSS, JavaScript

### 3. 역할분배
- 안홍걸
    - 상세페이지 HTML & CSS 구현
    - 메인페이지 오늘, 주간 영화 TOP JS 구현
- 김동규
    - 상세페이지 ‘평점리뷰’ JS 구현
- 정서윤
    - 전체보기 페이지 HTML, CSS 구현
    - 메인페이지에서 전체보기 페이지로 검색 단어를 넘겨주는 기능 구현
- 엄혜인
    - 와이어프레임 제작
    - 메인 페이지-HTML, CSS 제작
    - 전체보기 페이지 JS구현 & 검색기능 구현

**세부적으로는 팀 깃 허브에 Projects - 전체 프로젝트 개요에 적혀있음**

### 4. 와이어프레임
![와이어프레임 상세설명](https://github.com/Eomhyein/CoffeeMovie/assets/26666131/47c71d58-3b8e-439f-a461-e0746eb22615)


### 5. API문서 
## [function.js]
- **아래 '비동기' 함수들 중 리스트를 반환하는 함수는 기본적으로 10개의 요소를 반환하도록 설정되어 있습니다:**
    - `getTopRated()`: `비동기` TMDB의 최고 평점 영화의 리스트를 불러오는 함수
    - `getDailyRanking()`: `비동기` 영화진흥위원회의 일별 박스오피스의 리스트를 불러온다
    - `getWeeklyRanking(range = 0)`: `비동기` 영화진흥위원회의 주간 박스오피스 리스트를 불러온다
        - range 값 | 0 : 월-일 / 1 : 금-일 / 2 : 월-목 | 기본값 : 0 (월~일)
    - `searchMovieByName()`: `비동기` 영화 이름을 기준으로 TMDB에서 검색한 뒤 포스터 URL, 평점, 줄거리를 추가한다.
        - 추가한 데이터는 TMDB.posterUrl / TMDB.vote_average / TMDB.overView로 접근 가능하다.
    - `addPosterToTopRanking()`: `비동기` function.js 외부에서 영화진흥원의 정보를 받기 위한 API.
        - 매개변수로는 "day"나 "week"가 필요하며 대소문자는 구분하지 않는다.
        - day의 경우 `getDailyRanking()`의 값이 `searchMovieByName()` 함수를 거쳐 반환된다.
        - week의 경우 `getWeeklyRanking(range = 0)`의 값이 `searchMovieByName()` 함수를 거쳐 반환된다.
        - 해당 함수는 리스트 내의 각 영화마다 한 번의 TMDB API 호출이 발생한다.
        - 즉 `addPosterToTopRanking("week")`와 같이 호출할 경우 최소 10번 이상의 TMDB API 호출이 발생하게 된다.
        - 데이터 호출에 따른 지연시간을 방지하기 위해 캐시 처리가 권장된다.
    - `findToMovieName`: `비동기` 영화 이름을 기반으로 영화진흥위원회에서 값을 찾은 뒤 포스터 이미지, 줄거리, 평점을 TMDB로부터 요청한다.
        - 영화진흥위원회의 데이터를 바탕으로 `searchMovieByName()` 함수를 거쳐 값이 반환된다.
    - `addSpace`: `내부` 시리즈물 번호 사이를 띄워주는 함수.
        - TMDB의 영화 이름 검색은 시리즈물에 포함된 시리즈 번호 앞에 띄워쓰기가 없으면 검색이 안된다.
        - 쿵푸팬더4=X / 쿵푸팬더 4=O.
        - TMDB에서 데이터를 검색하는 `searchMovieByName()` 함수의 문자열 처리 과정 중에 포함되어 있다.
    - `altSearchPoster()`: `비동기` `내부` 구글 커스텀 검색 API.
        - `searchMovieByName()` 함수, 즉 TMDB에 검색에도 포스터가 나오지 않을 때 실행되며, 자동으로 나무위키의 포스터 데이터를 가져온다.


### 6. 페이지 사진
**1) 메인페이지**
![01_메인페이지](https://github.com/Eomhyein/CoffeeMovie/assets/26666131/5ef2c0ff-c8a8-4da6-972e-b7870cc3f3ab)
![02_메인페이지](https://github.com/Eomhyein/CoffeeMovie/assets/26666131/07fa3855-5bed-4b17-a76d-5b2ae3bf6c93)
![03_메인페이지](https://github.com/Eomhyein/CoffeeMovie/assets/26666131/60266427-eaee-4cfd-939c-d1abb393a6f6)
![04_메인페이지](https://github.com/Eomhyein/CoffeeMovie/assets/26666131/678688b5-5ce5-435e-9fd9-ee4a817563aa)

**2) 전체보기 페이지**
![01_전체페이지](https://github.com/Eomhyein/CoffeeMovie/assets/26666131/588bd14c-9c1f-4c38-ac99-6935c6b39848)

**3) 상세페이지 주요정보**
![03_상세페이지_주요내용](https://github.com/Eomhyein/CoffeeMovie/assets/26666131/2d956375-0afb-4a60-bdaf-a4420e7b4f78)

**4) 상세페이지 평점리뷰**
![04_상세페이지_평점리뷰](https://github.com/Eomhyein/CoffeeMovie/assets/26666131/865dbc03-27f1-42e2-b7e6-43e5ca6e81d0)


**7. 어려웠던 점**
- 익숙해진 JQuery 대신 순수 자바스크립트로 모두 구현하라는 요구사항에 어려움을 겪게됨
- 버그가 빠르게 해결되지 않아 시간이 낭비됨
- 자바스크립트 사용에 익숙하지 않아 응용하는데 어려움을 겪게됨
