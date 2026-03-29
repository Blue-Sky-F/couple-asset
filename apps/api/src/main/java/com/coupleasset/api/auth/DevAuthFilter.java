package com.coupleasset.api.auth;

import com.coupleasset.api.config.DevAuthProperties;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class DevAuthFilter extends OncePerRequestFilter {
  private final DevAuthProperties properties;

  public DevAuthFilter(DevAuthProperties properties) {
    this.properties = properties;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    if (!properties.isEnabled()) {
      filterChain.doFilter(request, response);
      return;
    }

    String uri = request.getRequestURI();
    if (uri != null && uri.startsWith("/api/auth/")) {
      filterChain.doFilter(request, response);
      return;
    }

    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal)) {
      UserPrincipal principal = new UserPrincipal(properties.getUserId());
      UsernamePasswordAuthenticationToken devAuth =
          new UsernamePasswordAuthenticationToken(principal, null, List.of());
      devAuth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
      SecurityContextHolder.getContext().setAuthentication(devAuth);
    }

    filterChain.doFilter(request, response);
  }
}

