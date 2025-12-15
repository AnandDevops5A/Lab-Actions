package com.anand.labbackend.controller;

import com.anand.labbackend.model.Tournament;
import com.anand.labbackend.repository.TournamentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tournaments")
@CrossOrigin(origins = "*")
public class TournamentController {

    private final TournamentRepository repo;

    public TournamentController(TournamentRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Tournament> all() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tournament> get(@PathVariable String id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Tournament create(@RequestBody Tournament t) {
        t.setId(null);
        return repo.save(t);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tournament> update(@PathVariable String id, @RequestBody Tournament t) {
        return repo.findById(id).map(existing -> {
            existing.setName(t.getName());
            existing.setDescription(t.getDescription());
            existing.setDate(t.getDate());
            existing.setParticipants(t.getParticipants());
            return ResponseEntity.ok(repo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
