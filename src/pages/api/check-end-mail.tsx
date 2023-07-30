import { NextApiRequest, NextApiResponse } from "next";
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    if(serverRuntimeConfig.send === "1"){
        return res.status(200).json({ MESSAGE:"success" });
    }
    return res.status(200).json({ MESSAGE:"자리 없다" });
}