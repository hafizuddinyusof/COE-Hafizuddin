package com.example.demo;

public record AuthResponse(String token, String username, String email, String contactNo, String role) {}