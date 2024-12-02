import usePrivateKey from "@/hooks/use-private-key/use-private-key";
import { Button, Text, View } from "react-native";

export default function Signer() {
  const { privateKey, createPrivateKey, revealPrivateKey } = usePrivateKey();
  
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
      <Text>private key: {privateKey}</Text>
    </View>
  );
}

