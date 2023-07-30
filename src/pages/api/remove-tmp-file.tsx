import { NextApiRequest, NextApiResponse } from "next";
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    serverRuntimeConfig.stop = '0';
    serverRuntimeConfig.send = '0';

    return res.status(200).json({
        MESSAGE:"tmp 파일 삭제 완료"
    });
}