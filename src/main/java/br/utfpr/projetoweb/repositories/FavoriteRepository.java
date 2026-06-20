package br.utfpr.projetoweb.repositories;

import br.utfpr.projetoweb.entities.FavoriteEntity;
import br.utfpr.projetoweb.entities.LocationEntity;
import br.utfpr.projetoweb.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<FavoriteEntity, Long> {
    List<FavoriteEntity> findByUser(UserEntity user);
    Optional<FavoriteEntity> findByUserAndLocation(UserEntity user, LocationEntity location);
}
