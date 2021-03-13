
/* eslint-disable */
import React from 'react'
import isFunction from 'lodash/isFunction';
import { MobXProviderContext, useObserver } from 'mobx-react'


export default function useInject(...args) {
    return function (baseComponent) {
      const component = ownProps => {
        const store = React.useContext(MobXProviderContext);
        let currStores = {};

        args.forEach(each => {
          let xStore = {}
          if (isFunction(each)) {
            xStore = each(store)
          } else {
            xStore = {
              [each]: store[each] || {}
            };
          }
  
          currStores = {
            ...currStores,
            ...xStore
          }
        })

        if (typeof baseComponent === 'object') {
          return React.createElement(baseComponent, {...ownProps, ...currStores})
        }
  
        return useObserver(() => baseComponent({...ownProps, ...currStores}))
      }
      component.displayName = baseComponent.name
      return component
    }
  }