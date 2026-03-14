package com.coupleasset.api.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
  private final JwtProperties props;
  private final SecretKey key;

  public JwtService(JwtProperties props) {
    this.props = props;
    this.key = buildKey(props.getSecret());
  }

  public String issueAccessToken(long userId) {
    Instant now = Instant.now();
    Instant exp = now.plus(props.getAccessTokenMinutes(), ChronoUnit.MINUTES);
    return Jwts.builder()
        .issuer(props.getIssuer())
        .subject(Long.toString(userId))
        .issuedAt(Date.from(now))
        .expiration(Date.from(exp))
        .signWith(key, Jwts.SIG.HS256)
        .compact();
  }

  public long parseUserId(String token) {
    Claims claims =
        Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    if (claims.getIssuer() == null || !claims.getIssuer().equals(props.getIssuer())) {
      throw new IllegalArgumentException("invalid issuer");
    }
    return Long.parseLong(claims.getSubject());
  }

  private static SecretKey buildKey(String secret) {
    if (secret == null || secret.isBlank()) {
      throw new IllegalStateException("jwt secret missing");
    }
    byte[] raw;
    if (looksLikeBase64(secret)) {
      raw = Decoders.BASE64.decode(secret);
    } else {
      raw = secret.getBytes(StandardCharsets.UTF_8);
    }
    if (raw.length < 32) {
      throw new IllegalStateException("jwt secret too short");
    }
    return Keys.hmacShaKeyFor(raw);
  }

  private static boolean looksLikeBase64(String secret) {
    for (int i = 0; i < secret.length(); i++) {
      char c = secret.charAt(i);
      boolean ok =
          (c >= 'a' && c <= 'z')
              || (c >= 'A' && c <= 'Z')
              || (c >= '0' && c <= '9')
              || c == '+'
              || c == '/'
              || c == '='
              || c == '\n'
              || c == '\r';
      if (!ok) return false;
    }
    return true;
  }
}

