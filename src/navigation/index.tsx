import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import { useAuth } from '../lib/auth';
import { Colors } from '../constants/theme';

// Auth screens
import AgeGateScreen from '../screens/auth/AgeGateScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';

// Onboarding
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';

// Main tabs
import GridScreen from '../screens/main/GridScreen';
import ChatListScreen from '../screens/chat/ChatListScreen';
import MyProfileScreen from '../screens/profile/MyProfileScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

// Stack screens
import ProfileDetailScreen from '../screens/main/ProfileDetailScreen';
import ChatDetailScreen from '../screens/chat/ChatDetailScreen';

export type RootStackParamList = {
  AgeGate: undefined;
  Auth: undefined;
  Onboarding: undefined;
  MainTabs: undefined;
  ProfileDetail: { userId: string };
  ChatDetail: { conversationId: string; otherUserId: string; otherUserName: string };
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type TabParamList = {
  Grid: undefined;
  Chats: undefined;
  Profile: undefined;
  Settings: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.bgSecondary,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: Colors.accentPrimary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Grid: 'grid',
            Chats: 'chatbubbles',
            Profile: 'person',
            Settings: 'shield',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Grid" component={GridScreen} />
      <Tab.Screen name="Chats" component={ChatListScreen} />
      <Tab.Screen name="Profile" component={MyProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: 'Safety' }} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.accentPrimary} />
      </View>
    );
  }

  const isOnboarded = profile?.display_name && profile?.age;

  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: Colors.accentPrimary,
          background: Colors.bgPrimary,
          card: Colors.bgSecondary,
          text: Colors.textPrimary,
          border: Colors.border,
          notification: Colors.accentPrimary,
        },
      }}
    >
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!session ? (
          <>
            <RootStack.Screen name="AgeGate" component={AgeGateScreen} />
            <RootStack.Screen name="Auth" component={AuthNavigator} />
          </>
        ) : !isOnboarded ? (
          <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <>
            <RootStack.Screen name="MainTabs" component={MainTabs} />
            <RootStack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
            <RootStack.Screen name="ChatDetail" component={ChatDetailScreen} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
