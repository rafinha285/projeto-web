package br.utfpr.projetoweb.controller;

import br.utfpr.projetoweb.dto.LocationDTO;
import br.utfpr.projetoweb.entities.LocationEntity;
import br.utfpr.projetoweb.repositories.LocationRepository;
import br.utfpr.projetoweb.service.LocationService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/location")
public class LocationController {
    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping("/search")
    public List<LocationDTO> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date endDate
    ){
        return locationService.search(name, startDate, endDate).stream().map(LocationEntity::toDTO).toList();
    }
}
