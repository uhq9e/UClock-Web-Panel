import CharacteristicCurrentTime from "./characteristic-current-time";
import CharacteristicFirmwareRevision from "./characteristic-firmware-revision";
import CharacteristicTemperature from "./characteristic-temperature";

function Characteristic({
  characteristic,
}: {
  characteristic: BluetoothRemoteGATTCharacteristic;
}) {
  const characteristicMap = {
    "00002a2b": () => (
      <CharacteristicCurrentTime characteristic={characteristic} />
    ),
    "00002a1c": () => (
      <CharacteristicTemperature characteristic={characteristic} />
    ),
    "00002a26": () => (
      <CharacteristicFirmwareRevision characteristic={characteristic} />
    ),
  };

  function getCharacteristics() {
    return (
      characteristicMap[
        characteristic.uuid.substring(0, 8) as keyof typeof characteristicMap
      ] ?? (() => <span>未知特征 {characteristic.uuid}</span>)()
    );
  }

  return (
    <div className="text-center p-4 bg-muted rounded-xl shadow relative overflow-hidden group">
      {getCharacteristics()()}
    </div>
  );
}

export default Characteristic;
