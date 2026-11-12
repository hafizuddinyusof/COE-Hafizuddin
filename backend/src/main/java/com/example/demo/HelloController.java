package com.example.demo;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200") // Allows Angular (running on port 4200) to connect
public class HelloController {

    @GetMapping("/hello")
    public String getHello() {
        return "Hello from Spring Boot!";
    }
}