package com.coupleasset.api.config;

import com.coupleasset.api.auth.JwtAuthFilter;
import com.coupleasset.api.auth.DevAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
  private final JwtAuthFilter jwtAuthFilter;
  private final DevAuthFilter devAuthFilter;

  public SecurityConfig(JwtAuthFilter jwtAuthFilter, DevAuthFilter devAuthFilter) {
    this.jwtAuthFilter = jwtAuthFilter;
    this.devAuthFilter = devAuthFilter;
  }

  @Bean
  SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable());
    http.cors(Customizer.withDefaults());
    http.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
    http.authorizeHttpRequests(
        auth ->
            auth.requestMatchers("/api/health", "/api/auth/**").permitAll().anyRequest().authenticated());
    http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
    http.addFilterAfter(devAuthFilter, JwtAuthFilter.class);
    return http.build();
  }
}
