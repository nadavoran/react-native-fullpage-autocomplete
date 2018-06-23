import React, { Component } from "react";
import {
    DeviceInfo,
    Button,
    Platform,
    StyleSheet,
    Animated,
    View,
    TextInput,
    FlatList,
    Modal,
    Text,
    TouchableHighlight
} from "react-native";

export class AutoComplete extends Component {
    static defaultProps = {
        onSelect: () => {},
        onClose: () => null
    };

    constructor(props) {
        super(props);
        this.state = {
            searchData: "",
            showModal: false
        };
        this.data = this.props.originalData;
    }

    onClose = () => {
        if ( this.props.onShowModal ) {
            this.props.onShowModal(null);
        } else {
            this.setState({ showModal: false });
        }
        this.props.onClose();
    };

    renderAutoCompleteScreen = () => {
        return (
            <Modal
                animationType={"slide"}
                transparent={true}
                onRequestClose={Platform.select({ android: this.onClose })}
                onShow={() => {
                    this.autoCompleteInput.focus();
                }}
                keyboardShouldPersistTaps={"handled"}
            >
                <View style={styles.autoCompleteScreen}>
                    <View style={styles.topBar}>
                        <TouchableHighlight
                            hitSlop={{ top: 10, right: 10, bottom: 10, left: 5 }}
                            automationTestLabel={`${
                                this.props.automationTestPrefix
                                }-autocomplete-modal-clear-input`}
                            onPress={() => {
                                this.onChangeText("");
                                // this.setState({ searchData: "" });
                            }}
                        >
                            {
                                this.props.renderBackElement ?
                                    this.props.renderBackElement() :
                                    <Text style={styles.buttonStyle}>{'<'}</Text>
                            }
                        </TouchableHighlight>
                    </View>
                    <View style={[ styles.inputContainer, styles.autoCompleteInputContainer ]}>
                        <TextInput
                            ref={c => (this.autoCompleteInput = c)}
                            style={styles.autoCompleteInput}
                            allowFontScaling={false}
                            keyboardShouldPersistTaps={"handled"}
                            value={this.state.searchData}
                            automationTestLabel={`${this.props.automationTestPrefix}-autocomplete-modal-input`}
                            autoCorrect={false}
                            autofocus={true}
                            placeholder={"Search"}
                            underlineColorAndroid={"transparent"}
                            placeholderTextColor={"#FFFFFFCD"}
                            onSubmitEditing={() => {
                                this.props.onSelect(this.data[ 0 ]);
                                this.onClose();
                            }}
                            onChangeText={this.onChangeText}
                        />
                        {this.state.searchData ? (
                            <TouchableHighlight
                                hitSlop={{ top: 10, right: 10, bottom: 10, left: 5 }}
                                automationTestLabel={`${
                                    this.props.automationTestPrefix
                                    }-autocomplete-modal-clear-input`}
                                onPress={() => {
                                    this.onChangeText("");
                                    // this.setState({ searchData: "" });
                                }}
                            >
                                {
                                    this.props.renderClearElement ?
                                    this.props.renderClearElement() :
                                    <Text style={styles.buttonStyle}>{'X'}</Text>
                                }
                                {/*<Icon name={"close"} width={10} height={10} fill={textColors.onDark}/>*/}
                            </TouchableHighlight>
                        ) : null}
                    </View>
                    <FlatList
                        keyboardShouldPersistTaps={"handled"}
                        data={this.data}
                        renderItem={this.renderItem}
                        keyExtractor={this.props.autocompleteKeyExtractor ? this.props.autocompleteKeyExtractor() : this.keyExtractor}
                    />
                </View>
            </Modal>
        );
    };
    onChangeText = text => {
        if ( !text ) {
            this.data = this.props.originalData;
        } else if ( text.length < this.state.searchData.length ) {
            this.data = this.props.filter(text, this.props.originalData);
        } else {
            this.data = this.props.filter(text, this.data);
        }
        this.setState({ searchData: text });
    };

    keyExtractor = (item, index) => {
        return `autoComplete-${item.id}-${index}`;
    };

    renderItem = ({ item, index }) => {
        return (
            <TouchableHighlight
                style={[
                    styles.itemContainer,
                    index === 0 ? { backgroundColor: "#FFFFFF1A" } : null
                ]}
                automationTestLabel={`${this.props.automationTestPrefix}-autocomplete-modal-item-${index}`}
                onPress={() => {
                    this.props.onSelect(item);
                    this.onClose();
                }}
            >
                {this.props.renderItem({ item, index, searchData: this.state.searchData })}
            </TouchableHighlight>
        );
    };

    showModal = () => {
        if ( this.props.onShowModal ) {
            this.props.onShowModal(true);
        } else {
            this.setState({ showModal: true });
        }
    };

    render() {
        const {
            containerStyle,
            inputStyle,
            placeHolder,
            selectedText,
            placeHolderStyle,
            inputContainerStyle,
            automationTestPrefix
        } = this.props;
        const actualPlaceHolderStyle = selectedText ? null : [ styles.placeHolderStyle, placeHolderStyle ];

        return (
            <View style={containerStyle}>
                <TouchableHighlight
                    onPress={this.showModal}
                    style={{ width: "95%" }}
                    underlayColor={"#ffffff1A"}
                    activeOpacity={0.8}
                >
                    <View style={[ styles.inputContainer, inputContainerStyle ]}>
                        <View style={{ width: "95%" }}>
                            {selectedText ? (
                                typeof selectedText === "string" ? (
                                    <Text
                                        style={[ { textAlignVertical: "center" }, inputStyle, actualPlaceHolderStyle ]}>
                                        {selectedText}
                                    </Text>
                                ) : (
                                    selectedText()
                                )
                            ) : (
                                <Text style={[ { textAlignVertical: "center" }, inputStyle, actualPlaceHolderStyle ]}>
                                    {placeHolder}
                                </Text>
                            )}
                        </View>
                    </View>
                </TouchableHighlight>
                {this.state.showModal || this.props.showModal ? this.renderAutoCompleteScreen() : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
    inputContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 5
    },
    autoCompleteScreen: {
        // position: "absolute",
        // top: 0,
        paddingTop: DeviceInfo.isIPhoneX_deprecated ? 40 : 20,
        // bottom: 0,
        // left: 0,
        // right: 0,

        backgroundColor: "#3c3e48",
        flex: 1
        // zIndex: 100
    },
    topBar: {
        // marginTop: DeviceInfo.isIPhoneX_deprecated ? 40 : 20,
        paddingTop: Platform.select({
            ios: DeviceInfo.isIPhoneX_deprecated ? 6 : 0,
            android: 0
        })
    },
    backText: {
        color: "white",
        fontSize: 13
    },
    itemContainer: {
        justifyContent: "center",
        paddingHorizontal: 45,
        paddingVertical: 15,
        height: 60
    },
    autoCompleteInputContainer: {
        marginHorizontal: 45,
        marginBottom: 15,
        marginTop: 35,
        borderBottomWidth: 2,
        borderBottomColor: "#FFFFFFCD",
        paddingBottom: 5
    },
    autoCompleteInput: {
        width: "95%",
        color: "white",
        fontSize: 16
    },
    placeHolderStyle: {
        fontSize: 16,
        color: "#3c3e4880"
    },
    buttonStyle:{
        color: "white"
    }
});
