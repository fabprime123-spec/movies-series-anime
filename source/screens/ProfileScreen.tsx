import { Button, Switch } from "react-native"
import { Container } from "../components/ui/Container"
import { Text } from "../components/ui/Text"
import { useTheme } from "../context/ThemeContext"

export function ProfileScreen() {
  const { mode, changeMode, theme } = useTheme()

  return (
    <Container style={{ justifyContent: "center", alignItems: "center" }}>
      <Text>Profile</Text>
      <Switch value={mode === "dark" ? true : false} onValueChange={() => changeMode()} />
      <Button title="HELLO" color={theme.ring} onPress={() => changeMode()} />
    </Container>
  )
}