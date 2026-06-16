package br.utfpr.projetoweb.controller;

import br.utfpr.projetoweb.entities.UserEntity;
import br.utfpr.projetoweb.exceptions.UsuarioJaExistenteException;
import br.utfpr.projetoweb.repositories.UserRepository;
import br.utfpr.projetoweb.request.RegisterRequest;
import br.utfpr.projetoweb.response.ApiResponse;
import br.utfpr.projetoweb.security.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public UserEntity register(@RequestBody RegisterRequest req){
        if (req.email().isBlank() || req.password().isBlank() || req.name().isBlank()){
            throw new IllegalArgumentException("Email e senha obrigatórios.");
        }
        if(userRepository.findByEmail(req.email()).isPresent()){
            throw new UsuarioJaExistenteException("Usuário ja existente.");
        }
        UserEntity user = new UserEntity(
            req.email(),
            req.name(),
            req.password(),
            "user"
        );
        return userRepository.save(user);
    }

    @PostMapping("/login")
    public UserEntity login(@RequestParam("email") String email,
                                                         @RequestParam("password") String password,HttpServletResponse response) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com o e-mail: " + email));

        String token = jwtUtil.generateToken(user);

        Cookie cookie = new Cookie("viagem_session_token", token);
        cookie.setHttpOnly(false);
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60); // 1 dia
        response.addCookie(cookie);

        return user;
    }
}
