import { NextApiRequest, NextApiResponse } from "next";
import getConfig from 'next/config';


let timer:NodeJS.Timeout | null;

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    const { serverRuntimeConfig } = getConfig();

      try {
        serverRuntimeConfig.stop = '1';
        return res.status(200).json({
            MESSAGE:"stop 파일 생성"
        });
      } catch (error) {
        return res.status(500).json({

            MESSAGE:error
        });
      }
}