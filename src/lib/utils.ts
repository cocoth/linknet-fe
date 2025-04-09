import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function debounce(func:(...args: any[])=>void, timeout: number) {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}



function formatDateToParts(date: Date, timeZone: string): { [key: string]: string } {
  const formatter = new Intl.DateTimeFormat("id-ID", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const formattedParts = formatter.formatToParts(date);
  const dateParts: { [key: string]: string } = {};

  formattedParts.forEach(({ type, value }) => {
    dateParts[type] = value;
  });

  return dateParts;
}

function formatDateString(dateParts: { [key: string]: string }): string {
  return `${dateParts.year}-${dateParts.month}-${dateParts.day}T${dateParts.hour}:${dateParts.minute}:${dateParts.second}Z`;
}

function logFormat(dateParts: { [key: string]: string }): string {
  return `${dateParts.day}/${dateParts.month}/${dateParts.year} ${dateParts.hour}:${dateParts.minute}:${dateParts.second}`;
}

export function GetCurrentTime(): Date {
  const now = new Date();
  const dateParts = formatDateToParts(now, "Asia/Jakarta");
  const formattedDateString = formatDateString(dateParts);
  return new Date(formattedDateString);
}

export function ConvertDateToString(dstr: string): string {
  const date = new Date(dstr);
  const dateParts = formatDateToParts(date, "Asia/Jakarta");
  return logFormat(dateParts);
}

export function GetCurrentTimeToString(): string {
  const now = new Date();
  const dateParts = formatDateToParts(now, "Asia/Jakarta");
  return formatDateString(dateParts);
}

export function GetTimeForLogFormat(): string {
  const now = new Date();
  const dateParts = formatDateToParts(now, "Asia/Jakarta");
  return logFormat(dateParts);
}
