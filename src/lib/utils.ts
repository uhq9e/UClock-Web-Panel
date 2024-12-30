import { clsx, type ClassValue } from "clsx";
import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useLoading() {
  const [ids, setIds] = useState<string[]>([]);
  const loading = useMemo(() => ids.length > 0, [ids]);

  function start() {
    const loadingId = Math.random().toString(36).slice(2);

    setIds([...ids, loadingId]);

    return loadingId;
  }

  function end(loadingId: string) {
    setIds(ids.filter((id) => id !== loadingId));
  }

  return { loading, start, end };
}

export function decodeCurrentTime(data: DataView) {
  const year = data.getUint16(0, true);
  const month = data.getUint8(2);
  const day = data.getUint8(3);
  const hour = data.getUint8(4);
  const minute = data.getUint8(5);
  const second = data.getUint8(6);

  return new Date(year, month - 1, day, hour, minute, second);
}

export function encodeCurrentTime(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const wday = date.getDay();

  return new Uint8Array([
    year & 0xff,
    year >> 8,
    month,
    day,
    hour,
    minute,
    second,
    wday,
    0x00,
    0x00,
  ]);
}

export function decodeTemperature(data: DataView) {
  const mantissa =
    ((data.getUint8(1) | (data.getUint8(2) << 8) | (data.getUint8(3) << 16)) <<
      8) >>
    8;

  const exponent = (data.getUint8(4) << 24) >> 24;

  if (mantissa === 0 && exponent === 0) {
    return 0.0;
  }

  return mantissa * Math.pow(10, exponent);
}
