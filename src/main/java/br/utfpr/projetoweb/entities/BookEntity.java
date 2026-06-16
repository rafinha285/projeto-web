package br.utfpr.projetoweb.entities;

import br.utfpr.projetoweb.dto.BookDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "book")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BookEntity extends BaseEntity<BookDTO>{
    @OneToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @OneToOne
    @JoinColumn(name = "location_id")
    private LocationEntity location;

    @Column
    private Date checkIn;

    @Column
    private Date checkOut;

    @Override
    public BookDTO toDTO(){
        return new BookDTO(
            this.getId(),
            this.user.toDTO(),
            this.location.toDTO(),
            this.checkIn,
            this.checkOut
        );
    }
}
