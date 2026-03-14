package com.coupleasset.api.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateMeRequest {
  @NotBlank
  private String displayName;

  public String getDisplayName() {
    return displayName;
  }

  public void setDisplayName(String displayName) {
    this.displayName = displayName;
  }
}

