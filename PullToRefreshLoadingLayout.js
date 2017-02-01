import React, {Component, PropTypes} from 'react';
import {
    View, Text, ScrollView, Dimensions, StyleSheet, requireNativeComponent,
} from 'react-native';

import PULL_TO_REFRESH_STATE from './PullToRefreshState';

const STATE_RESET = PULL_TO_REFRESH_STATE.STATE_RESET;
const STATE_PULL_TO_REFRESH = PULL_TO_REFRESH_STATE.STATE_PULL_TO_REFRESH;
const STATE_RELEASE_TO_REFRESH = PULL_TO_REFRESH_STATE.STATE_RELEASE_TO_REFRESH;
const STATE_REFRESHING = PULL_TO_REFRESH_STATE.STATE_REFRESHING;
const STATE_MANUAL_REFRESHING = PULL_TO_REFRESH_STATE.STATE_MANUAL_REFRESHING;
const STATE_OVERSCROLLING = PULL_TO_REFRESH_STATE.STATE_OVERSCROLLING;

export default class PullToRefreshLoadingLayout extends Component {

    constructor(props) {
        super(props);

        this.state = {
            viewWidth: 0,
            viewHeight: 0,
            pullToRefreshState: STATE_RESET,
        }
    }

    static propTypes = {
        pullToRefreshState: React.PropTypes.string,
    };

    static defaultProps = {
        pullToRefreshState: STATE_RESET,
    };

    componentWillReceiveProps(nextProps) {

        if (nextProps && nextProps.pullToRefreshState != this.props.pullToRefreshState) {
            this.setState({
                pullToRefreshState: nextProps.pullToRefreshState,
            });
        }

    }

    onLayout(event) {

        // 获取view的宽度
        let viewWidth = event.nativeEvent.layout.width;
        // 获取view的高度
        let viewHeight = event.nativeEvent.layout.height;

        // 若view的宽度或高度为空，或者宽高跟原来完全一样
        if (!viewWidth || !viewHeight || (this.state.viewWidth == viewWidth && this.state.viewHeight == viewHeight)) {
            return;
        }

        // 向state中更新最新的view宽度
        this.setState({
            viewWidth: viewWidth,
            viewHeight: viewHeight,
        });
    }

    getStatusText(pullToRefreshState: string): string {

        let text = "";

        switch (pullToRefreshState) {
            case STATE_PULL_TO_REFRESH:
                text = "下拉刷新";
                break;
            case STATE_RELEASE_TO_REFRESH:
                text = "松手可刷新"
                break;
            case STATE_REFRESHING:
                text = "玩命刷新中..."
                break;
            default:
                text = "下拉刷新";
                break;
        }

        console.log(text);
        return text;
    }

    render() {
        return (
            <RCTPullToRefreshLoadingLayout
                {...this.props}
                style={[this.props.style, styles.container]}
                onLayout={this.onLayout.bind(this)}
            >
                <View
                    style={[{height:25}, styles.contentArea]}
                >
                    <Text
                        style={[styles.statusText]}
                        numberOfLines={1}
                    >
                        {this.getStatusText(this.state.pullToRefreshState)}
                    </Text>
                </View>
            </RCTPullToRefreshLoadingLayout>
        );
    }
}

const styles = {
    container: {
        backgroundColor: 'blue',
        justifyContent: 'flex-end',
    },
    contentArea: {
        backgroundColor: 'green',
    },
    statusText: {
        textAlign: 'center',
        textAlignVertical: 'center',
    },
};

const NATIVE_MODULE_REGISTERED_NAME = "RCTPullToRefreshLoadingLayout";

let iface = {
    name: NATIVE_MODULE_REGISTERED_NAME,
    propTypes: {...View.propTypes},
}

const RCTPullToRefreshLoadingLayout = requireNativeComponent(NATIVE_MODULE_REGISTERED_NAME, iface);
