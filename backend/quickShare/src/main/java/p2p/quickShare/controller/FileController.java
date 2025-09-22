package p2p.quickShare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import p2p.quickShare.service.FileService;

import java.io.IOException;
import java.net.URL;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<Object> uploadFile(@RequestParam("file") MultipartFile[] files) {
        try {
            if (files == null || files.length == 0) {
                return ResponseEntity.badRequest().body("No files uploaded");
            }
            String shareId = fileService.uploadFilesToS3(files);
            String shareLink = fileService.getShareableLink(shareId);
            String shareCode = fileService.getShareCodeByShareId(shareId);
            return ResponseEntity.ok(new UploadResponse(shareId, shareLink, shareCode));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File upload failed: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/validate-code/{code}")
    public ResponseEntity<String> validateCode(@PathVariable String code) {
        try {
            String shareId = fileService.getShareIdByCode(code);
            return ResponseEntity.ok(shareId);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/share-link/{shareId}")
    public ResponseEntity<String> getShareableLink(@PathVariable String shareId) {
        String link = fileService.getShareableLink(shareId);
        return ResponseEntity.ok(link);
    }

    @GetMapping("/download/{shareId}")
    public ResponseEntity<Object> getDownloadUrl(@PathVariable String shareId, @RequestParam(required = false) String code) {
        try {
            // The service will now return a List of objects
            var files = fileService.getPresignedDownloadUrls(shareId, code);
            return ResponseEntity.ok(files);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    // Updated response class to include shareCode
    public static class UploadResponse {
        public final String shareId;
        public final String shareLink;
        public final String shareCode;

        public UploadResponse(String shareId, String shareLink, String shareCode) {
            this.shareId = shareId;
            this.shareLink = shareLink;
            this.shareCode = shareCode;
        }
    }

}