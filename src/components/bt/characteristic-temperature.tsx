import { decodeTemperature } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";
import { enqueue } from "@/lib/gatt-queue";

function CharacteristicTemperature({
  characteristic,
}: {
  characteristic: BluetoothRemoteGATTCharacteristic;
}) {
  const [temp, setTemp] = useState<number>();

  useEffect(() => {
    characteristic.addEventListener("characteristicvaluechanged", () => {
      const value = characteristic.value;

      if (value) setTemp(decodeTemperature(value));
    });

    // characteristic.startNotifications();
    (async () => {
      await enqueue(() => characteristic.startNotifications());
    })();
  }, []);

  return (
    <>
      <div className="text-sm">温度</div>
      {temp ? (
        <div className="text-xl font-black">{temp}℃</div>
      ) : (
        <Icon icon="lucide:loader-circle" className="animate-spin" />
      )}
    </>
  );
}

export default CharacteristicTemperature;
