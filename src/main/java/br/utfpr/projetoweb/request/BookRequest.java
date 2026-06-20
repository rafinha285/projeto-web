package br.utfpr.projetoweb.request;

import java.time.LocalDate;

public record BookRequest(
    Long locationId,
    LocalDate checkIn,
    LocalDate checkOut
) {}
