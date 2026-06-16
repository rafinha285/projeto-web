package br.utfpr.projetoweb.dto;

import java.io.Serializable;

public interface BaseDTO<E> extends Serializable {

    E toEntity();
}
