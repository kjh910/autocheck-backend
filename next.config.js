/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
          {
            source: '/api/:path*', // CORS 설정을 적용하고자 하는 API 라우트의 경로
            headers: [
              {
                key: 'Access-Control-Allow-Origin',
                value: '*', // 허용하고자 하는 도메인을 여기에 입력
              },
              {
                key: 'Access-Control-Allow-Methods',
                value: 'GET, POST, PUT, DELETE', // 허용하고자 하는 HTTP 메서드
              },
            ],
          },
        ];
      },
}

module.exports = nextConfig
