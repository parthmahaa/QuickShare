package p2p.quickShare.models;

import com.amazonaws.services.dynamodbv2.datamodeling.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@DynamoDBTable(tableName = "FileMetadata")
public class FileMetadata {
    // The partition key: groups all files in a share together.
    @DynamoDBHashKey(attributeName = "shareId")
    private String shareId;

    @DynamoDBRangeKey(attributeName = "s3Key")
    private String s3Key;

    @DynamoDBAttribute(attributeName = "fileName")
    private String fileName;

    @DynamoDBAttribute(attributeName = "expiryTime")
    private Long expiryTime;

    @DynamoDBIndexHashKey(globalSecondaryIndexName = "shareCode-index", attributeName = "shareCode")
    private String shareCode;
}
