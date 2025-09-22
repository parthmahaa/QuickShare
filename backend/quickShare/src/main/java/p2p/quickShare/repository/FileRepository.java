package p2p.quickShare.repository;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBQueryExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import p2p.quickShare.models.FileMetadata;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class FileRepository {

    @Autowired
    private DynamoDBMapper dynamoDBMapper;

    public void save(FileMetadata fileMetadata) {
        dynamoDBMapper.save(fileMetadata);
    }

    public FileMetadata findByShareId(String shareId) {
        return dynamoDBMapper.load(FileMetadata.class, shareId);
    }

    public void delete(FileMetadata fileMetadata) {
        dynamoDBMapper.delete(fileMetadata);
    }

    public List<FileMetadata> findByShareCode(String shareCode) {
        Map<String, AttributeValue> eav = new HashMap<>();
        eav.put(":shareCode", new AttributeValue().withS(shareCode));

        DynamoDBQueryExpression<FileMetadata> queryExpression = new DynamoDBQueryExpression<FileMetadata>()
                .withIndexName("shareCode-index")
                .withConsistentRead(false)
                .withKeyConditionExpression("shareCode = :shareCode")
                .withExpressionAttributeValues(eav);

        List<FileMetadata> results = dynamoDBMapper.query(FileMetadata.class, queryExpression);
        return results;
    }

    // New method to fetch all files by shareId
    public List<FileMetadata> findAllByShareId(String shareId) {
        Map<String, AttributeValue> eav = new HashMap<>();
        eav.put(":shareId", new AttributeValue().withS(shareId));

        DynamoDBQueryExpression<FileMetadata> queryExpression = new DynamoDBQueryExpression<FileMetadata>()
                .withKeyConditionExpression("shareId = :shareId")
                .withExpressionAttributeValues(eav);

        return dynamoDBMapper.query(FileMetadata.class, queryExpression);
    }
}