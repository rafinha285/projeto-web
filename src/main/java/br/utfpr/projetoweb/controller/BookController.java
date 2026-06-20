package br.utfpr.projetoweb.controller;

import br.utfpr.projetoweb.dto.BookDTO;
import br.utfpr.projetoweb.entities.BookEntity;
import br.utfpr.projetoweb.entities.LocationEntity;
import br.utfpr.projetoweb.entities.UserEntity;
import br.utfpr.projetoweb.repositories.BookRepository;
import br.utfpr.projetoweb.repositories.LocationRepository;
import br.utfpr.projetoweb.repositories.UserRepository;
import br.utfpr.projetoweb.request.BookRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.ZoneId;
import java.util.Date;

@RestController
@RequestMapping("/api/book")
public class BookController {

    private final BookRepository bookRepository;
    private final LocationRepository locationRepository;
    private final UserRepository userRepository;

    public BookController(BookRepository bookRepository, LocationRepository locationRepository, UserRepository userRepository) {
        this.bookRepository = bookRepository;
        this.locationRepository = locationRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public BookDTO createBooking(@AuthenticationPrincipal UserDetails userDetails, @RequestBody BookRequest request) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Não autorizado");
        }

        if (request.locationId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID da localização ausente");
        }

        UserEntity user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        LocationEntity location = locationRepository.findById(request.locationId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Localização não encontrada"));

        Date checkInDate = request.checkIn() != null ? Date.from(request.checkIn().atStartOfDay(ZoneId.systemDefault()).toInstant()) : null;
        Date checkOutDate = request.checkOut() != null ? Date.from(request.checkOut().atStartOfDay(ZoneId.systemDefault()).toInstant()) : null;

        BookEntity book = new BookEntity(
                user,
                location,
                checkInDate,
                checkOutDate
        );

        return bookRepository.save(book).toDTO();
    }
}
