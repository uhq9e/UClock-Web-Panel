import { enqueue } from "@/lib/gatt-queue";
import { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";

function CharacteristicFirmwareRevision({
  characteristic,
}: {
  characteristic: BluetoothRemoteGATTCharacteristic;
}) {
  const [firmwareRevision, setFirmwareRevision] = useState<string>();

  useEffect(() => {
    enqueue(async () => {
      const value = await characteristic.readValue();

      if (value) {
        const decoder = new TextDecoder("latin1");

        setFirmwareRevision(decoder.decode(value).trim());
      }
    });
  }, [characteristic]);

  return (
    <>
      <span className="text-sm">固件版本</span>
      {firmwareRevision ? (
        <div className="text-xl font-black">{firmwareRevision}</div>
      ) : (
        <Icon icon="lucide:loader-circle" className="animate-spin" />
      )}
    </>
  );
}

export default CharacteristicFirmwareRevision;
