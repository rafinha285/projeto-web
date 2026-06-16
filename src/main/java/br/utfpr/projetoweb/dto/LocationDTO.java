package br.utfpr.projetoweb.dto;

import br.utfpr.projetoweb.entities.LocationEntity;

import java.math.BigDecimal;
import java.util.Date;

public record LocationDTO(
    Long id,
    String name,
    String country,
    String continent,
    String description,
    BigDecimal price,
    String imageUrl,
    Date startDate,
    Date endDate,
    Double latitude,
    Double longitude
) implements BaseDTO<LocationEntity> {
    @Override
    public LocationEntity toEntity(){
        return new LocationEntity(
                name,
                country,
                continent,
                description,
                price,
                imageUrl,
                startDate,
                endDate,
                latitude,
                longitude
        );
    }
}
