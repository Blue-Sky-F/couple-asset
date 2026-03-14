package com.coupleasset.api.controller;

import com.coupleasset.api.auth.AuthContext;
import com.coupleasset.api.dto.AssetDto;
import com.coupleasset.api.dto.CreateAssetRequest;
import com.coupleasset.api.dto.UpdateAssetRequest;
import com.coupleasset.api.service.AssetService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/assets")
public class AssetsController {
  private final AssetService assetService;

  public AssetsController(AssetService assetService) {
    this.assetService = assetService;
  }

  @GetMapping
  public List<AssetDto> list(
      @RequestParam(name = "scope", required = false) String scope,
      @RequestParam(name = "ownerUserId", required = false) Long ownerUserId) {
    long userId = AuthContext.requireUserId();
    return assetService.list(userId, scope, ownerUserId);
  }

  @PostMapping
  public AssetDto create(@Valid @RequestBody CreateAssetRequest req) {
    long userId = AuthContext.requireUserId();
    return assetService.create(userId, req);
  }

  @PutMapping("/{id}")
  public AssetDto update(@PathVariable("id") long id, @Valid @RequestBody UpdateAssetRequest req) {
    long userId = AuthContext.requireUserId();
    return assetService.update(userId, id, req);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable("id") long id) {
    long userId = AuthContext.requireUserId();
    assetService.delete(userId, id);
  }
}

