package br.utfpr.projetoweb.dto;

import br.utfpr.projetoweb.entities.UserEntity;

import java.time.LocalDate;

public record UserDTO(
    Long id,
    String email,
    String name,
    String role,

    @com.fasterxml.jackson.annotation.JsonFormat(shape = com.fasterxml.jackson.annotation.JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    LocalDate dataNascimento,
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
