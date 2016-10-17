import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableWithoutFeedback,
} from 'react-native';

const propTypes = {
  selections: React.PropTypes.array.isRequired,
  selected: React.PropTypes.array,
  selectable: React.PropTypes.bool,
  onSelectionStatus: React.PropTypes.func,
}

const defaultProps = {
  selected: [],
  selectable: false,
  onSelectionStatus: () => {},
}

class SelectableList extends Component {

  constructor(props) {
    super(props);

    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => {
      return r1.selected !== r2.selected;
    }});
    
    this.selected = [ ...this.props.selected ];

    this.state = {
      dataSource: this.ds.cloneWithRows(props.selections.map((item, index) => {
        return {
          selected: this.selected.indexOf(index) >= 0 ? true : false,
          data: item,
        }
      }))
    }
  }

  componentWillReceiveProps(nextProps: object) {
    if (this.props.selectable !== nextProps.selectable || this.props.selections.length !== nextProps.selections.length) {
      this.selected = [];
    }

    this._updateRows(nextProps.selections);
  }

  _updateRows(source: array) {
    this.setState({
      dataSource: this.ds.cloneWithRows(source.map((item, index) => {
        return {
          selected: this.selected.indexOf(index) >= 0 ? true : false,
          data: item,
      }}))
    }, () => {
      // After render is done, let parent know the selection status
      this.props.onSelectionStatus(this.selected);
    });
  }

  /**
   * Set selected prop to true for all rows
   */
  selectAll() {
    this.selected = this.props.selections.map((item, index) => index);
    this._updateRows(this.props.selections);
  }

  /**
   * Set selected prop to false for all rows
   */
  deselectAll() {
    this.selected = [];
    this._updateRows(this.props.selections);
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

    this._updateRows(this.props.selections);
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
