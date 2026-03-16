package com.coupleasset.api.seed;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.seed")
public class SeedProperties {
  private boolean enabled;
  private String householdName;
  private String user1Name;
  private String user1Phone;
  private String user2Name;
  private String user2Phone;
  private String password;

  public boolean isEnabled() {
    return enabled;
  }

  public void setEnabled(boolean enabled) {
    this.enabled = enabled;
  }

  public String getHouseholdName() {
    return householdName;
  }

  public void setHouseholdName(String householdName) {
    this.householdName = householdName;
  }

  public String getUser1Name() {
    return user1Name;
  }

  public void setUser1Name(String user1Name) {
    this.user1Name = user1Name;
  }

  public String getUser1Phone() {
    return user1Phone;
  }

  public void setUser1Phone(String user1Phone) {
    this.user1Phone = user1Phone;
  }

  public String getUser2Name() {
    return user2Name;
  }

  public void setUser2Name(String user2Name) {
    this.user2Name = user2Name;
  }

  public String getUser2Phone() {
    return user2Phone;
  }

  public void setUser2Phone(String user2Phone) {
    this.user2Phone = user2Phone;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }
}

