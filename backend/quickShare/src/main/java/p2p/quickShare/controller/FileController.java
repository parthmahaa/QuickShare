package p2p.quickShare.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.getSize() > 50 * 1024 * 1024) {
            return ResponseEntity.badRequest().body("File size exceeds 50MB limit");
        }
        String fileId = UUID.randomUUID().toString();
        FileController fileService;
        String shareCode = fileService.generateShareCode();
        fileService.uploadFile(file, fileId, shareCode);
        return ResponseEntity.ok("File uploaded. Share code: " + shareCode);
    }

    @GetMapping("/download/{shareCode}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable String shareCode) {
        return fileService.downloadFile(shareCode);
    }
}
