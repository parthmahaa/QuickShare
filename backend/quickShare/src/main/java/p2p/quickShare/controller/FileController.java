package p2p.quickShare.controller;

import com.amazonaws.services.s3.model.S3ObjectInputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import p2p.quickShare.models.FileMetadata;
import p2p.quickShare.service.FileService;

import java.io.IOException;
import java.net.URL;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

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
    public ResponseEntity<?> download(@PathVariable String shareId,
                                      @RequestParam(required = false) String code,
                                      @RequestHeader(value = "X-Client-Request", required = false) String clientRequest,
                                      HttpServletResponse response) throws IOException {

        if ("true".equals(clientRequest)) {
            var files = fileService.getPresignedDownloadUrls(shareId, code);
            return ResponseEntity.ok(files);
        } else {
            List<FileMetadata> filesToDownload = fileService.getFileMetadataForShare(shareId, code);

            response.setContentType("application/zip");
            response.setHeader("Content-Disposition", "attachment; filename=\"quickshare_files.zip\"");

            try (ZipOutputStream zipOut = new ZipOutputStream(response.getOutputStream())) {
                for (FileMetadata fileMeta : filesToDownload) {
                    zipOut.putNextEntry(new ZipEntry(fileMeta.getFileName()));
                    try (S3ObjectInputStream s3Stream = fileService.downloadFileFromS3(fileMeta.getS3Key())) {
                        s3Stream.transferTo(zipOut);
                    }
                    zipOut.closeEntry();
                }
            }
            return null;
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