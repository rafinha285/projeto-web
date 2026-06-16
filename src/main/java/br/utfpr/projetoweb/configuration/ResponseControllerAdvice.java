package br.utfpr.projetoweb.configuration;

import br.utfpr.projetoweb.response.ApiResponse;
import org.jspecify.annotations.Nullable;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

@org.springframework.web.bind.annotation.ControllerAdvice

public class ResponseControllerAdvice implements ResponseBodyAdvice<Object> {

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        if (returnType.getParameterType().isAssignableFrom(String.class)) {
            return false;
        }
        // Se já for uma ApiResponse (que veio lá do nosso GlobalExceptionHandler), não envelopa de novo!
        return !returnType.getParameterType().isAssignableFrom(ApiResponse.class);
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  ServerHttpRequest request, ServerHttpResponse response) {

        if (body == null) {
            return new ApiResponse<>(true, "Operação realizada com sucesso", null);
        }

        // Se o código chegou aqui e NÃO é um ApiResponse, significa que é um retorno de SUCESSO crú de algum controller
        return new ApiResponse<>(true, "Requisição processada com sucesso", body);
    }
}
