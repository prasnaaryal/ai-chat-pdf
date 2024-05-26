import { PineconeClient } from '@pinecone-database/pinecone';
import { downloadFromS3 } from "./s3-server";


let pinecone: PineconeClient | null=null;

export const getPineconeClient=async()=>{
    if(!pinecone){
        pinecone=new PineconeClient()
        await pinecone.init({
            apiKey:process.env.PINCONE_API_KEY!
        })
    }

    return pinecone
}

export async function loadS3IntoPinecone(fileKey:string){
    //obtain the pdf ->download and read from pdf'

    console.log("downloading s3 into file system");
    const file_name = await downloadFromS3(fileKey);

}