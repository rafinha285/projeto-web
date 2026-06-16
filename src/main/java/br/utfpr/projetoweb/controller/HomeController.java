package br.utfpr.projetoweb.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {
    
    @GetMapping(value = {"/", "/home"})
    public String home(){
        return "home";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/register")
    public String register() {
        return "register";
    }

    @GetMapping("/search")
    public String search() {
        return "search";
    }

    @GetMapping("/profile")
    public String profile() {
        return "profile";
    }

    @GetMapping("/gerenciamento")
    public String gerenciamento() {
        return "gerenciamento";
    }

    @GetMapping("/admin-locations")
    public String adminLocations() {
        return "admin-locations";
    }

    @GetMapping("/reserve")
    public String reserve() {
        return "reserve";
    }
}
