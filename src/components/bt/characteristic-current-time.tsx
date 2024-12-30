import { decodeCurrentTime, encodeCurrentTime } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Icon } from "@iconify-icon/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { DateTimePicker } from "../time-picker/date-time-picker";
import { enqueue } from "@/lib/gatt-queue";

function CharacteristicCurrentTime({
  characteristic,
}: {
  characteristic: BluetoothRemoteGATTCharacteristic;
}) {
  const [currentTime, setCurrentTime] = useState<string>();
  const [timeSettingOverlayShow, setTimeSettingOverlayShow] = useState(false);
  const [settingTime, setSettingTime] = useState<Date>(new Date());

  useEffect(() => {
    characteristic.addEventListener("characteristicvaluechanged", () => {
      const value = characteristic.value;

      if (value) setCurrentTime(decodeCurrentTime(value).toLocaleString());
    });

    // characteristic.startNotifications();
    (async () => {
      await enqueue(characteristic.startNotifications);
    })();
  }, []);

  function setTime() {
    setSettingTime(new Date());
    setTimeSettingOverlayShow(true);
  }

  function setTimeToNow() {
    characteristic.writeValue(encodeCurrentTime(new Date()));
  }

  function settingTimeSubmit() {
    setTimeSettingOverlayShow(false);

    characteristic.writeValue(encodeCurrentTime(settingTime));
  }

  return (
    <div className="relative">
      <div className="flex-1">
        <div className="text-sm">当前时间</div>
        {currentTime ? (
          <div className="text-xl font-black">{currentTime}</div>
        ) : (
          <Icon icon="lucide:loader-circle" className="animate-spin" />
        )}
      </div>

      <div className="flex flex-col gap-1 absolute top-0 bottom-0 -right-16 transition-all group-hover:right-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={setTime}>
                <Icon icon="uil:wrench" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>设置时间</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={setTimeToNow}>
                <Icon icon="uil:clock" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>设定为系统时间</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div
        className="bg-muted/75 absolute inset-0 flex justify-center items-center invisible data-[open=true]:visible"
        data-open={timeSettingOverlayShow}
      >
        <div className="flex gap-2">
          <DateTimePicker date={settingTime} setDate={setSettingTime} />
          <Button size="icon" variant="outline" onClick={settingTimeSubmit}>
            <Icon icon="uil:check" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => setTimeSettingOverlayShow(false)}
          >
            <Icon icon="uil:times" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CharacteristicCurrentTime;
