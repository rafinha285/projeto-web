package br.utfpr.projetoweb.entities;

import br.utfpr.projetoweb.dto.UserDTO;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class UserEntity extends BaseEntity<UserDTO> {
    @Column(unique = true)
    private String email;

    @Column
    private String password;

    @Column
    private String name;

    @Column
    private String role;

    @Column
    private LocalDate dataNascimento;

    @Column
    private String nacionalidade;

    @Column
    private String numTelefone;

    @Column
    private String cidade;

    @Column
    private String bio;

    @Column
    private String assento;

    @Column
    private String comida;

    @Column
    private String classe;

    @Column
    private String moeda;

    public UserEntity(
            String email,
            String name,
            String password,
            String role
    ){
        this.email = email;
        this.name = name;
        this.password = password;
        this.role = role;
    }

    @Override
    public UserDTO toDTO() {
        return new UserDTO(
            getId(),
            email,
            name,
            role,
            dataNascimento,
            nacionalidade,
            numTelefone,
            cidade,
            bio,
            assento,
            comida,
            classe,
            moeda
        );
    }
}
