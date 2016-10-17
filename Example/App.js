import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ListView,
  TouchableHighlight,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import SelectableList from 'react-native-selectable-list';

var mock_data = [
  'RE-BYE',
  'Blank Space',
  'Dont\'t be denied',
  'Stay With Me',
  'Think About You',
  'Cheap Thrills',
  'I am not the only one',
  'Uptown Funk',
  'One Call Again',
  'Day Breaks',
]

class Example extends Component{

  constructor(props) {
    super(props);

    this.state = {
      listData: mock_data, 
      editMode: false,
      selectAll: false,
    }
  }

  onChangeMode() {
    this.setState({editMode: !this.state.editMode});
  }

  onSelectionStatus(selected: array) {
    const next = (selected.length === this.state.listData.length ? true : false);

    if (this.state.selectAll !== next) {
      this.setState({
        selectAll: next,
      })
    }
  }

  onRemoveItems() {
    const selected = this.refs.listview.getSelected();
    const newData = this.state.listData.filter((value, index) => selected.indexOf(index) < 0);
    this.setState({ 
      listData: newData,
      editMode: newData.length > 0 ? true : false, 
    });
  }

  _renderSeparator(sectionID, rowID) {
    return (
      <View key={`${sectionID}-${rowID}`} style={styles.separator}/>
    )
  }

  onToggleSelection() {
    if( this.state.selectAll ) {
      this.refs.listview.deselectAll();
    } else {
      this.refs.listview.selectAll();
    }
  }

  _renderRow(rowData, sectionID, rowID, selected) {
    return (
      <View style={[styles.rowContainer]}>
        {this.state.editMode ? (
          <View style={{borderColor:'black', borderWidth:1, width:30, height:30, marginRight:10, justifyContent:'center', alignItems:'center'}}>
            {selected ? (<Icon name='ios-checkmark' size={25}/>) : null}
          </View>
        ) : null }
        <Text>{rowData}</Text>
      </View>
    )
  }

  render() {
    return(
      <View style={styles.container}>
        <View style={{height:30, flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:5}}>
          <Text style={{}} onPress={() => this.onChangeMode()}>{this.state.editMode ? 'Done': 'Edit'}</Text>
          { this.state.editMode ? (
            <View style={{flexDirection: 'row'}}>
              <Text style={{marginHorizontal:5}}onPress={() => this.onToggleSelection()}>{this.state.selectAll ? 'Deselect All' : 'Select All'}</Text>
              <Text onPress={() => this.onRemoveItems()}>Delete</Text>
            </View>
          ) : null}
        </View>
        <SelectableList
          ref='listview'
          contentContainerStyle={styles.contentContainer}
          enableEmptySections={true}
          selections={this.state.listData}
          renderRow={this._renderRow.bind(this)}
          renderSeparator={this._renderSeparator.bind(this)}
          selectable={this.state.editMode}
          onSelectionStatus={this.onSelectionStatus.bind(this)}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    paddingTop: (Platform.OS === 'ios' ? 18 :0),
  },
  rowContainer: {
    height: 40,
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  rowSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
    marginHorizontal: 5,
  },
  contentContainer: {
//    flex:1,
//    paddingHorizontal: 5
  },
  separator: {
    height: 0.5,
    alignSelf: 'stretch',
    backgroundColor: 'darkgray',
  },
});

module.exports = Example;
