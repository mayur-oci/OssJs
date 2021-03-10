
const common = require("oci-common");
const st = require("oci-streaming"); // OCI SDK package for OSS

const ociConfigFile = "C:\\.oci\\config";
const ociProfileName = "DEFAULT";
const ociMessageEndpointForStream = "https://cell-1.streaming.ap-mumbai-1.oci.oraclecloud.com";
const ociStreamOcid = "ocid1.stream.oc1.ap-mumbai-1.amaaaaaauwpiejqap7zi4qveifbb6rh7qamqedjhkphqdejdb4bsg7bfnjla";

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
