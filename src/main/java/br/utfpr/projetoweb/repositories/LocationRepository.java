package br.utfpr.projetoweb.repositories;

import br.utfpr.projetoweb.entities.LocationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Arrays;
import java.util.List;

public interface LocationRepository extends JpaRepository<LocationEntity, Long>, JpaSpecificationExecutor<LocationEntity> {
    List<LocationEntity> findByNameLikeIgnoreCase(String name);
}
