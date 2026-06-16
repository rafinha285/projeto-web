package br.utfpr.projetoweb.repositories;

import br.utfpr.projetoweb.entities.LocationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationRepository extends JpaRepository<LocationEntity, Long> {
}
