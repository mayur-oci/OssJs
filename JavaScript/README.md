
# QuickStart with OCI JavaScript SDK for OSS

This quickstart shows how to produce messages to and consume messages from an **Oracle Streaming Service**{oss docs link @jb} using the OCI JavaScript SDK{github link @jb}.

## Prerequisites

1. You need have OCI account subscription or free account. typical links @jb
2. Follow [these steps](https://github.com/mayur-oci/OssJs/blob/main/JavaScript/CreateStream.md) to create Streampool and Stream in OCI. If you do  already have stream created, refer step 3 [here](https://github.com/mayur-oci/OssJs/blob/main/JavaScript/CreateStream.md) to capture/record message endpoint and OCID of the stream. We need this Information for upcoming steps.
3. Node.js version 8.x or later. Download the latest [long-term support (LTS) version](https://nodejs.org).  
4. Visual Studio Code(recommended) or any other integrated development environment (IDE).
5. Install this OCI JavaScript SDK.
Open a command prompt that has *npm* in its path, change to directory(call it *wd*)
where you want to keep your code for this quickstart, and then run the following command to install this OCI JavaScript SDK:
```
npm install oci-sdk
```
6. Make sure you have [SDK and CLI Configuration File](https://docs.oracle.com/en-us/iaas/Content/API/Concepts/sdkconfig.htm#SDK_and_CLI_Configuration_File) setup. For production, you should use [Instance Principle Authentication](https://docs.oracle.com/en-us/iaas/Content/Identity/Tasks/callingservicesfrominstances.htm).

## Producing messages to OSS
1. Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com) from the directory *wd*. You should already have oci-sdk packages for JavaScript installed in this directory(as per the *step 5 of Prerequisites* section ).
2. Create new file named *Producer.js* in this directory and paste the following code in it.
```JavaScript
const common = require("oci-common");
const st = require("oci-streaming"); // OCI SDK package for OSS

const ociConfigFile = "YOUR_OCI_CONFGI_FILE_PATH";
const ociProfileName = "YOUR_OCI_PROFILE_FOR_USER_WHO_CREATED_THE_STREAM";
const ociMessageEndpointForStream = "MESSAGE_ENDPOINT_FROM_STREAM_CREATION_STEP";
const ociStreamOcid = "OCID_FOR_THE_STREAM_YOU_CREATED";

// provide authentication for OCI and OSS
const provider = new common.ConfigFileAuthenticationDetailsProvider(ociConfigFile, ociProfileName);
  
async function main() {
  // OSS client to produce and consume messages from a Stream in OSS
  const client = new st.StreamClient({ authenticationDetailsProvider: provider });

  client.endpoint = ociMessageEndpointForStream;

  // build up a putRequest and publish some messages to the stream
  let messages = [];
  for (let i = 1; i <= 3; i++) {
    let entry = {
      key: Buffer.from("messageKey" + i).toString("base64"),
      value: Buffer.from("messageValue" + i).toString("base64")
    };
    messages.push(entry);
  }

  console.log("Publishing %s messages to stream %s.", messages.length, ociStreamOcid);
  const putMessageDetails = { messages: messages };
  const putMessagesRequest = {
    putMessagesDetails: putMessageDetails,
    streamId: ociStreamOcid
  };
  const putMessageResponse = await client.putMessages(putMessagesRequest);
  for (var entry of putMessageResponse.putMessagesResult.entries)
    console.log("Published messages to parition %s, offset %s", entry.partition, entry.offset);

}

main().catch((err) => {
  console.log("Error occurred: ", err);
});
```
3. In the OCI Web Console, quickly go to your Stream Page and click on *Load Messages* button. You should see the messages we just produced as below.
![See Produced Messages in OCI Wb Console](https://github.com/mayur-oci/OssJs/blob/main/JavaScript/StreamExampleLoadMessages.png?raw=true)

  
## Consuming messages from OSS
1. First produce messages to the stream you want to consumer message from unless you already have messages in the stream. You can produce message easily from *OCI Web Console* using simple *Produce Test Message* button as shown below
![Produce Test Message Button](https://github.com/mayur-oci/OssJs/blob/main/JavaScript/ProduceButton.png?raw=true)
 
 You can produce multiple test messages by clicking *Produce* button back to back, as shown below
![Produce multiple test message by clicking Produce button](https://github.com/mayur-oci/OssJs/blob/main/JavaScript/ActualProduceMessagePopUp.png?raw=true)
2. Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com) from the directory *wd*. You should already have oci-sdk packages for JavaScript installed in this directory(as per the *step 5 of Prerequisites* section ).
3. Create new file named *Consumer.js* in this directory and paste the following code in it.
```JavaScript
const common = require("oci-common");
const st = require("oci-streaming"); // OCI SDK package for OSS

const ociConfigFile = "YOUR_OCI_CONFGI_FILE_PATH";
const ociProfileName = "YOUR_OCI_PROFILE_FOR_USER_WHO_CREATED_THE_STREAM";
const ociMessageEndpointForStream = "MESSAGE_ENDPOINT_FROM_STREAM_CREATION_STEP";
const ociStreamOcid = "OCID_FOR_THE_STREAM_YOU_CREATED";

// provide authentication for OCI and OSS
const provider = new common.ConfigFileAuthenticationDetailsProvider(ociConfigFile, ociProfileName);
  
const consumerGroupName = "exampleGroup";
const consumerGroupInstanceName = "exampleInstance-1";

async function main() {
  // OSS client to produce and consume messages from a Stream in OSS
  const client = new st.StreamClient({ authenticationDetailsProvider: provider });
  client.endpoint = ociMessageEndpointForStream;

  // A cursor can be created as part of a consumer group.
  // Committed offsets are managed for the group, and partitions
  // are dynamically balanced amongst consumers in the group.
  console.log("Starting a simple message loop with a group cursor");
  const groupCursor = await getCursorByGroup(client, ociStreamOcid, consumerGroupName, consumerGroupInstanceName);
  await consumerMsgLoop(client, ociStreamOcid, groupCursor);
}

main().catch((err) => {
    console.log("Error occurred: ", err);
}); 

async function consumerMsgLoop(client, streamId, initialCursor) {
    let cursor = initialCursor;
    for (var i = 0; i < 10; i++) {
      const getRequest = {
        streamId: streamId,
        cursor: cursor,
        limit: 2
      };
      const response = await client.getMessages(getRequest);
      console.log("Read %s messages.", response.items.length);
      for (var message of response.items) {
        if (message.key !== null)  {         
            console.log("%s: %s",
            Buffer.from(message.key, "base64").toString(),
            Buffer.from(message.value, "base64").toString());
        }
       else{
            console.log("Null: %s",
                Buffer.from(message.value, "base64").toString() );
       }
      }
      // getMessages is a throttled method; clients should retrieve sufficiently large message
      // batches, as to avoid too many http requests.
      await delay(2);
      cursor = response.opcNextCursor;
    }
  }
  

async function getCursorByGroup(client, streamId, groupName, instanceName) {
    console.log("Creating a cursor for group %s, instance %s.", groupName, instanceName);
    const cursorDetails = {
      groupName: groupName,
      instanceName: instanceName,
      type: st.models.CreateGroupCursorDetails.Type.TrimHorizon,
      commitOnGet: true
    };
    const createCursorRequest = {
      createGroupCursorDetails: cursorDetails,
      streamId: streamId
    };
    const response = await client.createGroupCursor(createCursorRequest);
    return response.cursor.value;
}

async function delay(s) {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
}
```
4. Run the code on the terminal(from the same directory *wd*) follows 
```
node run Consumer.js
```
5. You should see the messages as shown below. Note when we produce message from OCI Web Console(as described above in first step), the Key for each message is *Null*
```
$:/path/to/directory/wd>node Consumer.js
Starting a simple message loop with a group cursor
Creating a cursor for group exampleGroup, instance exampleInstance-1.
Read 1 messages.
Null: Example Test Message 0
Read 1 messages.
Null: Example Test Message 0
Read 1 messages.
Null: Example Test Message 0
Read 2 messages.
Null: Example Test Message 0
Null: Example Test Message 0
Read 2 messages.
Null: Example Test Message 0
Null: Example Test Message 0
```

## Next Steps
Please refer to

 1. [Github for OCI Javascript SDK](https://github.com/oracle/oci-typescript-sdk)
 2. [Streaming Examples with Admin and Client APIs from OCI](https://github.com/oracle/oci-typescript-sdk/blob/master/examples/javascript/streaming.js)
