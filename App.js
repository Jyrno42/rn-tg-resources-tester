/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, ScrollView, StyleSheet, Text, View} from 'react-native';

import AbortTest from './tests/AbortTest';
import BasicFetchTest from './tests/BasicFetchTest';

// TODO: Replace with your ngrock url
const API_ROOT = 'https://bb0592a1.ngrok.io'

type Props = {};

const allTests = {
  basicFetch: BasicFetchTest,
  abortTest: AbortTest,
};

const testKeys = Object.keys(allTests);
const totalTests = testKeys.length;

type State = {
    activeTest: ?number,
    testResults: { [$Keys<allTests>]: true | Error },
};

export default class App extends Component<Props, State> {
  state = {
    activeTest: null,
    testResults: {},
  };

  onTestCompleted = (result: true | Error) => {
    this.setState(prevState => ({
      testResults: {
        ...prevState.testResults,
        [testKeys[prevState.activeTest]]: result,
      },
      activeTest: prevState.activeTest + 1,
    }));
  }

  onTestFail = (error: Error) => {
    const { activeTest } = this.state;

    console.warn(`Test ${testKeys[activeTest]} failed: ${error}`);

    this.onTestCompleted(error);
  };

  onTestSuccess = () => this.onTestCompleted(true);

  beginTests = () => this.startTest(0);

  startTest = (index: number = 0) => {
    this.setState({
        activeTest: index,
    });
  };

  renderResults() {
    const { testResults } = this.state;

    let successCount = 0;

    const resultNodes = Object.keys(testResults).map((key) => {
      const result = testResults[key];

      if (result === true) {
        successCount += 1;
      }

      return (
        <View style={styles.resultLine} key={key}>
          <Text>
            Test
            {' '}
            {key}
            {' - '}
            </Text>
          
          <Text>{result === true ? 'SUCCESS' : 'FAIL'}</Text>
        </View>
      );
    });

    return (
      <ScrollView>
        <Text style={styles.title}>TESTS {successCount === totalTests ? 'PASSED' : 'FAILED'}</Text>
        <Text style={styles.meta}>{successCount} out of {totalTests} OK</Text>

        {resultNodes}
      </ScrollView>
    );
  }

  renderTest() {
    const { activeTest } = this.state;
    const testKey = testKeys[activeTest];
    const TestComponent = allTests[testKey];

    return (
      <View style={styles.flex}>
        <Text style={styles.meta}>Running {activeTest + 1} out of {totalTests}</Text>

        <TestComponent
          apiRoot={API_ROOT}

          onError={this.onTestFail}
          onSuccess={this.onTestSuccess}
        />
      </View>
    );
  }

  render() {
    const { activeTest } = this.state;
    
    const testsRunning = activeTest !== null;
    const allTestsCompleted = testsRunning && activeTest >= totalTests;

    if (!testsRunning && !allTestsCompleted) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Welcome to tg-resources React Native tester!</Text>
          <Button onPress={this.beginTests} title="Start tests" />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {testsRunning && !allTestsCompleted ? this.renderTest() : null}
        {allTestsCompleted ? this.renderResults() : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  flex: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  meta: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  resultLine: {
    flex: 1,
    flexDirection: 'row',
    borderTopWidth: 2,
    borderTopColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
});
