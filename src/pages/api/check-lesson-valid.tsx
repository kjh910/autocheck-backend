import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";


export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    const query = req.query;
    const { lesson_date, lesson_time } = query;
    const response = await axios.get('https://m.feelcycle.com/api/reserve/lesson_calendar?mode=2&shujiku_type=1&get_direction=1&get_starting_date=2023-07-20&search_store[]=39&search_store[]=27&search_store[]=8&search_store[]=38&search_store[]=15&search_store[]=41&search_store[]=44&search_store[]=46&search_store[]=31&search_store[]=3&search_store[]=4&search_store[]=5&search_store[]=10&search_store[]=17&search_store[]=18&search_store[]=19&search_store[]=21&search_store[]=23&search_store[]=24&search_store[]=26&search_store[]=33&search_store[]=36&search_store[]=43&search_store[]=13&search_store[]=22&search_store[]=28&search_store[]=30&search_store[]=45&search_store[]=20&search_store[]=11&search_store[]=29&search_store[]=47&search_store[]=6&search_store[]=9&search_store[]=34&search_store[]=42&search_store[]=25&search_store[]=35&search_store[]=32&search_store[]=7&shujiku_id=17')

    if(response.status === 200){
        const targetDateInfo = response.data.lesson_list.filter((lesson:any) => lesson.lesson_date === lesson_date);
        if(targetDateInfo.length === 0){
            return res.status(200).json({
                MESSAGE:"해당 날짜 레슨 스케쥴 공개 안됨"
            });
        }
        if(targetDateInfo.length > 0 && targetDateInfo[0].schedule.length === 0){
            return res.status(200).json({
                MESSAGE:"해당 날짜는 레슨 없는 날(아마 쉬는날?)"
            });
        }
        const targetTime = targetDateInfo[0].schedule.filter((sche:any) => sche.lesson_start == lesson_time);

        if(targetTime.length === 0){
            return res.status(200).json({
                MESSAGE:"해당 레슨 시간은 존재하지 않습니다."
            });
        }
        return res.status(200).json({
            MESSAGE:"문제 없음"
        });
    }
    return res.status(500).json({
        MESSAGE:"예기치 못한 에러 발생"
    })
}