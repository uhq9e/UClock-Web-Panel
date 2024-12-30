import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLoading } from "@/lib/utils";
import { useMemo, useState } from "react";
import { Icon } from "@iconify-icon/react";
import { serviceNameMap } from "@/commons";
import Characteristic from "./characteristic";

function Service({ service }: { service: BluetoothRemoteGATTService }) {
  const { loading, start: startLoading, end: endLoading } = useLoading();
  const [characteristics, setCharacteristics] =
    useState<BluetoothRemoteGATTCharacteristic[]>();

  useMemo(async () => {
    if (service) {
      const loadingId = startLoading();

      const characteristics = await service.getCharacteristics();

      setCharacteristics(characteristics);

      endLoading(loadingId);
    } else setCharacteristics(undefined);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {serviceNameMap[
            service.uuid.substring(0, 8) as keyof typeof serviceNameMap
          ] ?? "未知服务"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading ? (
          <Icon icon="lucide:loader-circle" className="animate-spin" />
        ) : (
          <>
            {characteristics?.map((characteristic) => (
              <Characteristic
                key={characteristic.uuid}
                characteristic={characteristic}
              />
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default Service;
