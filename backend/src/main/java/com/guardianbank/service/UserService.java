package com.guardianbank.service;

import com.guardianbank.model.User;
import java.util.List;
import java.util.Optional;

public interface UserService {
    User registerUser(String username, String password, String email, String fullName);
    Optional<User> getUserById(Long id);
    Optional<User> getUserByUsername(String username);
    Optional<User> getUserByEmail(String email);
    List<User> getAllUsers();
    User updateUser(Long id, String email, String fullName);
    void deleteUser(Long id);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}