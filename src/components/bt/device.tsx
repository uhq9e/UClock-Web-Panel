import { useEffect, useState } from "react";
import Service from "./service";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Icon } from "@iconify-icon/react";
import { useLoading } from "@/lib/utils";

function Device({
  device,
  onDisconnect,
}: {
  device: BluetoothDevice;
  onDisconnect?: () => void;
}) {
  const { loading, start: startLoading, end: endLoading } = useLoading();
  const [services, setServices] = useState<BluetoothRemoteGATTService[]>();

  useEffect(() => {
    (async () => {
      if (device.gatt) {
        device.addEventListener("gattserverdisconnected", () =>
          onDisconnect?.()
        );

        const loadingId = startLoading();

        const srvs = await device.gatt.getPrimaryServices();
        setServices(srvs);

        endLoading(loadingId);
      }
    })();
  }, []);

  function disconnect() {
    if (device?.gatt) device.gatt.disconnect();
    onDisconnect?.();
  }

  return loading ? (
    <Icon icon="lucide:loader-circle" className="animate-spin" />
  ) : (
    <Card className="max-w-full w-[40rem]">
      <CardHeader>
        <CardTitle className="space-x-2">
          <span>{device.name}</span>
          <Button variant="ghost" size="icon" onClick={disconnect}>
            <Icon icon="lucide:x" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {services?.map((service) => (
          <Service key={service.uuid} service={service} />
        ))}
      </CardContent>
    </Card>
  );
}

export default Device;
