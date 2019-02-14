import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Grid from "../Grid";
import validate from "./validate";
import Tooltip from "../Tooltip";

const prefixCls = "k-form-item";

class FormItem extends Component {
    static displayName = "FormItem";

    static contextTypes = {
        form: PropTypes.object
    };

    static propTypes = {
        fieldName: PropTypes.string,
        focusClear: PropTypes.bool,
        initialValue: PropTypes.any,
        getValueFromEvent: PropTypes.func,
        label: PropTypes.string,
        labelCol: PropTypes.object,
        wrapperCol: PropTypes.object,
        rules: PropTypes.array,
        validator: PropTypes.func,
        tooltip: PropTypes.bool,
        tooltipPlacement: PropTypes.oneOf([
            "top",
            "left",
            "right",
            "bottom",
            "topLeft",
            "topRight",
            "bottomLeft",
            "bottomRight",
            "leftTop",
            "leftBottom",
            "rightTop",
            "rightBottom"
        ])
        // validateStatus: PropTypes.oneOf([
        //     "success",
        //     "warning",
        //     "error",
        //     "validating"
        // ]),
        // hasFeedback: PropTypes.bool,
        // help: PropTypes.string
    };

    static defaultProps = {
        tooltipPlacement: "right"
    };

    constructor(props) {
        super(props);
        this.state = {
            errorMessage: ""
        };
        this.rules = {};
    }

    init() {
        this.context.form.init(this);
        this.initRules();
    }

    initRules(props = this.props) {
        const { fieldName, rules } = props;
        if (fieldName) {
            let count = 0;
            this.rules = {};
            if (rules && rules.length > 0) {
                rules.forEach(rule => {
                    if (rule.required) {
                        this.rules["required"] = {
                            message:
                                rule.message || validate.messages["required"],
                            params: rule.params
                        };
                        count++;
                    } else if (rule.type) {
                        this.rules[rule.type] = {
                            message:
                                rule.message || validate.messages[rule.type],
                            params: rule.params
                        };
                        count++;
                    }
                });
            }

            if (count === 0 && this.state.errorMessage) {
                this.setState({
                    errorMessage: ""
                });
            }
        }
    }

    componentDidMount() {
        this.init();
    }

    componentWillReceiveProps(nextProps) {
        this.initRules(nextProps);
    }

    renderError() {
        const { errorMessage } = this.state;

        return (
            <TransitionGroup component={React.Fragment}>
                {errorMessage ? (
                    <CSSTransition timeout={300} classNames="slide-down">
                        <div className={`${prefixCls}__error`}>
                            {errorMessage}
                        </div>
                    </CSSTransition>
                ) : null}
            </TransitionGroup>
        );
    }

    render() {
        const {
            label,
            className,
            children,
            fieldName,
            rules,
            labelCol,
            wrapperCol,
            tooltip,
            tooltipPlacement
        } = this.props;
        const { errorMessage } = this.state;
        const classString = classnames(
            {
                [prefixCls]: true,
                [`${prefixCls}--error`]: errorMessage
            },
            className
        );
        const value = this.context.form.getFieldValue(fieldName);
        // const content = fieldName
        //     ? React.cloneElement(children, {
        //           onChange: this.handleChange,
        //           onFocus: this.handleFocus,
        //           onBlur: this.handleBlur,
        //           value,
        //           ...children.props
        //       })
        //     : children;
        const content = React.Children.map(children, child => {
            return child;
        });

        return (
            <Grid.Row className={classString}>
                {label ? (
                    <Grid.Col
                        className={classnames({
                            [`${prefixCls}__label`]: true,
                            [`${prefixCls}__label--required`]:
                                rules && rules.findIndex(f => f.required) > -1
                        })}
                        {...labelCol}
                    >
                        {label}
                    </Grid.Col>
                ) : null}
                <Grid.Col className={`${prefixCls}__wrapper`} {...wrapperCol}>
                    {tooltip ? (
                        <Tooltip
                            title={errorMessage}
                            kStyle="danger"
                            show={errorMessage ? true : false}
                            placement={tooltipPlacement}
                        >
                            {content}
                        </Tooltip>
                    ) : (
                        content
                    )}

                    {!tooltip && this.renderError()}
                </Grid.Col>
            </Grid.Row>
        );
    }

    handleChange = (...args) => {
        const { getValueFromEvent, fieldName } = this.props;
        let value;
        if (getValueFromEvent) {
            value = getValueFromEvent(...args);
        } else {
            let e = args[0];
            if (e && e.target) {
                const { target } = e;
                value =
                    target.type === "checkbox" || target.type === "radio"
                        ? target.checked
                        : target.value;
            } else {
                value = e;
            }
        }

        this.context.form.setFieldValue(this.props.fieldName, value, () => {
            this.validate();
        });
    };

    handleFocus = () => {
        const { focusClear } = this.props;
        if (focusClear) {
            this.setState({
                errorMessage: ""
            });
        }
    };

    handleBlur = () => {
        const { focusClear } = this.props;
        if (focusClear) {
            this.validate();
        }
    };

    setError = msg => {
        const { errorMessage } = this.state;
        if (typeof msg === "string") {
            this.setState({
                errorMessage: msg
            });
        }
    };

    validate = callback => {
        const { validator } = this.props;
        let result = true;
        let message;
        let value = this.context.form.getFieldValue(this.props.fieldName);
        if (this.rules) {
            for (let method in this.rules) {
                let rule = this.rules[method];
                result = validate.methods[method](value, rule.params);
                if (!result) {
                    message = this.formatMessage(rule.message, rule.params);
                    break;
                }
            }
        }
        this.setState(
            {
                errorMessage: message
            },
            () => {
                if (validator) {
                    validator(value, msg => {
                        if (msg) {
                            result = false;
                            message = msg;
                        }
                        this.setState(
                            {
                                errorMessage: message
                            },
                            () => {
                                if (typeof callback === "function") {
                                    callback(result, message);
                                }
                            }
                        );
                    });
                } else {
                    if (typeof callback === "function") {
                        callback(result, message);
                    }
                }
            }
        );
    };

    formatMessage(message, params) {
        if (message.indexOf("{0}") != -1) {
            if (!Array.isArray(params)) {
                params = [params];
            }
            params.forEach((v, i) => {
                message = message.replace(
                    new RegExp("\\{" + i + "\\}", "g"),
                    function() {
                        return v;
                    }
                );
            });
        }
        return message;
    }

    resetField = () => {
        const { fieldName, initialValue } = this.props;
        this.context.form.setFieldValue(fieldName, initialValue, () => {
            this.setState({
                errorMessage: ""
            });
        });
    };
}

export default FormItem;
