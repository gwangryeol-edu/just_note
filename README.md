# just_note

로그인 없이 닉네임과 비밀번호만으로 글을 쓰고, 수정·삭제 시 비밀번호로 본인 확인을 하는 텍스트 게시판입니다.

## 기술 스택

- Backend: Spring Boot 3, Spring Data JPA, MySQL
- Frontend: React (Vite)
- Database: MySQL 8+

## 폴더 구조

\`\`\`
just_note/       # 백엔드 (Spring Boot)
frontend/        # 프론트엔드 (React)
\`\`\`

## 로컬 실행 방법

### 1. MySQL 준비

\`\`\`sql
CREATE DATABASE just_note CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'board_app'@'localhost' IDENTIFIED BY '비밀번호';
GRANT ALL PRIVILEGES ON just_note.* TO 'board_app'@'localhost';
\`\`\`

### 2. 백엔드 실행

\`\`\`bash
cd just_note
./mvnw spring-boot:run
\`\`\`

\`src/main/resources/application.properties\`에서 DB 접속 정보를 본인 환경에 맞게 설정해주세요.

### 3. 프론트엔드 실행

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
