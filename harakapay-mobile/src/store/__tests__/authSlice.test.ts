import authReducer, { initialState } from "../authSlice";

describe("Auth Slice", () => {
  it("should return the initial state", () => {
    expect(authReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it("should handle clearError", () => {
    const stateWithError = { ...initialState, error: "Some error" };
    const newState = authReducer(stateWithError, { type: "auth/clearError" });
    expect(newState.error).toBeNull();
  });

  it("should handle clearSuccess", () => {
    const stateWithSuccess = { ...initialState, success: true };
    const newState = authReducer(stateWithSuccess, {
      type: "auth/clearSuccess",
    });
    expect(newState.success).toBe(false);
  });

  it("should handle setInitialized", () => {
    const newState = authReducer(initialState, {
      type: "auth/setInitialized",
      payload: true,
    });
    expect(newState.initialized).toBe(true);
  });
});
