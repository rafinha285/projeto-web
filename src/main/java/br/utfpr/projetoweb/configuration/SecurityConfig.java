package br.utfpr.projetoweb.configuration;

import br.utfpr.projetoweb.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Desabilitar CSRF para permitir JWT/Ajax requests sem token no body
            .authorizeHttpRequests(auth -> auth
                // Rotas Públicas (conforme aprovação do plano)
                .requestMatchers("/", "/home", "/login", "/register", "/search").permitAll()
                .requestMatchers("/css/**", "/js/**", "/assets/**", "/images/**").permitAll()
                .requestMatchers("/api/locations", "/api/location/**", "/api/auth/**", "/api/search/**").permitAll()
                // Rotas Protegidas
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex
                // Redireciona usuários não logados que tentem acessar rotas protegidas (como /profile) para a tela de login
                .authenticationEntryPoint((request, response, authException) -> {
                    response.sendRedirect("/login");
                })
            )
            .sessionManagement(session -> session
                // A sessão em si será stateless, pois depende do Cookie (JWT) e não do JSESSIONID em memória
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Usa NoOp para garantir compatibilidade com possíveis senhas em texto puro do projeto antigo
        // Você poderá trocar para BCrypt se decidir encodar as senhas
        return NoOpPasswordEncoder.getInstance();
    }
}
