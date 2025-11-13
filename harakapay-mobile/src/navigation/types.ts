// Navigation types
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: {
    access_token?: string;
    refresh_token?: string;
    type?: string;
  } | undefined;
  Tabs: undefined;
  Profile: undefined;
  Settings: undefined;
  ConnectChild: undefined;
  ChildDetails: {
    childId: string;
    studentName: string;
  };
};
