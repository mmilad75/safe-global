import { StyleSheet, Button, Text, View } from "react-native";

export default function Signer() {


  const createPrivateKey = async () => {

  };

  const revealPrivateKey = async () => {
  };

  return (
    <View>
      <Button
        title="Generate an account by random key"
        onPress={createPrivateKey}
      />

      <Button
          title="Reveal private key for generated account"
          onPress={revealPrivateKey}
      />

        <Text>private key: display private key here</Text>

    </View>
  );
}

