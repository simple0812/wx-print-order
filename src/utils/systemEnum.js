// 可读 不可以写
function toEnum(obj) {
    // if (_.isEmpty(obj)) {
    //   return;
    // }
    let _data = JSON.parse(JSON.stringify(obj));

    let _obj = {
        _data,
        toArray: function() {
            let arr = [];
            Object.keys(_data).forEach(key => {
                let xVal = _data[key] || {};
                arr.push({ ...xVal, key: xVal.value });
            });
            return arr;
        },
        getLabelByKey: function(key) {
            return (_data[key] || {}).label;
        },
        getLabel: function(val) {
            let keys = Object.keys(_data);
            for (let i = 0; i < keys.length; i++) {
                let x = _data[keys[i]] || {};

                if (x.value === val) {
                    return x.label;
                }
            }
            return undefined;
        },
    };

    Object.keys(obj).forEach(key => {
        Object.defineProperty(_obj, key, {
            configrable: false,
            get: function() {
                return _data[key].value;
            },
            set: function(val) {
                // if (!_data[key]) {
                //   _data[key] = {};
                // }
                // _data[key].value = val;
            },
        });
    });

    return _obj;
}

// 最小请假单位
export const timeUnitEnum = toEnum({
    DAY: {
        value: 1,
        label: '天',
    },
    HOUR: {
        value: 2,
        label: '小时',
    },
});

// 认证状态
export const authorizeEnum = toEnum({
    AUTHORIZED: {
        value: 1,
        label: '已认证',
    },
    UNAUTHORIZED: {
        value: 0,
        label: '待认证',
    },
});

// 拉新活动按钮类型
export const activityActionTypeEnum = {
    HELP: 'help',
    INVITE: 'invite',
    GET_PRIZE: 'get_prize',
};

// 拉新活动按钮类型
export const userTypeEnum = {
    CUSTOMER: {
        value: 1,
        label: '客户',
    },
    MERCHANT: {
        value: 0,
        label: '商家',
    },
};
