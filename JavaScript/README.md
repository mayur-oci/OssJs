
# QuckStart with OCI JavaScript SDK for OSS

This quickstart shows how to produce messages to and consume messages from an **Oracle Streaming Service**{oss docs link @jb} using the OCI JavaScript SDK{github link @jb}.

## Prerequisites

1. OCI account subscription or free account. typical links @jb
2. Follow these steps[TODO] to create Streampool and Stream in OCI. If you do  already have stream created, follow these steps[TODO] to capture/record message endpoint and OCID of the streampool and the stream. We need this info for this quickstart.
3. Node.js version 8.x or later. Download the latest [long-term support (LTS) version](https://nodejs.org).  
4. Visual Studio Code (recommended) or any other integrated development environment (IDE).
5. Install this OCI JavaScript SDK.
Open a command prompt that has *npm* in its path, change to directory(call it *wd*)
where you want to keep your code for this quickstart, and then run the following command to install this OCI JavaScript SDK:
```
npm install oci-sdk
```
6. Make sure you have [SDK and CLI Configuration File](https://docs.oracle.com/en-us/iaas/Content/API/Concepts/sdkconfig.htm#SDK_and_CLI_Configuration_File) setup, for this quickstart. For production, you should use [Instance Principle Authentication](https://docs.oracle.com/en-us/iaas/Content/Identity/Tasks/callingservicesfrominstances.htm).

##Producing message to OSS
7. Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com) from the directory *wd*. You should already have oci-sdk packages for JavaScript installed in this directory
8. Create new file named Producer.js in this directory and paste the following code in it.
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
10. In the OCI Web Console, quickly go to your Stream Page and click on *Load Messages* button. You should see the messages we just produced as below.
![See Produced Messages in OCI Wb Console](https://github.com/mayur-oci/OssJs/blob/main/JavaScript/StreamExampleLoadMessages.png?raw=true)

  




