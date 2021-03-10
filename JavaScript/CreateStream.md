# Create Stream in OCI Web Console

 1. Every *Stream* in OSS belongs to a logical container called *Stream Pool*. We can create a stream pool as shown below
![StreamPool Creation](https://github.com/mayur-oci/OssJs/blob/main/JavaScript/StreamPoolCreation.png?raw=true)

      As shown above for the quick-start guides, we choose *Public Endpoint* for streampools and encryption managed by OCI.
      
 2. Once we have a stream pool created, we can now create the stream within it, as shown below
 ![Stream Creation](https://github.com/mayur-oci/OssJs/blob/main/JavaScript/StreamCreation.png?raw=true)
Make sure to choose radio button *Select Existing Stream Pool* streampool and then right Stream Pool in the dropdown, as shown above. In our case, it would be *StreampoolExample*. Also for our quick-start guide, we are using partition count of 1 for our stream *StreamExample*.

3. For readers interested in using OCI SDK for OSS, you need two pieces of information, viz 1. OCID of the Stream & 2. Message Endpoint of the Stream. You can grab this information, as shown below
![Stream Info for OCI SDK](https://github.com/mayur-oci/OssJs/blob/main/JavaScript/StreamPageInfo.png?raw=true)

4. For readers interested in using Apache Kafka APIs for OSS, you need grab *Kafka Connection Settings* information as shown below.
![Kafka Info](https://github.com/mayur-oci/OssJs/blob/main/JavaScript/StreampoolAllInfo.png?raw=true)

     Please note, username is of the form Your_Oci_Tenancy_Name/Your_Oci_Username/Streampool_Ocid. Since we are going to user based authentication for our quick starts, you will also need to create  [OCI auth-token](https://docs.oracle.com/en-us/iaas/Content/Identity/Tasks/managingcredentials.htm#Working) for your OCI user account. Once you create auth-token that will be your password for your Kafka Connection to OSS.

