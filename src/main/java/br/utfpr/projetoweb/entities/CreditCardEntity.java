package br.utfpr.projetoweb.entities;

import br.utfpr.projetoweb.dto.CreditCardDTO;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "credit_cards")
@Getter
@Setter
@NoArgsConstructor
public class CreditCardEntity extends BaseEntity<CreditCardDTO> {

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(nullable = false)
    private String cardName;

    @Column(nullable = false)
    private String cardNumber;

    @Column(nullable = false)
    private String expiry;

    @Column(nullable = false)
    private String cvv;

    public CreditCardEntity(String cardName, String cardNumber, String expiry, String cvv) {
        this.cardName = cardName;
        this.cardNumber = cardNumber;
        this.expiry = expiry;
        this.cvv = cvv;
    }

    @Override
    public CreditCardDTO toDTO() {
        return new CreditCardDTO(
            getId(),
            cardName,
            cardNumber,
            expiry,
            cvv
        );
    }
}
