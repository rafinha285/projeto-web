package br.utfpr.projetoweb.dto;

import br.utfpr.projetoweb.entities.BookEntity;
import br.utfpr.projetoweb.entities.UserEntity;

import java.util.Date;

public record BookDTO(
    Long id,
    UserDTO user,

    LocationDTO location,
    Date checkIn,
    Date checkOut
) implements BaseDTO<BookEntity> {

    @Override
    public BookEntity toEntity() {
        return new BookEntity(
            user.toEntity(),
            location.toEntity(),
            checkIn,
            checkOut
        );
    }
}
