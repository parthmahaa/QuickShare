package p2p.quickShare.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.ProfileCredentialsProvider;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.Random;

@Service
public class FileService {
    private final S3Client s3Client;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Value("${aws.profile:default}")
    private String awsProfile;

    @Autowired
    public FileService() {
        this.s3Client = S3Client.builder()
                .region(Region.AP_SOUTH_1)
                .credentialsProvider(ProfileCredentialsProvider.create(awsProfile))
                .build();
    }

    public void uploadFile(MultipartFile file, String fileId, String shareCode) {
        try {
            // Virus scan placeholder (integrate ClamAV via Lambda for production)
            // if (!scanFile(file)) throw new RuntimeException("Virus detected");

            // Upload file to S3
            String key = "files/" + fileId;
            s3Client.putObject(PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build(), software.amazon.awssdk.core.sync.RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            // Add metadata as S3 object tags
            long expirationTime = Instant.now().plusSeconds(7 * 24 * 3600).getEpochSecond();
            List<Tag> tags = List.of(
                    software.amazon.awssdk.services.s3.model.Tag.builder().key("shareCode").value(shareCode).build(),
                    software.amazon.awssdk.services.s3.model.Tag.builder().key("fileName").value(file.getOriginalFilename()).build(),
                    software.amazon.awssdk.services.s3.model.Tag.builder().key("expirationTime").value(String.valueOf(expirationTime)).build()
            );
            s3Client.putObjectTagging(PutObjectTaggingRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .tagging(Tagging.builder().tagSet(tags).build())
                    .build());
        } catch (IOException e) {
            throw new RuntimeException("Upload failed", e);
        }
    }

    public ResponseEntity<byte[]> downloadFile(String shareCode) {
        // Find object by shareCode tag
        ListObjectsV2Request listRequest = ListObjectsV2Request.builder()
                .bucket(bucketName)
                .prefix("files/")
                .build();
        ListObjectsV2Response listResponse = s3Client.listObjectsV2(listRequest);
        String fileKey = null;
        String fileName = null;

        for (S3Object obj : listResponse.contents()) {
            GetObjectTaggingRequest tagRequest = GetObjectTaggingRequest.builder()
                    .bucket(bucketName)
                    .key(obj.key())
                    .build();
            GetObjectTaggingResponse tags = s3Client.getObjectTagging(tagRequest);
            for (Tag tag : tags.tagSet()) {
                if (tag.key().equals("shareCode") && tag.value().equals(shareCode)) {
                    fileKey = obj.key();
                    break;
                }
            }
            if (fileKey != null) {
                // Get fileName from tags
                for (Tag tag : tags.tagSet()) {
                    if (tag.key().equals("fileName")) {
                        fileName = tag.value();
                        break;
                    }
                }
                break;
            }
        }

        if (fileKey == null) {
            return ResponseEntity.notFound().build();
        }

        // Download file from S3
        ResponseBytes<GetObjectResponse> object = s3Client.getObjectAsBytes(GetObjectRequest.builder()
                .bucket(bucketName)
                .key(fileKey)
                .build());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(object.asByteArray());
    }

    public String generateShareCode() {
        String chars = "0123456789";
        Random rnd = new Random();
        StringBuilder code = new StringBuilder(6);
        for (int i = 0; i < 6; i++) {
            code.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return code.toString();
    }

    private boolean scanFile(MultipartFile file) {
        // Placeholder for ClamAV integration
        return true;
    }
}
