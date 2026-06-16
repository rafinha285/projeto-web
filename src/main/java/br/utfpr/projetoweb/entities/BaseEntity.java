package br.utfpr.projetoweb.entities;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.NoArgsConstructor;

@MappedSuperclass
@Getter
@NoArgsConstructor
public abstract class BaseEntity<DTO> {
    @Id
    @GeneratedValue
    private Long id;

    public abstract DTO toDTO();
}
