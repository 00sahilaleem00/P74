import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  Text,
  ScrollView,
  FlatList,
} from "react-native";
import { Header, SearchBar } from "react-native-elements";

import * as firebase from "firebase";
import db from "../config";

export default class ReadStoryScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      allStories: [],
      dataSource: [],
      search: "",
    };
  }
  componentDidMount = async () => {
    const query = await db.collection("stories").get();
    query.docs.map((doc) => {
      this.setState({
        allStories: [...this.state.allStories, doc.data()],
        dataSource: [...this.state.dataSource, doc.data()],
      });
    });
  };
  updateSearch = (search) => {
    this.setState({ search: search });
    var ind = null;
    for (var i in this.state.allStories) {
      if (
        !this.state.allStories[i].author.includes(search) &&
        !this.state.allStories[i].title.includes(search)
      ) {
        for (var j in this.state.dataSource) {
          if (
            this.state.dataSource[j].author ===
              this.state.allStories[i].author ||
            this.state.dataSource[j].title === this.state.allStories[i].title
          ) {
            ind = j;
          }
        }
        if (ind != null) {
          var data = this.state.dataSource;
          data.splice(ind, 1);
          this.setState({
            dataSource: data,
          });
        }
      } else {
        var present = false;
        for (var j in this.state.dataSource) {
          if (
            this.state.dataSource[j].author ===
              this.state.allStories[i].author ||
            this.state.dataSource[j].title === this.state.allStories[i].title
          ) {
            present = true;
          }
        }
        var data = this.state.dataSource;
        if (!present) {
          data.push(this.state.allStories[i]);

          this.setState({
            dataSource: data,
          });
        }
      }
    }
  };
  render() {
    return (
      <View>
        <Header
          backgroundColor={"#ff1099"}
          width={1000}
          centerComponent={{
            text: "Read Story",
            style: { color: "#fff", fontSize: 20 },
          }}
          containerStyle={{
            backgroundColor: "#3d6dcc",
            justifyContent: "space-around",
          }}
        />
        <SearchBar
          placeholder="Type Here..."
          onChangeText={this.updateSearch}
          value={this.state.search}
        />
        <FlatList
          data={this.state.dataSource}
          renderItem={({ item }) => (
            <View style={{ borderBottomWidth: 2 }}>
              <Text>{"Author: " + item.author}</Text>
              <Text>{"Title: " + item.title}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({});
