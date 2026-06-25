package br.utfpr.projetoweb.controller;

import br.utfpr.projetoweb.dto.CreditCardDTO;
import br.utfpr.projetoweb.dto.FavoriteDTO;
import br.utfpr.projetoweb.dto.UserDTO;
import br.utfpr.projetoweb.entities.*;
import br.utfpr.projetoweb.repositories.*;
import br.utfpr.projetoweb.security.CurrentUser;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import br.utfpr.projetoweb.dto.BookDTO;

import java.util.List;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final FavoriteRepository favoriteRepository;
    private final LocationRepository locationRepository;
    private final CreditCardRepository creditCardRepository;

    public ProfileController(UserRepository userRepository, BookRepository bookRepository,
                             FavoriteRepository favoriteRepository,
                             LocationRepository locationRepository,
                             CreditCardRepository creditCardRepository) {
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.favoriteRepository = favoriteRepository;
        this.locationRepository = locationRepository;
        this.creditCardRepository = creditCardRepository;
    }

    @GetMapping("/user")
    @ResponseBody
    public UserDTO getUser(@CurrentUser UserEntity user){
        return user.toDTO();
    }

    @PatchMapping("/user")
    @ResponseBody
    public UserDTO updateUser(@CurrentUser UserEntity user, @RequestBody UserDTO userDTO){
        
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
    public List<BookDTO> getBookings(@CurrentUser UserEntity user){
        return bookRepository.findByUser(user).stream().map(BookEntity::toDTO).toList();
    }

    @GetMapping("/favorites")
    @ResponseBody
    public java.util.List<FavoriteDTO> getFavorites(@CurrentUser UserEntity user){
        return favoriteRepository.findByUser(user).stream().map(FavoriteEntity::toDTO).toList();
    }

    @PostMapping("/favorites/{locationId}")
    @ResponseBody
    public void addFavorite(@CurrentUser UserEntity user, @PathVariable Long locationId){
        LocationEntity location = locationRepository.findById(locationId).orElseThrow(()->new RuntimeException("Location not found"));
        if(favoriteRepository.findByUserAndLocation(user, location).isEmpty()) {
            favoriteRepository.save(new FavoriteEntity(user, location));
        }
    }

    @DeleteMapping("/favorites/{locationId}")
    @ResponseBody
    public void removeFavorite(@CurrentUser UserEntity user, @PathVariable Long locationId){
        LocationEntity location = locationRepository.findById(locationId).orElseThrow(()->new RuntimeException("Location not found"));
        favoriteRepository.findByUserAndLocation(user, location).ifPresent(favoriteRepository::delete);
    }

    @GetMapping("/cards")
    @ResponseBody
    public List<CreditCardDTO> getCards(@CurrentUser UserEntity user){
        return creditCardRepository.findByUser(user).stream().map(CreditCardEntity::toDTO).toList();
    }

    @PostMapping("/cards")
    @ResponseBody
    public CreditCardDTO addCard(@CurrentUser UserEntity user, @RequestBody CreditCardDTO dto){
        CreditCardEntity card = dto.toEntity();
        card.setUser(user);
        return creditCardRepository.save(card).toDTO();
    }

    @PatchMapping("/cards/{cardId}")
    @ResponseBody
    public CreditCardDTO updateCard(@CurrentUser UserEntity user, @PathVariable Long cardId, @RequestBody CreditCardDTO dto) {
        CreditCardEntity card = creditCardRepository.findByIdAndUser(cardId, user)
                .orElseThrow(() -> new RuntimeException("Cartão não encontrado"));

        if(dto.cardName() != null) card.setCardName(dto.cardName());
        if(dto.cardNumber() != null) card.setCardNumber(dto.cardNumber());
        if(dto.expiry() != null) card.setExpiry(dto.expiry());
        if(dto.cvv() != null) card.setCvv(dto.cvv());

        return creditCardRepository.save(card).toDTO();
    }

    @DeleteMapping("/cards/{cardId}")
    @ResponseBody
    public void removeCard(@CurrentUser UserEntity user, @PathVariable Long cardId){
        creditCardRepository.findByIdAndUser(cardId, user).ifPresent(creditCardRepository::delete);
    }
}
