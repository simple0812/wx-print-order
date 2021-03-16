let localIp = process.env.LOCAL_IP || 'localhost';

let zengHost = '192.168.111.178';
let zengPort = '8301';

const url = {
    development: {
        // apiUrl: 'https://senchuangyefan.cn',
        apiUrl: 'https://senchuangyefan.cn:9090',
        apiUrlFilter: '/waimai',
    },
    local: {
        apiUrl: 'https://senchuangyefan.cn:9090',
        apiUrlFilter: '/waimai',
    },
    test: {
        apiUrl: 'https://senchuangyefan.cn:9090',
        apiUrlFilter: '/waimai',
		
    },
    production: {
        apiUrl: 'https://senchuangyefan.cn:9090',
        apiUrlFilter: '/waimai',
    },
};

module.exports = url;
