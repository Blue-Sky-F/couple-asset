package com.coupleasset.api.auth;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {
  private String issuer;
  private String secret;
  private int accessTokenMinutes;

  public String getIssuer() {
    return issuer;
  }

  public void setIssuer(String issuer) {
    this.issuer = issuer;
  }

  public String getSecret() {
    return secret;
  }

  public void setSecret(String secret) {
    this.secret = secret;
  }

  public int getAccessTokenMinutes() {
    return accessTokenMinutes;
  }

  public void setAccessTokenMinutes(int accessTokenMinutes) {
    this.accessTokenMinutes = accessTokenMinutes;
  }
}

