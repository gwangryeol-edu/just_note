# just_note 백엔드 구현 브리프

프론트가 확정한 DTO를 기준으로, 백엔드(Spring Boot)에서 구현해야 할 API·검증·DB 규칙을 정리한 것. DB 원본 스키마는 프로젝트 루트의 `DB_SCHEMA.md` 참고.

## 기술 스택

- Spring Boot 3, Spring Data JPA, MySQL, Spring Security의 `PasswordEncoder`(bcrypt)
- DB: `just_note`, 테이블은 `note` 하나

## DB 스키마 요약

| 컬럼명 | 타입 | 제약조건 |
|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT. 생성 순서와 일치하므로 정렬·커서로 사용 |
| author | VARCHAR(50) | NOT NULL. 앱에서 UTF-8 50바이트 이하로 검증(글자 수 아님) |
| password | VARCHAR(255) | NOT NULL. bcrypt 해시만 저장, 평문 저장 금지 |
| title | VARCHAR(50) | NOT NULL |
| content | VARCHAR(1000) | NOT NULL. 마크다운 원문 |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

인덱스: `author`에 인덱스. 비밀번호는 해시라 SQL로 직접 비교 불가 — `author`로 후보를 먼저 좁힌 뒤 애플리케이션에서 `PasswordEncoder.matches()`로 개별 검증.

## API 엔드포인트

| 화면 | Method | Path | Request | Response | 비고 |
|---|---|---|---|---|---|
| list | GET | `/api/notes` | NotePageRequest (쿼리파라미터) | NotePageResponse | cursor 없으면 최신 10개 |
| detail | - | - | 없음 | - | 추가 API 호출 없이 list 응답의 NoteResponse를 그대로 사용 |
| create | POST | `/api/notes` | CreateNoteRequest | NoteResponse (201) | |
| find | POST | `/api/notes/search` | FindNoteRequest | NoteResponse[] (200, 없으면 빈 배열) | GET 아님 — 비밀번호가 body에 있어야 함 |
| update | PUT | `/api/notes/{id}` | UpdateNoteRequest | NoteResponse (200) | |
| delete | DELETE | `/api/notes/{id}` | DeleteNoteRequest (body) | 없음 (204) | |

비밀번호가 틀리면 모든 엔드포인트에서 401 + 에러 메시지만 반환, NoteResponse는 절대 password/해시를 포함하지 않음.

## DTO

### NoteResponse (공통 응답 — list 창, create 결과, find 결과, update 결과)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| id | Long | 예 | PK |
| author | String | 예 | 작성자 |
| title | String | 예 | 제목 (원형 박스엔 첫 글자만) |
| content | String | 예 | 마크다운 원문 |
| createdAt | LocalDateTime | 예 | 작성 시각 |
| updatedAt | LocalDateTime | 예 | createdAt과 다르면 수정됨으로 판단 |

### NotePageResponse (list 전용)

| 필드 | 타입 | 설명 |
|---|---|---|
| notes | NoteResponse[] | 이번 창, 기본 10개 |
| hasOlder | boolean | 더 오래된 note 존재 여부 |
| hasNewer | boolean | 더 최신 note 존재 여부 |

### NotePageRequest (쿼리파라미터)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| cursor | Long | 아니오 | 기준 id, 결과에 미포함. 없으면 최신 창 |
| direction | older \| newer | 아니오 | 기본 older (아래로 스크롤 = older) |
| size | int | 아니오 | 기본 10 |

### CreateNoteRequest

| 필드 | 타입 | 필수 | 검증 규칙 |
|---|---|---|---|
| author | String | 예 | trim 후 한글·영문·공백만, UTF-8 50바이트 이하, 전체/앞뒤 공백 불가 |
| password | String | 예 | 평문, 영문·숫자만, 1~25자. 저장 전 bcrypt 해시 |
| title | String | 예 | trim 후 1~50자 |
| content | String | 예 | 1~1000자 |

### FindNoteRequest

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| author | String | 예 | 검색 대상 작성자 |
| password | String | 예 | 평문. 응답/저장값 어디에도 남기지 않음 |

author로 후보 조회 → 각 후보의 해시와 bcrypt 비교 → 일치하는 것만 반환. 작성자 존재 여부는 별도로 알려주지 않음(일치 결과 없으면 그냥 빈 배열).

### UpdateNoteRequest (PUT `/api/notes/{id}`)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| password | String | 예 | find 때 입력한 평문. 매 요청마다 기존 해시와 재검증 |
| author | String | 예 | 수정된 작성자 (create와 동일 검증 규칙) |
| title | String | 예 | 수정된 제목 |
| content | String | 예 | 수정된 본문 |
| newPassword | String | 아니오 | 비밀번호를 바꿀 때만 값 전달. 없으면 기존 해시 유지, 있으면 새로 bcrypt 해시해서 저장 |

### DeleteNoteRequest (DELETE `/api/notes/{id}`)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| password | String | 예 | find 때 입력한 평문. 해시와 일치할 때만 삭제 |

## 페이지네이션(list) 구현 로직

- cursor 없음: id 내림차순으로 상위 `size`개 조회 → hasNewer=false, hasOlder=(전체 개수 > size)
- direction=older + cursor: `id < cursor` 조건으로 id 내림차순 `size`개
- direction=newer + cursor: `id > cursor` 조건으로 id 오름차순 `size`개 조회 후 다시 내림차순으로 뒤집어서 응답
- hasOlder/hasNewer 판단: 실제로는 `size + 1`개를 조회해서 마지막 1개가 있으면 true로 판단하고 응답엔 `size`개만 잘라서 반환하는 방식 추천

## 검증 / 에러 처리

- author 바이트 길이 검증은 `@Size`로 불가능 — 커스텀 검증(`getBytes(StandardCharsets.UTF_8).length`)으로 처리
- password 형식은 `@Pattern(regexp = "^[A-Za-z0-9]{1,25}$")`로 처리 가능
- 비밀번호 불일치: 401 + `{ "message": "..." }` 형태로 통일
- 유효성 검증 실패: 400 + 필드별 에러 메시지
- `@ControllerAdvice` / `@ExceptionHandler`로 에러 응답 형식 통일 추천

## 비밀번호 처리 원칙

- 저장은 항상 bcrypt 해시(`PasswordEncoder`)로만
- 어떤 응답 DTO에도 password/해시 필드 포함 금지
- SQL로 password 직접 비교 금지 — 항상 후보 조회 후 애플리케이션에서 `matches()`로 검증

## 이번 범위에 포함 안 된 것 (참고)

- find/update/delete에 대한 무차별 대입 방지(rate limiting)는 MVP 이후 고려
- detail 전용 단건 조회 API는 현재 DTO 계약상 불필요(list 응답 재사용)
