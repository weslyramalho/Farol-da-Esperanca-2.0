package com.faroldaesperanca.api.controllers;

import com.faroldaesperanca.api.dtos.JobDTO;
import com.faroldaesperanca.api.services.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*") // Permitir requisições de qualquer origem (ajustar para produção)
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public ResponseEntity<List<JobDTO>> getAllJobs() {
        List<JobDTO> jobs = jobService.getAllJobs();
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDTO> getJobById(@PathVariable Long id) {
        return jobService.getJobById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<JobDTO>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location) {
        List<JobDTO> jobs = jobService.searchJobs(keyword, location);
        return ResponseEntity.ok(jobs);
    }
}