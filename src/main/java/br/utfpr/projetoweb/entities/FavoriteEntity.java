package br.utfpr.projetoweb.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "favorites")
public class FavoriteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "location_id", nullable = false)
    private LocationEntity location;

    public FavoriteEntity() {
    }

    public FavoriteEntity(UserEntity user, LocationEntity location) {
        this.user = user;
        this.location = location;
    }

    public Long getId() {
        return id;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public LocationEntity getLocation() {
        return location;
    }

    public void setLocation(LocationEntity location) {
        this.location = location;
    }

    public br.utfpr.projetoweb.dto.FavoriteDTO toDTO() {
        return new br.utfpr.projetoweb.dto.FavoriteDTO(
                this.id,
                this.user.getId(),
                this.location.getId(),
                this.location.toDTO()
        );
    }
}
