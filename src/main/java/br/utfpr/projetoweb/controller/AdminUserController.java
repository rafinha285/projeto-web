package br.utfpr.projetoweb.controller;

import br.utfpr.projetoweb.dto.UserDTO;
import br.utfpr.projetoweb.entities.UserEntity;
import br.utfpr.projetoweb.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {
    private final UserRepository userRepository;

    public AdminUserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(UserEntity::toDTO).collect(Collectors.toList());
    }

    @PatchMapping
    public UserDTO patchUser(@RequestParam("email") String email, @RequestBody UserDTO userDTO) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        if (userDTO.name() != null) user.setName(userDTO.name());
        if (userDTO.role() != null) user.setRole(userDTO.role());
        if (userDTO.dataNascimento() != null) user.setDataNascimento(userDTO.dataNascimento());
        if (userDTO.nacionalidade() != null) user.setNacionalidade(userDTO.nacionalidade());
        if (userDTO.numTelefone() != null) user.setNumTelefone(userDTO.numTelefone());
        if (userDTO.cidade() != null) user.setCidade(userDTO.cidade());
        if (userDTO.bio() != null) user.setBio(userDTO.bio());
        // Do not update password unless explicitly requested

        return userRepository.save(user).toDTO();
    }
}
