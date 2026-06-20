package br.utfpr.projetoweb.dto;

public record FavoriteDTO(
    Long id,
    Long userId,
    Long locationId
) {
}
