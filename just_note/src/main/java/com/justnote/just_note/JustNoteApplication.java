package com.justnote.just_note;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class JustNoteApplication {

	public static void main(String[] args) {
		SpringApplication.run(JustNoteApplication.class, args);
	}

}
