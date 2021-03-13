var MockApi = require("./mockApi");

let xMock = new MockApi();

xMock
  .get("/appApi/test/foo", {
    "data|10-15": [
      {
        id: "@guid",
        "increment|+1": 1,
        "bool|1-2": true,
        "enum|1": ["A", "d", "C"],
        title: "@title",
        name: "@cname",
        email: "@email",
        date: "@now",
        reg: /\d{11}/,
        content: "@cparagraph",
        url: "@url",
        address: "@city(true)",
        ip: "@ip",
        "number|1-100": 100,
        image: "@image(20x10)",
      },
    ],
  })
  // 覆盖使用pageConfig生成的接口
  .post("/api/approve/Update.json", false)
  .post("/api/cc", true)
  .get("/appApi/help/queryHelpDetail.do", {
    code: 0,
    data: {
      "list|10": [
        {
          foremanCode: "@guid",
          helperForemanCode: "@guid",
          helperHandTime: "@datetime",
          helperImg: "@image(32x32)",
          id: "@guid",
          helperName: "@cname",
          "helperStatus|1": [1, 2],
          siteAreaCode: "10010",
          "helperSiteCount|1-100": 1,
        },
      ],
      pageNum: 1,
      pageSize: 10,
      total: 1,
    },
    detail: "测试内容v30l",
    message: "SUCCESS",
    meta: "测试内容lw33",
    success: true,
    timestamp: 1608007819918,
    timestampDate: "2020-12-15 12:50:19",
  })
  .get("/dmAppApi/designer/designCaseList.do", {
    code: 0,
    data: {
      "list|10": [
        {
          'id|+1': 1,
          creatorId: 0,
          lastModifierId: 0,
          createTime: '2021-01-13 15:34:36',
          modifiedTime: '2021-01-20 10:50:49',
          deleted: false,
          number: '00006',
          designerCode: 'DN_2021011300005',
          designerName: '@cname',
          designerHeadImg: 'https://res1.bnq.com.cn/25b70d71286c4ef9bc4837db3dcc2cbb.jpg',
          caseTitle: '极简线条+艺术灯',
          serviceType: 'DST10003',
          serviceTypeName: '全案设计',
          caseHouseType: '1003',
          caseHouseTypeName: '三室',
          room: 3,
          hall: 1,
          kitchen: 1,
          toilet: 2,
          caseSize: 136.0,
          designStyle: 'tc31002,tc31007,tc31016',
          caseCostType: null,
          totalCost: null,
          designCost: null,
          hardCost: null,
          softCost: null,
          caseType: 'tc21007,tc21001,tc21006',
          ownerImage: 'tc11005,tc11015',
          caseProvinceCode: '310000',
          caseProvinceName: '上海',
          caseCityCode: '310000',
          caseCityName: null,
          communityName: null,
          status: 1,
          statusName: '上架中',
          weights: 28.0,
          qrCode: 'https://res1.bnq.com.cn/FgYmAffNXjq86Ikz9VSki8dXlJ0p',
          coverImg: 'https://res1.bnq.com.cn/2eaab5fa71964bb38722c87ef8683c3c.jpg',
          readCount: 17,
          shareCount: 17,
          keyword: 'keyword666',
          imgWidth: 2775,
          imgHeight: 1852,
        },
      ],
    },
    detail: "测试内容v30l",
    message: "SUCCESS",
    meta: "测试内容lw33",
    success: true,
    timestamp: 1608007819918,
    timestampDate: "2020-12-15 12:50:19",
  })
  .get("/appApi/help/queryForeManNames.do", {
    code: 0,
    "data|100": ["@ctitle"],
  })
  .get("/appApi/help/isHelped.do", {
    code: 0,
    success: true,
    data: false,
  })
  .get("/appApi/help/queryHelpMsg.do", {
    code: 0,
    "data": {
      foremanCode: "@guid",
      headImg: "@image(32x32)",
      'helperHeadImg|10-20': [
        '@image(32x32)'
      ],
      id: "@guid",
      realName: "@ctitle",
      "status|1": [1, 2],
      "helpedCount|1-100": 1,
    },
  })
  .post("/appApi/prize/receivePrize.do", {
    code: -1,
    success: false,
    data: false,
  });

module.exports = xMock.data;
