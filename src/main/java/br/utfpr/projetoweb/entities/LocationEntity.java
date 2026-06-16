package br.utfpr.projetoweb.entities;

import br.utfpr.projetoweb.dto.LocationDTO;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "location")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LocationEntity extends BaseEntity<LocationDTO>{
    @Column
    private String name;

    @Column
    private String country;

    @Column
    private String continent;

    @Column
    private String description;

    @Column
    private BigDecimal price;

    @Column
    private String imageUrl;

    @Column
    private Date startDate;

    @Column
    private Date endDate;

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    @Override
    public LocationDTO toDTO() {
        return new LocationDTO(
                getId(),
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
