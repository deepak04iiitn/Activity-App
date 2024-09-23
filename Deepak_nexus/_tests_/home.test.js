import React from 'react';
import renderer from 'react-test-renderer';
import Home from '../app/(tabs)/home';
import { ThemeProvider } from '../app/contexts/ThemeContext';
import { NavigationContainer } from '@react-navigation/native';

test('renders correctly', () => {
  const tree = renderer.create(
    <NavigationContainer
    >
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    </NavigationContainer>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});