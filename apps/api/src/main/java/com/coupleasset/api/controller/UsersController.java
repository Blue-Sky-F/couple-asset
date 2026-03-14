package com.coupleasset.api.controller;

import com.coupleasset.api.auth.AuthContext;
import com.coupleasset.api.dto.UpdateMeRequest;
import com.coupleasset.api.dto.UserDto;
import com.coupleasset.api.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UsersController {
  private final UserService userService;

  public UsersController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping("/me")
  public UserDto me() {
    long userId = AuthContext.requireUserId();
    return userService.getMe(userId);
  }

  @PutMapping("/me")
  public UserDto updateMe(@Valid @RequestBody UpdateMeRequest req) {
    long userId = AuthContext.requireUserId();
    return userService.updateMe(userId, req);
  }
}

