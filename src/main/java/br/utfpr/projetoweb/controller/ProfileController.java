package br.utfpr.projetoweb.controller;

import br.utfpr.projetoweb.dto.UserDTO;
import br.utfpr.projetoweb.entities.UserEntity;
import br.utfpr.projetoweb.repositories.UserRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import br.utfpr.projetoweb.dto.BookDTO;
import br.utfpr.projetoweb.entities.BookEntity;
import br.utfpr.projetoweb.repositories.BookRepository;
import java.util.List;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    public ProfileController(UserRepository userRepository, BookRepository bookRepository) {
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    @GetMapping("/user")
    @ResponseBody
    public UserDTO getUser(@AuthenticationPrincipal UserDetails userDetails){
        String email = userDetails.getUsername();
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(()->new UsernameNotFoundException("Usuário não encontrado"));
        return user.toDTO();
    }

    @PatchMapping("/user")
    @ResponseBody
    public UserDTO updateUser(@AuthenticationPrincipal UserDetails userDetails, @RequestBody UserDTO userDTO){
        String email = userDetails.getUsername();
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(()->new UsernameNotFoundException("Usuário não encontrado"));
        
        if (userDTO.name() != null) user.setName(userDTO.name());
        if (userDTO.dataNascimento() != null) user.setDataNascimento(userDTO.dataNascimento());
        if (userDTO.nacionalidade() != null) user.setNacionalidade(userDTO.nacionalidade());
        if (userDTO.numTelefone() != null) user.setNumTelefone(userDTO.numTelefone());
        if (userDTO.cidade() != null) user.setCidade(userDTO.cidade());
        if (userDTO.bio() != null) user.setBio(userDTO.bio());
        if (userDTO.assento() != null) user.setAssento(userDTO.assento());
        if (userDTO.comida() != null) user.setComida(userDTO.comida());
        if (userDTO.classe() != null) user.setClasse(userDTO.classe());
        if (userDTO.moeda() != null) user.setMoeda(userDTO.moeda());
        
        return userRepository.save(user).toDTO();
    }

    @GetMapping("/bookings")
    @ResponseBody
    public List<BookDTO> getBookings(@AuthenticationPrincipal UserDetails userDetails){
        String email = userDetails.getUsername();
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(()->new UsernameNotFoundException("Usuário não encontrado"));
        return bookRepository.findByUser(user).stream().map(BookEntity::toDTO).toList();
    }

    @GetMapping("/favorites")
    @ResponseBody
    public List<br.utfpr.projetoweb.dto.FavoriteDTO> getFavorites(@AuthenticationPrincipal UserDetails userDetails, br.utfpr.projetoweb.repositories.FavoriteRepository favoriteRepository){
        String email = userDetails.getUsername();
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(()->new UsernameNotFoundException("Usuário não encontrado"));
        return favoriteRepository.findByUser(user).stream().map(br.utfpr.projetoweb.entities.FavoriteEntity::toDTO).toList();
    }

    @org.springframework.web.bind.annotation.PostMapping("/favorites/{locationId}")
    @ResponseBody
    public void addFavorite(@AuthenticationPrincipal UserDetails userDetails, @org.springframework.web.bind.annotation.PathVariable Long locationId, br.utfpr.projetoweb.repositories.FavoriteRepository favoriteRepository, br.utfpr.projetoweb.repositories.LocationRepository locationRepository){
        String email = userDetails.getUsername();
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(()->new UsernameNotFoundException("Usuário não encontrado"));
        br.utfpr.projetoweb.entities.LocationEntity location = locationRepository.findById(locationId).orElseThrow(()->new RuntimeException("Location not found"));
        if(favoriteRepository.findByUserAndLocation(user, location).isEmpty()) {
            favoriteRepository.save(new br.utfpr.projetoweb.entities.FavoriteEntity(user, location));
        }
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/favorites/{locationId}")
    @ResponseBody
    public void removeFavorite(@AuthenticationPrincipal UserDetails userDetails, @org.springframework.web.bind.annotation.PathVariable Long locationId, br.utfpr.projetoweb.repositories.FavoriteRepository favoriteRepository, br.utfpr.projetoweb.repositories.LocationRepository locationRepository){
        String email = userDetails.getUsername();
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(()->new UsernameNotFoundException("Usuário não encontrado"));
        br.utfpr.projetoweb.entities.LocationEntity location = locationRepository.findById(locationId).orElseThrow(()->new RuntimeException("Location not found"));
        favoriteRepository.findByUserAndLocation(user, location).ifPresent(favoriteRepository::delete);
    }
}
