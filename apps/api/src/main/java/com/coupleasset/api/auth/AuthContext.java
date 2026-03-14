package com.coupleasset.api.auth;

import com.coupleasset.api.error.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class AuthContext {
  private AuthContext() {}

  public static long requireUserId() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal p)) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "unauthorized");
    }
    return p.userId();
  }
}

