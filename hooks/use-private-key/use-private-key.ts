import { useState } from "react";
import * as Keychain from "react-native-keychain";
import { generatePrivateKey } from "viem/accounts";
import useDeviceCrypto from "../use-device-crypto/use-device-crypto";

const ALIAS = 'PRIVATE_KEY_ALIAS';

const usePrivateKey = () => {
  const [privateKey, setPrivateKey] = useState<string | undefined>(undefined);
  const {encrypt, decrypt} = useDeviceCrypto(ALIAS, {});

  const createPrivateKey = async () => {
    try {
      const newPrivateKey = generatePrivateKey();
      const encryptedPrivateKey = await encrypt(newPrivateKey);
      
      if (encryptedPrivateKey?.encryptedText && encryptedPrivateKey?.iv) {
        await Keychain.setGenericPassword('privateKey', encryptedPrivateKey.encryptedText, {
          service: 'privateKey',
          accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
        });
        await Keychain.setGenericPassword('privateKeyIvText', encryptedPrivateKey.iv, {
          service: 'privateKeyIvText',
          accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
        });
      }
    } catch (error) {
      console.error("Failed to create private key:", error);
    }
  };

  const revealPrivateKey = async () => {
    try {
      const credentialIvText = await Keychain.getGenericPassword({service: 'privateKeyIvText'});
      const credential = await Keychain.getGenericPassword({service: 'privateKey'});

      if (credential && credentialIvText) {
        const decryptedPrivateKey = await decrypt(credential.password, credentialIvText.password);
        setPrivateKey(decryptedPrivateKey);
      } else {
        console.log('No private key stored on the device.');
      }
    } catch (error) {
      console.error('Failed to retrieve private key:', error);
    }
  };

  return {
    privateKey,
    createPrivateKey,
    revealPrivateKey
  }
}

export default usePrivateKey;
