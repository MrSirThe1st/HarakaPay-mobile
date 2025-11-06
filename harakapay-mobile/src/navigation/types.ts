// Navigation types
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Tabs: undefined;
  Profile: undefined;
  Settings: undefined;
  ConnectChild: undefined;
  ChildDetails: {
    childId: string;
    studentName: string;
  };
};
