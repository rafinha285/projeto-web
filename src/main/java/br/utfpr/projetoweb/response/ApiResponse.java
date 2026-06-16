package br.utfpr.projetoweb.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
public class ApiResponse<T> implements Serializable {
    private boolean status;
    private String mensagem;
    private T dados;
    private String error;

    public ApiResponse(boolean status, String mensagem){
        this.status = status;
        this.mensagem = mensagem;
    }

    public ApiResponse(boolean status, String mensagem, T dados){
        this.status = status;
        this.mensagem = mensagem;
        this.dados = dados;
    }
}
