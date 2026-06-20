package br.utfpr.projetoweb.service;

import br.utfpr.projetoweb.entities.LocationEntity;
import br.utfpr.projetoweb.repositories.LocationRepository;
import br.utfpr.projetoweb.specification.LocationSpecifications;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class LocationService {

    private final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public List<LocationEntity> search(String name, Date startDate, Date endDate) {
        Specification<LocationEntity> spec = Specification.where(LocationSpecifications.name(name))
                .and(LocationSpecifications.startDate(startDate))
                .and(LocationSpecifications.endDate(endDate));
        return locationRepository.findAll(spec);
    }
}
