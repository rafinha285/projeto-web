package br.utfpr.projetoweb.repositories;

import br.utfpr.projetoweb.entities.CreditCardEntity;
import br.utfpr.projetoweb.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CreditCardRepository extends JpaRepository<CreditCardEntity, Long> {
    List<CreditCardEntity> findByUser(UserEntity user);
    Optional<CreditCardEntity> findByIdAndUser(Long id, UserEntity user);
}
