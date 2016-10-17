import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableWithoutFeedback,
} from 'react-native';

const propTypes = {
  dataSource: React.PropTypes.array.isRequired,
  selected: React.PropTypes.array,
  selectable: React.PropTypes.bool,
  onSelect: React.PropTypes.func,
}

const defaultProps = {
  selected: [],
  selectable: false,
}

class SelectableList extends Component {

  constructor(props) {
    super(props);

    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => {
      return r1.selected !== r2.selected;
    }});
    
    this.selected = [ ...this.props.selected ];

    this.state = {
      dataSource: this.ds.cloneWithRows(props.dataSource.map((item, index) => {
        return {
          selected: this.selected.indexOf(index) >= 0 ? true : false,
          data: item,
        }
      }))
    }
  }

  componentWillReceiveProps(nextProps: object) {
//    if (!nextProps.selectable) {
      this.selected = [];
//    }

    this._updateRows(nextProps.dataSource);
  }

  _updateRows(source: array) {
    const newArr = source.map((item, index) => {
        return {
          selected: this.selected.indexOf(index) >= 0 ? true : false,
          data: item,
        }
      });

    this.setState({
      dataSource: this.ds.cloneWithRows(newArr)
    });


    this.props.onSelect(this.selected);    
  }

  /**
   * Set selected prop to true for all rows
   */
  selectAll() {
    this.selected = this.props.dataSource.map((item, index) => index);
    this._updateRows(this.props.dataSource);
  }

  /**
   * Set selected prop to false for all rows
   */
  deselectAll() {
    this.selected = [];
    this._updateRows(this.props.dataSource);
  }

  getSelected() {
    return this.selected;
  }

  _selectRow(rowID: number) {
    const selectedIndex = this.selected.indexOf(rowID);
    if (selectedIndex < 0) {
      this.selected.push(rowID);
    } else {
      this.selected.splice(selectedIndex, 1);
    }

    this._updateRows(this.props.dataSource);
  }
  
  isSelected(index: number) {
    return this.selected.indexOf(index) >= 0 ? true : false;
  }

  _renderRow(rowData, sectionID, rowID) {
    const Component = this.props.selectable ? TouchableWithoutFeedback : View;

    return (
      <Component onPress={this._selectRow.bind(this, parseInt(rowID))}>
        {this.props.renderRow(rowData.data, sectionID, rowID, rowData.selected)}
      </Component>
    )
  }

  render() {
    return (
      <ListView
        {...this.props}
        renderRow={this._renderRow.bind(this)}
        dataSource={this.state.dataSource}
      />
    )
  }
}

SelectableList.propTypes = propTypes;
SelectableList.defaultProps = defaultProps;

module.exports = SelectableList;
