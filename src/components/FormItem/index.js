import React, { Component } from "react";
import { View, Image, Text, Input } from "@tarojs/components";
import { AtInput } from "taro-ui";
import isFunction from "lodash/isFunction";
import isArray from "lodash/isArray";

import right from "@/assets/right.png";
import "./index.scss";

class FormItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = (evt) => {
    const { name, onChange } = this.props;

    console.log('evt', evt)
    if (isFunction(onChange)) {
      onChange(name, evt);
    }

  };

  render() {
    const {
      value,
      label,
      placeholder,
      name,
      showRightArrow,
      renderSuffix,
      onChange,
      required,
      showTitle,
      style,
      containerStyle,
      ...restProps
    } = this.props;

    let xPlaceholder = placeholder;
    if (!xPlaceholder) {
      xPlaceholder = `请输入${label}`;
    }

    return (
      <View className="bnq-form-item" style={{ ...style }}>
        <View className="bnq-form-item__container" style={{ ...containerStyle }}>

          {!!label &&
            (<View className="bnq-form-item__label">
              {required && <Text className="required-flag">*</Text>}
              {label}
            </View>)
          }
          <View className="bnq-form-item__input">
            {this.props.children ? (
              isArray(this.props.children) ? (
                this.props.children.map((item) => {
                  if (item && React.isValidElement(item)) {
                    return React.cloneElement(item, {
                      value,
                      onChange: this.handleChange,
                      placeholder: xPlaceholder,
                      ...restProps,
                    });
                  } else {
                    return "";
                  }
                })
              ) : React.isValidElement(this.props.children) ? (
                React.cloneElement(this.props.children, {
                  value,
                  onChange: this.handleChange,
                  placeholder: xPlaceholder,
                  ...restProps,
                })
              ) : (
                    ""
                  )
            ) : (
                <AtInput
                  placeholderClass="bnq-input-placeholder"
                  type="text"
                  placeholder={xPlaceholder}
                  name={name}
                  border={false}
                  autocomplete="off"
                  onChange={this.handleChange}
                  value={value}
                  {...restProps}
                />
              )}
          </View>
          {showRightArrow && (
            <View className="bnq-form-item__suffix">
              <Image className="right-icon" mode="widthFix" src={right} />
            </View>
          )}
          {renderSuffix && (
            <View className="bnq-form-item__suffix">{renderSuffix}</View>
          )}
        </View>
      </View>
    );
  }
}

export default FormItem;
