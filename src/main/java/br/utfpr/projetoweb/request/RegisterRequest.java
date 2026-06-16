package br.utfpr.projetoweb.request;

public record RegisterRequest(
    String email,
    String name,
    String password
) {
}
