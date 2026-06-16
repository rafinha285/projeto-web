package br.utfpr.projetoweb.configuration;

import br.utfpr.projetoweb.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadCredentialsException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ApiResponse<Void> handleBadCredentials(BadCredentialsException ex){
        return new ApiResponse<>(false, "E-mail ou senha incorretos", null, ex.getMessage());
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND) // Define o Status HTTP 404
    public ApiResponse<Void> handleUserNotFound(UsernameNotFoundException ex) {
        return new ApiResponse<>(false, ex.getMessage()); // O segundo construtor da sua classe ApiResponse
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResponse<Void> handleGenericException(Exception ex) {
        return new ApiResponse<>(false, "Ocorreu um erro interno no servidor.", null, ex.getMessage());
    }
}
