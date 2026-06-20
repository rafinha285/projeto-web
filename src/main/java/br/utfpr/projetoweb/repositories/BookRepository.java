package br.utfpr.projetoweb.repositories;

import br.utfpr.projetoweb.entities.BookEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import br.utfpr.projetoweb.entities.UserEntity;

public interface BookRepository extends JpaRepository<BookEntity, Long>{
    List<BookEntity> findByUser(UserEntity user);
}
