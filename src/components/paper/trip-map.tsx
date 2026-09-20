"use client";

import {
  Map,
  MapMarker,
  MapPopup,
  MapTileLayer,
  MapZoomControl,
} from "@/components/ui/map";
import { cn } from "@/lib/utils";

export type TripPin = {
  position: [number, number];
  label: string;
  color?: string;
  days?: string[];
};

export function PaperPin({ color = "var(--poppy)" }: { color?: string }) {
  return (
    <svg width={26} height={32} viewBox="0 0 26 32" aria-hidden focusable="false">
      <path
        d="M13 31 C 2 17, 1 9, 6 4 C 11 -1, 21 1, 23 8 C 25 15, 20 22, 13 31 Z"
        fill={color}
      />
      <circle cx={13} cy={11} r={4.5} fill="var(--paper-cream)" />
    </svg>
  );
}

export function TripMap({
  pins,
  selectedDate,
  className,
  height = 260,
}: {
  pins: TripPin[];
  selectedDate?: string;
  className?: string;
  height?: number;
}) {
  const visible = selectedDate
    ? pins.filter((pin) => !pin.days || pin.days.includes(selectedDate))
    : pins;

  return (
    <div
      className={cn(
        "paper-map relative overflow-hidden rounded-sm shadow-[var(--shadow-cut)]",
        className,
      )}
      style={{ height }}
    >
      <Map
        center={[28.48, -81.37]}
        zoom={10}
        className="min-h-0 rounded-sm"
        scrollWheelZoom={false}
      >
        <MapTileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <MapZoomControl position="top-2 left-2" />
        {visible.map((pin) => (
          <MapMarker
            key={pin.label}
            position={pin.position}
            icon={<PaperPin color={pin.color} />}
            iconAnchor={[13, 31]}
            popupAnchor={[0, -28]}
          >
            <MapPopup>
              <p className="font-hand text-lg text-ink">{pin.label}</p>
            </MapPopup>
          </MapMarker>
        ))}
      </Map>
    </div>
  );
}
