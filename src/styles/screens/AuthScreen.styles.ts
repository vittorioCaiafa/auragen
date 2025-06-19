import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e8f5e9",
  },
  title: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#2e7d32",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    color: "#2e7d32",
  },
  animationTop: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "170%",
    marginBottom: -20,
    transform: [{ scaleY: -1 }, { scaleX: -1 }],
  },
  animationBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "50%",
    marginBottom: -60,
  },
  button: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 26,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: { color: "black", fontSize: 16, fontWeight: "600" },
  appleButton: { width: 250, height: 45 },
  googleLogo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
});
