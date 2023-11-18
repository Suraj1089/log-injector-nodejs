
## Log Ingestor and Query Interface

Objective
Develop a log ingestor system that can efficiently handle vast volumes of log data, and offer a simple interface for querying this data using full-text search or specific field filters.
Both the systems (the log ingestor and the query interface) can be built using any programming language of your choice.
The logs should be ingested (in the log ingestor) over HTTP, on port 3000.
We will use a script to populate the logs into your system, so please ensure that the default port is set to the port mentioned above.
Sample Log Data Format:
The logs to be ingested will be sent in this format.
​```json
{
	"level": "error",
	"message": "Failed to connect to DB",
    "resourceId": "server-1234",
	"timestamp": "2023-09-15T08:00:00Z",
	"traceId": "abc-xyz-123",
    "spanId": "span-456",
    "commit": "5e5342f",
    "metadata": {
        "parentResourceId": "server-0987"
    }
}
```