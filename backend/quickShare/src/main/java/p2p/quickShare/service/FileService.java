package p2p.quickShare.service;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import p2p.quickShare.models.FileMetadata;
import p2p.quickShare.repository.FileRepository;

import java.io.IOException;
import java.net.URL;
import java.util.*;

@Service
@RequiredArgsConstructor
public class FileService {


    private final AmazonS3 s3Client;

    private final FileRepository fileRepository;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Value("${app.file.expiry.hours:24}")
    private long expiryHours;

    @Value("${app.base.url}")
    private String baseUrl;

    private final Random random = new Random();

    public String generateShareId() {
        return UUID.randomUUID().toString().substring(0, 8); // Short unique code
    }

    public String generateShareCode() {
        return String.format("%06d", random.nextInt(1000000)); // 6-digit OTP
    }

    public String uploadFilesToS3(MultipartFile[] files) throws IOException {
        if (files == null || files.length == 0) {
            throw new IllegalArgumentException("No files uploaded");
        }

        String shareId = generateShareId();
        String shareCode = generateUniqueShareCode();
        long expiryTime = System.currentTimeMillis() / 1000 + expiryHours * 3600;

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;
            String fileName = file.getOriginalFilename();
            if (fileName == null || fileName.isEmpty()) continue;
            String s3Key = shareId + "/" + fileName;
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(file.getContentType());
            metadata.setContentLength(file.getSize());
            PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, s3Key, file.getInputStream(), metadata);
            s3Client.putObject(putObjectRequest);

            FileMetadata metadataRecord = new FileMetadata();
            metadataRecord.setShareId(shareId);
            metadataRecord.setFileName(fileName);
            metadataRecord.setS3Key(s3Key);
            metadataRecord.setExpiryTime(expiryTime);
            metadataRecord.setShareCode(shareCode);
            fileRepository.save(metadataRecord);
        }

        return shareId;
    }

    private String generateUniqueShareCode() {
        String shareCode="";
        boolean unique = false;
        int attempts = 0;
        final int maxAttempts = 5;
        while (!unique && attempts < maxAttempts) {
            shareCode = generateShareCode();
            if (fileRepository.findByShareCode(shareCode).isEmpty()) {
                unique = true;
            }
            attempts++;
        }
        if (!unique || shareCode == null) {
            throw new RuntimeException("Unable to generate unique share code.");
        }
        return shareCode;
    }

    public String getShareableLink(String shareId) {
        List<FileMetadata> metadataList = fileRepository.findAllByShareId(shareId);
        if (metadataList == null || metadataList.isEmpty()) {
            throw new RuntimeException("File not found");
        }
        FileMetadata metadata = metadataList.getFirst();
        if (System.currentTimeMillis() / 1000 > metadata.getExpiryTime()) {
            throw new RuntimeException("File expired");
        }

        return baseUrl + "/api/files/download/" + shareId + "?code=" + metadata.getShareCode();
    }

    public String getShareIdByCode(String code) {
        List<FileMetadata> metadataList = fileRepository.findByShareCode(code);

        if (metadataList == null || metadataList.isEmpty()) {
            throw new RuntimeException("Invalid or expired share code");
        }

        FileMetadata metadata = metadataList.getFirst();
        if (System.currentTimeMillis() / 1000 > metadata.getExpiryTime()) {
            throw new RuntimeException("Share code expired");
        }
        return metadata.getShareId();
    }

    public List<FileDownloadInfo> getPresignedDownloadUrls(String shareId, String code) {
        List<FileMetadata> files = fileRepository.findAllByShareId(shareId);
        if (files == null || files.isEmpty()) throw new RuntimeException("Files not found");
        if (System.currentTimeMillis() / 1000 > files.getFirst().getExpiryTime()) throw new RuntimeException("Files expired");
        if (code != null && !code.equals(files.getFirst().getShareCode())) throw new RuntimeException("Invalid share code");

        List<FileDownloadInfo> fileInfos = new ArrayList<>();
        for (FileMetadata file : files) {
            // Generate the pre-signed URL
            GeneratePresignedUrlRequest request = new GeneratePresignedUrlRequest(bucketName, file.getS3Key())
                    .withMethod(HttpMethod.GET)
                    .withExpiration(new Date(System.currentTimeMillis() + 3600 * 1000)); // 1 hour expiry
            URL url = s3Client.generatePresignedUrl(request);

            // Get file size from S3 metadata
            S3Object s3Object = s3Client.getObject(bucketName, file.getS3Key());
            long fileSize = s3Object.getObjectMetadata().getContentLength();

            fileInfos.add(new FileDownloadInfo(file.getFileName(), fileSize, url.toString()));
        }
        return fileInfos;
    }

    public List<FileMetadata> getFileMetadataForShare(String shareId, String code) {
        List<FileMetadata> files = fileRepository.findAllByShareId(shareId);
        if (files == null || files.isEmpty()) {
            throw new RuntimeException("Files not found or share ID is invalid.");
        }
        if (System.currentTimeMillis() / 1000 > files.getFirst().getExpiryTime()) {
            throw new RuntimeException("This share has expired.");
        }
        if (code != null && !code.equals(files.getFirst().getShareCode())) {
            throw new RuntimeException("Invalid share code.");
        }
        return files;
    }

    public S3ObjectInputStream downloadFileFromS3(String s3Key) {
        S3Object s3Object = s3Client.getObject(bucketName, s3Key);
        return s3Object.getObjectContent();
    }

    public String getShareCodeByShareId(String shareId) {
        List<FileMetadata> metadataList = fileRepository.findAllByShareId(shareId);

        if (metadataList == null || metadataList.isEmpty()) {
            throw new RuntimeException("File not found");
        }

        return metadataList.getFirst().getShareCode();
    }

    public static class FileDownloadInfo {
        public final String name;
        public final long size;
        public final String url;

        public FileDownloadInfo(String name, long size, String url) {
            this.name = name;
            this.size = size;
            this.url = url;
        }
    }
}