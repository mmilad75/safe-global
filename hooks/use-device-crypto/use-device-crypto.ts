import { useEffect, useState } from "react";
import DeviceCrypto, { KeyTypes } from "react-native-device-crypto";

const useDeviceCrypto = (alias: string, { accessLevel = 0 }) => {
  const [isKeyExists, setIsKeyExists] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [decryptedText, setDecryptedText] = useState<string>('');
  const [encryptedText, setEncryptedText] = useState<string>('');
  const [ivText, setIvText] = useState<string>('');

  useEffect(() => {
    DeviceCrypto.isKeyExists(alias, KeyTypes.SYMMETRIC).then(setIsKeyExists);
  }, [isKeyExists, alias]);

  const createKey = async () => {
    setError('');

    try {
      const res = await DeviceCrypto.getOrCreateSymmetricKey(alias, {
        accessLevel,
        invalidateOnNewBiometry: true,
      });
      setIsKeyExists(res);
      return res;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const encrypt = async (text: string) => {
    if (!isKeyExists) {
      await createKey();
    }

    setError('');
    setEncryptedText('');
    setDecryptedText('');

    try {
      const res = await DeviceCrypto.encrypt(alias, text, {
        biometryTitle: 'Authentication is required',
        biometrySubTitle: 'Encryption',
        biometryDescription: 'Authenticate your self to encrypt given text.',
      });
      setIvText(res.iv);
      setEncryptedText(res.encryptedText);
      return res;
    } catch (err: any) {
      setError(err.message);
    }
  };

  const decrypt = async (text: string, ivText: string) => {
    setError('');

    try {
      const res = await DeviceCrypto.decrypt(alias, text, ivText, {
        biometryTitle: 'Authentication is required',
        biometrySubTitle: 'Encryption',
        biometryDescription: 'Authenticate your self to encrypt given text.',
      });
      setDecryptedText(res);
      return res;
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    encrypt,
    decrypt,
    encryptedText,
    decryptedText,
    isKeyExists,
    ivText,
    error
  }
}

export default useDeviceCrypto;