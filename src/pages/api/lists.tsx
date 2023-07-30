import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import moment from "moment";
import nodemailer from "nodemailer";
import getConfig from 'next/config';

let timer:NodeJS.Timeout | null;

const { serverRuntimeConfig } = getConfig();

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    console.log(req.query)
    
    const query = req.query;
    const { lesson_date, lesson_time, exitTime } = query;
    const sendMail = async (lesson_date:string, lesson_time:string) => {
        // Gmail SMTP 설정
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
            user: process.env.EMAIL, // Gmail 계정
            pass: process.env.PASSWORD, // Gmail 비밀번호
            },
        });

        // 이메일 전송 옵션 설정
        const mailOptions = {
            from: process.env.FROM, // 발신자 이메일 주소
            to: process.env.TO, // 수신자 이메일 주소 (여러 개의 이메일 주소를 쉼표로 구분하여 배열로 전달 가능)
            subject: '제목 : 자리 떴따!!!', // 이메일 제목
            text: `
링크 : https://m.feelcycle.com/reserve \r\n
내용 : 자리떴따!! 확인 꼬!! \r\n
레슨 날짜: ${lesson_date} \r\n
레슨 시간: ${lesson_time} \r\n
                    `, // 이메일 내용 (HTML 형식으로 보낼 경우, 'html' 프로퍼티로 변경)
            };


        try {
            // 이메일 전송
            await transporter.sendMail(mailOptions);
            return {
                "MESSAGE":"메일 송신 성공"
            }
            // return res.status(200).json({
            //     MESSAGE:"메일 송신 성공"
            // });
        } catch (error) {
            return {
                "MESSAGE":"메일 송신 실패"
            }
            // return res.status(500).json({
            //     MESSAGE:"메일 송신 실패"
            // });
        }
    }

    const playInterval = (date:string, time:string, exitTime:string) => {
        // console.log(timer);
        // if(!timer){
        const timeout = setTimeout(async () => {
            console.log("서버단에서 호출됨");
            console.log(serverRuntimeConfig.stop);
            // console.log(typeof timer);
            if(serverRuntimeConfig.stop === '1'){
                console.log(serverRuntimeConfig.stop);
                clearTimeout(timeout);
                timer = null;
                return res.status(200).json({
                    MESSAGE:"탐색 중지",
                });
            }
            const response = await axios.get('https://m.feelcycle.com/api/reserve/lesson_calendar?mode=2&shujiku_type=1&get_direction=1&get_starting_date=2023-07-20&search_store[]=39&search_store[]=27&search_store[]=8&search_store[]=38&search_store[]=15&search_store[]=41&search_store[]=44&search_store[]=46&search_store[]=31&search_store[]=3&search_store[]=4&search_store[]=5&search_store[]=10&search_store[]=17&search_store[]=18&search_store[]=19&search_store[]=21&search_store[]=23&search_store[]=24&search_store[]=26&search_store[]=33&search_store[]=36&search_store[]=43&search_store[]=13&search_store[]=22&search_store[]=28&search_store[]=30&search_store[]=45&search_store[]=20&search_store[]=11&search_store[]=29&search_store[]=47&search_store[]=6&search_store[]=9&search_store[]=34&search_store[]=42&search_store[]=25&search_store[]=35&search_store[]=32&search_store[]=7&shujiku_id=17')
            if(response.status === 200){
                const targetDateInfo = response.data.lesson_list.filter((lesson:any) => lesson.lesson_date === lesson_date);
                // if(targetDateInfo.length === 0){
                //     clearTimeout(timeout);
                //     return res.status(200).json({
                //         MESSAGE:"해당 날짜 레슨 스케쥴 공개 안됨"
                //     });
                // }
                // if(targetDateInfo.length > 0 && targetDateInfo[0].schedule.length === 0){
                //     clearTimeout(timeout);
                //     return res.status(200).json({
                //         MESSAGE:"해당 날짜는 레슨 없는 날(아마 쉬는날?)"
                //     });
                // }
                const targetTime = targetDateInfo[0].schedule.filter((sche:any) => sche.lesson_start == lesson_time);
                // if(targetTime.length === 0){
                //     clearTimeout(timeout);
                //     return res.status(200).json({
                //         MESSAGE:"해당 레슨 시간은 존재하지 않습니다."
                //     });
                // }
                if(targetTime[0].reserve_status_count > 0){
                    const message = await sendMail(date, time);
                    clearTimeout(timeout);
                    timer = null;
                    serverRuntimeConfig.stop = '1';
                    serverRuntimeConfig.send = '1';
                    return res.status(200).json({
                        MESSAGE:message.MESSAGE
                    });
                    // return res.status(200).json(resultMail);
                }
                // if(targetTime[0].reserve_status_count === 0){
                //     return res.status(200).json({
                //         MESSAGE:"자리 없다"
                //     });
                // }
            }
            // console.log(moment().unix())
            // console.log(Number(exitTime))
            if (moment().unix() > Number(exitTime)) {
                clearTimeout(timeout);
                timer = null;
                return res.status(200).json({
                    MESSAGE:`분 동안 자리 없음`
                });
            }
            playInterval(date, time, exitTime);
        }, 1000);
        timer = timeout;
    };

    playInterval(lesson_date as string, lesson_time as string, exitTime as string);
    console.log(887222);
    if(timer){
        return res.status(200).json({
            MESSAGE:"끝",
        });
    }
}
