import React, { Component } from "react";
import PropTypes from "prop-types";
import omit from "object.omit";
import Picker from "./Picker";
import Input from "../Input";
import Icon from "../Icon";
import { format as formatter } from "date-fns";
import PopPanel from "../PopPanel";
import { getWeekFormat } from "../../utils/dateUtils";

class DatePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            value: props.defaultValue || props.value
        };
    }
    static propTypes = {
        defaultValue: PropTypes.object,
        disabled: PropTypes.bool,
        format: PropTypes.string,
        placeholder: PropTypes.string,
        value: PropTypes.object,
        onChange: PropTypes.func
    };
    static defaultProps = {
        disabled: false,
        format: "YYYY-MM-DD"
    };
    handleClick = e => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.open();
    };
    handleClear = e => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        const { onChange } = this.props;
        if (!("value" in this.props)) {
            this.close();
            this.setState({
                value: null
            });
        } else {
            this.close();
        }
        if (onChange) {
            onChange();
        }

        this.close();
    };
    handleChange = dateInfo => {
        const { onChange, format } = this.props;
        const { date, canClose } = dateInfo;

        let value = Array.isArray(date) ? date[0] : date;

        if (!("value" in this.props)) {
            this.setState({
                value
            });
        }

        if (onChange) {
            onChange(value);
        }
        if (canClose) {
            this.close();
        }
    };
    open = () => {
        if (this.state.open) {
            return;
        }
        this.setState({
            open: true
        });
    };
    close = () => {
        if (!this.state.open || !this.mounted) {
            return;
        }
        this.setState({
            open: false
        });
    };
    componentDidMount() {
        this.mounted = true;
        document.addEventListener("click", this.close);
    }
    componentWillUnmount() {
        this.mounted = false;
        document.removeEventListener("click", this.close);
    }
    componentWillReceiveProps(nextProps) {
        if ("value" in nextProps) {
            this.setState({
                value: nextProps.value
            });
        }
    }
    render() {
        const {
            kSize,
            disabled,
            placeholder,
            format,
            onFocus,
            onBlur
        } = this.props;
        const { value, open } = this.state;
        const pickerProps = omit(this.props, [
            "kSize",
            "placeholder",
            "range",
            "rangeDates",
            "useRangeDatesIndex"
        ]);
        let newFormat = getWeekFormat(value, format);
        let input = (
            <Input
                ref="input"
                type="text"
                kSize={kSize}
                disabled={disabled}
                placeholder={placeholder}
                value={value ? formatter(value, newFormat) : ""}
                suffix={
                    value && !disabled ? (
                        <Icon
                            type="close"
                            style={{ cursor: "pointer" }}
                            onClick={this.handleClear}
                        />
                    ) : (
                        <Icon type="calendar" onClick={this.handleClick} />
                    )
                }
                onChange={() => {}}
                onClick={this.handleClick}
                onFocus={onFocus}
                onBlur={onBlur}
            />
        );

        return (
            <PopPanel input={input} open={open}>
                <Picker
                    {...pickerProps}
                    value={value}
                    onChange={this.handleChange}
                />
            </PopPanel>
        );
    }
}

export default DatePicker;
