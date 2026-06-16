package br.utfpr.projetoweb.repositories;

import br.utfpr.projetoweb.entities.BookEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<BookEntity, Long>{}
