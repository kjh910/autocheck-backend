import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    const query = req.query;
    const { lesson_date, lesson_time } = query;
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
        return res.status(200).json({
            MESSAGE:"메일 송신 성공"
        });
      } catch (error) {
        return res.status(500).json({
            MESSAGE:"메일 송신 실패"
        });
      }
}