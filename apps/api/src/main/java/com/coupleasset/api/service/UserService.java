package com.coupleasset.api.service;

import com.coupleasset.api.dto.UpdateMeRequest;
import com.coupleasset.api.dto.UserDto;
import com.coupleasset.api.entity.UserEntity;
import com.coupleasset.api.error.ApiException;
import com.coupleasset.api.repo.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
  private final UserRepository userRepo;

  public UserService(UserRepository userRepo) {
    this.userRepo = userRepo;
  }

  public UserEntity requireById(long userId) {
    return userRepo
        .findById(userId)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "NOT_FOUND", "not found"));
  }

  public UserDto getMe(long userId) {
    return AuthService.toUserDto(requireById(userId));
  }

  @Transactional
  public UserDto updateMe(long userId, UpdateMeRequest req) {
    UserEntity u = requireById(userId);
    u.setDisplayName(req.getDisplayName().trim());
    return AuthService.toUserDto(u);
  }
}

