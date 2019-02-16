import React, { Component } from "react";
import { AutoComplete } from "kui-react";
import { data } from "../../data";

export default class Size extends Component {
    state = {
        dataSource: []
    };
    handleSelect = value => {
        console.log("selected", value);
        this.setState({
            dataSource: []
        });
    };
    handleSearch = val => {
        let result = [];
        data.forEach(item => {
            if (val && item.toLowerCase().indexOf(val.toLowerCase()) != -1) {
                result.push(item);
            }
        });
        this.setState({
            dataSource: result
        });
    };
    render() {
        const { dataSource } = this.state;
        return (
            <React.Fragment>
                <AutoComplete
                        kSize="sm"
                        data={dataSource}
                        placeholder="请输入a-z"
                        onSearch={this.handleSearch}
                        onSelect={this.handleSelect}
                    />
                    <br />
                    <br />
                    <AutoComplete
                        data={dataSource}
                        placeholder="请输入a-z"
                        onSearch={this.handleSearch}
                        onSelect={this.handleSelect}
                    />
                    <br />
                    <br />
                    <AutoComplete
                        kSize="lg"
                        data={dataSource}
                        placeholder="请输入a-z"
                        onSearch={this.handleSearch}
                        onSelect={this.handleSelect}
                    />
            </React.Fragment>
        );
    }
}