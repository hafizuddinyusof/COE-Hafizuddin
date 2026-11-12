package com.example.demo;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") 
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            return ResponseEntity.badRequest().body("Username is already taken!");
        }

        User user = new User();
        user.setUsername(request.username());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setEmail(request.email());
        user.setContactNo(request.contactNo());
        user.setRole(request.role() != null && request.role().equalsIgnoreCase("ADMIN") ? Role.ADMIN : Role.USER);

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest request) {
        return userRepository.findByUsername(request.username())
            .filter(user -> passwordEncoder.matches(request.password(), user.getPassword()))
            .<ResponseEntity<?>>map(user -> ResponseEntity.ok(new AuthResponse(
                "mock-jwt-token-key", 
                user.getUsername(), 
                user.getEmail(), 
                user.getContactNo(), 
                user.getRole().name()
            )))
            .orElseGet(() -> ResponseEntity.status(401).body("Invalid credentials"));
    }
}