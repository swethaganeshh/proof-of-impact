import axios from "axios";

export async function uploadFileToPinata(file: File) {
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

  const formData = new FormData();
  formData.append("file", file);

  const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;

  if (!jwt) {
    throw new Error("Pinata JWT missing");
  }

  const response = await axios.post(url, formData, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    maxBodyLength: Infinity,
  });

  return response.data.IpfsHash;
}
