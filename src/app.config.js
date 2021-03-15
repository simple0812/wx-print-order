let allPages = [
    'pages/index/index',
    'pages/customer/index',
    'pages/merchant/index',
    'pages/customerRegist/index',
    'pages/merchantRegist/index',
    'pages/customerStatistic/index',
    'pages/merchantStatistic/index',
];

let { mainPages, subPages } = splitPackages(allPages);

export default {
    pages: mainPages,
    subpackages: [
        ...subPages,
    ],
    window: {
        backgroundTextStyle: 'light',
        navigationBarTitleText: '工长小圈',
        enablePullDownRefresh: false,
        enableShareAppMessage: true,
        navigationBarBackgroundColor: '#36394F',
        navigationBarTextStyle: 'white',
    },
    permission: {
        'scope.userLocation': {
            desc: '你的位置信息将用于小程序相关功能',
        },
    },
};

// 默认主包只包含allPage中的第一个 通过count可以设置主包中page的数量
function splitPackages(pages, mainPageCount = 1) {
    let mainPages = pages.slice(0, mainPageCount);
    let subPages = [];

    pages.slice(mainPageCount).forEach((each) => {
        let arr = each.split('/');
        let root = arr.slice(0, 2).join('/');
        let pagePath = arr.slice(2).join('/');

        // 处理同一个root下有多个页面
        let xSub = subPages.find((item) => item.root === root);
        if (xSub) {
            xSub.pages = xSub.pages || [];
            xSub.pages.push(pagePath);
        } else {
            subPages.push({
                root,
                pages: [pagePath],
            });
        }
    });

    return {
      mainPages,
      subPages
    }
}
