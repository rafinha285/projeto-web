package br.utfpr.projetoweb.dto;

import br.utfpr.projetoweb.entities.CreditCardEntity;

public record CreditCardDTO(
    Long id,
    String cardName,
    String cardNumber,
    String expiry,
    String cvv
) implements BaseDTO<CreditCardEntity> {
    @Override
    public CreditCardEntity toEntity() {
        return new CreditCardEntity(
            cardName,
            cardNumber,
            expiry,
            cvv
        );
    }
}
