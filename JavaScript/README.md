
# OCI JavaScript SDK for OSS

This quickstart shows how to produce messages to and consume messages from an **Oracle Streaming Service**{oss docs link @jb} using the OCI JavaScript SDK{github link @jb}.

## Prerequisites

1. OCI account subscription or free account. typical links @jb
2. Follow these steps[TODO] to create Streampool and Stream in OCI. If you do  already have stream created, follow these steps[TODO] to capture/record message endpoint and OCID of the streampool and the stream. We need this info for this quickstart.
3. Node.js version 8.x or later. Download the latest [long-term support (LTS) version](https://nodejs.org).  
4. Visual Studio Code (recommended) or any other integrated development environment (IDE).
5. Install this OCI JavaScript SDK.
Open a command prompt that has *npm* in its path, change to directory
where you want to keep your code for this quickstart, and then run the following command to install this OCI JavaScript SDK:
```
npm install oci-sdk
```
4- Make sure you have [SDK and CLI Configuration File](https://docs.oracle.com/en-us/iaas/Content/API/Concepts/sdkconfig.htm#SDK_and_CLI_Configuration_File) setup, for this quickstart. For production, you should use [Instance Principle Authentication](https://docs.oracle.com/en-us/iaas/Content/Identity/Tasks/callingservicesfrominstances.htm)

