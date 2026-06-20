package br.utfpr.projetoweb.controller;

import br.utfpr.projetoweb.dto.LocationDTO;
import br.utfpr.projetoweb.entities.LocationEntity;
import br.utfpr.projetoweb.repositories.LocationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class GeneralLocationController {

    private final LocationRepository locationRepository;

    public GeneralLocationController(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    // --- Admin endpoints for /locations ---
    @GetMapping("/locations")
    public List<LocationDTO> getAllLocations() {
        return locationRepository.findAll().stream().map(LocationEntity::toDTO).collect(Collectors.toList());
    }

    @PostMapping("/locations")
    public LocationDTO addLocation(@RequestBody LocationDTO dto) {
        LocationEntity entity = dto.toEntity();
        return locationRepository.save(entity).toDTO();
    }

    @DeleteMapping("/locations")
    public void deleteLocation(@RequestParam("id") Long id) {
        if (locationRepository.existsById(id)) {
            locationRepository.deleteById(id);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Localização não encontrada");
        }
    }

    // --- User endpoint for /location/{id} ---
    @GetMapping("/location/{id}")
    public LocationDTO getLocationById(@PathVariable("id") Long id) {
        return locationRepository.findById(id)
                .map(LocationEntity::toDTO)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Localização não encontrada"));
    }
}
