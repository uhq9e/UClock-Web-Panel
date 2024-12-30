/// <reference types="web-bluetooth" />

// @ts-expect-error ignore
import "@fontsource-variable/noto-sans-sc";
import "./App.css";

import { useState } from "react";
import { Icon } from "@iconify-icon/react";
import { Button } from "./components/ui/button";
import { useLoading } from "./lib/utils";
import Device from "./components/bt/device";

function App() {
  const { loading, start: startLoading, end: endLoading } = useLoading();

  const [device, setDevice] = useState<BluetoothDevice>();

  async function connect() {
    const loadingId = startLoading();

    try {
      const d = await navigator.bluetooth.requestDevice({
        filters: [
          {
            namePrefix: "UClock",
          },
        ],
        optionalServices: [0x1805, 0x180a],
      });

      if (d.gatt && !d.gatt.connected) {
        await d.gatt.connect();
      }

      setDevice(d);
    } catch (e) {
      console.error(e);
    } finally {
      endLoading(loadingId);
    }
  }

  function onDisconnect() {
    setDevice(undefined);
  }

  return navigator.bluetooth ? (
    <div className="min-h-screen flex justify-center items-center relative">
      {loading && (
        <div className="absolute top-8 right-8 flex gap-2 items-center">
          <Icon icon="lucide:loader-circle" className="animate-spin" />
          <span className="text-sm font-medium">加载中...</span>
        </div>
      )}

      {!device ? (
        <div>
          <Button onClick={connect}>连接设备</Button>
        </div>
      ) : (
        <Device device={device} onDisconnect={onDisconnect} />
      )}
    </div>
  ) : (
    <span>该浏览器不支持蓝牙或非安全环境</span>
  );
}

export default App;
