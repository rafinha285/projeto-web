package br.utfpr.projetoweb.dto;

import br.utfpr.projetoweb.entities.UserEntity;

import java.util.Date;

public record UserDTO(
    Long id,
    String email,
    String name,
    String role,

    Date dataNascimento,
    String nacionalidade,
    String numTelefone,
    String cidade,
    String bio,

    String assento,
    String comida,
    String classe,
    String moeda
) implements BaseDTO<UserEntity> {
    @Override
    public UserEntity toEntity() {
        return null;
    }
}
