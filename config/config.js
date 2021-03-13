let localIp = process.env.LOCAL_IP || 'localhost';

let zengHost = '192.168.111.178';
let zengPort = '8301';

const url = {
    development: {
        apiUrl: 'https://dm-test.bthome.com',
        apiUrlFilter: '/dmAppApi',
		prizeUrl: 'https://m-test.market.bnq.com.cn',
        prizeUrlFilter: '/wx-web',
        targetInvoiceUrl: 'https://pinvoice-test.bthome.com/invoiceAdmin',
        qiniuUrl: 'https://xres.bnq.com.cn/file',
    },
    local: {
        apiUrl: `http://${localIp}:9000`, // test
        apiUrlFilter: '/dmAppApi',
		prizeUrl: 'https://m-test.market.bnq.com.cn',
        prizeUrlFilter: '/wx-web',
        targetInvoiceUrl: 'https://pinvoice-dev.bthome.com/invoiceAdmin',
        qiniuUrl: 'https://xres.bnq.com.cn/file',
    },
    zeng: {
        apiUrl: `http://${zengHost}:${zengPort}`,
        apiUrlFilter: '/dmAppApi',
		prizeUrl: 'https://m-test.market.bnq.com.cn',
        prizeUrlFilter: '/wx-web',
        targetInvoiceUrl: 'https://pinvoice-dev.bthome.com/invoiceAdmin',
        qiniuUrl: 'https://xres.bnq.com.cn/file',
        // qiniuUrl: "//xres.bnq.com.cn/file",
    },
    test: {
        apiUrl: 'https://dm-test.bthome.com',
        apiUrlFilter: '/dmAppApi',
		prizeUrl: 'https://m-test.market.bnq.com.cn',
        prizeUrlFilter: '/wx-web',
        targetInvoiceUrl: 'https://pinvoice-test.bthome.com/invoiceAdmin',
        qiniuUrl: 'https://xres.bnq.com.cn/file',
    },
    production: {
        apiUrl: 'https://dm.bthome.com',
        apiUrlFilter: '/dmAppApi',
		prizeUrl: 'https://m.market.bnq.com.cn',
        prizeUrlFilter: '/wx-web',
        targetInvoiceUrl: 'https://pinvoice.bthome.com/invoiceAdmin',
        qiniuUrl: 'https://xres.bnq.com.cn/file',
    },
};

module.exports = url;
