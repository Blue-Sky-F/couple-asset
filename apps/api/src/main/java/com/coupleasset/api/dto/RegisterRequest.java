package com.coupleasset.api.dto;

import jakarta.validation.constraints.NotBlank;

public class RegisterRequest {
  private String email;
  private String phone;

  @NotBlank
  private String password;

  @NotBlank
  private String displayName;

  private String householdName;

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getDisplayName() {
    return displayName;
  }

  public void setDisplayName(String displayName) {
    this.displayName = displayName;
  }

  public String getHouseholdName() {
    return householdName;
  }

  public void setHouseholdName(String householdName) {
    this.householdName = householdName;
  }
}

