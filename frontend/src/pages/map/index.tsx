/*
 * Copyright 2021 Google LLC. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { Polyline } from "@react-google-maps/api";
import { api } from "common-library";

const render = (status: Status) => {
  return <h1>{status}</h1>;
};

const App: React.FC = () => {
  const [positions, setPositions] = React.useState<google.maps.LatLng[]>([]);
  const [zoom, setZoom] = React.useState(12); // initial zoom
  const [center, setCenter] = React.useState<google.maps.LatLngLiteral>({
    lat: 0,
    lng: 0,
  });

  const onClick = (e: google.maps.MapMouseEvent) => {
    // avoid directly mutating state
  };

  const onIdle = (m: google.maps.Map) => {
    console.log("onIdle");
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setZoom(m.getZoom()!);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setCenter(m.getCenter()!.toJSON());
  };

  const onSubmit = React.useCallback(async () => {
    const response = await api.markersGet({
      orderBy: "timestamp",
      startAt: 0,
      limitToFirst: 100,
    });
    // 成功時の処理
    const newPos = Object.keys(response.data).map(
      (key) =>
        new google.maps.LatLng(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          response.data[key].latitude!,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          response.data[key].longitude!
        )
    );
    if (newPos && newPos.length > 0) {
      setPositions(positions.concat(newPos));
      setCenter(newPos[newPos.length - 1].toJSON());
    }
  }, [api.markerCreate]);

  const form = (
    <div
      style={{
        padding: "1rem",
        flexBasis: "250px",
        height: "100%",
        overflow: "auto",
      }}
    >
      <label htmlFor="zoom">Zoom</label>
      <input
        type="number"
        id="zoom"
        name="zoom"
        value={zoom}
        onChange={(event) => setZoom(Number(event.target.value))}
      />
      <br />
      <label htmlFor="lat">Latitude</label>
      <input type="number" id="lat" name="lat" value={center.lat} disabled />
      <br />
      <label htmlFor="lng">Longitude</label>
      <input type="number" id="lng" name="lng" value={center.lng} disabled />

      <button title="Submit" onClick={onSubmit}>
        データ取得
      </button>
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Wrapper apiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY} render={render}>
        <Map
          center={center}
          onClick={onClick}
          onIdle={onIdle}
          zoom={zoom}
          style={{ flexGrow: "1", height: "100%" }}
        >
          {positions.map((latLng, i) => (
            <Marker key={i} position={latLng} />
          ))}
          <Polyline
            path={positions}
            options={{
              strokeColor: "#ff2527",
              strokeOpacity: 0.75,
              strokeWeight: 2,
              // icons: [
              //   {
              //     icon: lineSymbol,
              //     offset: "0",
              //     repeat: "20px",
              //   },
              // ],
            }}
          />
        </Map>
      </Wrapper>
      {/* Basic form for controlling center and zoom of map. */}
      {form}
    </div>
  );
};
interface MapProps extends google.maps.MapOptions {
  style: { [key: string]: string };
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
  children?: React.ReactNode;
}

const Map: React.FC<MapProps> = ({
  onClick,
  onIdle,
  children,
  style,
  ...options
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<google.maps.Map>();

  React.useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}));
    }
  }, [ref, map]);

  // because React does not do deep comparisons, a custom hook is used
  // see discussion in https://github.com/googlemaps/js-samples/issues/946
  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);

  React.useEffect(() => {
    if (map) {
      ["click", "idle"].forEach((eventName) =>
        google.maps.event.clearListeners(map, eventName)
      );

      if (onClick) {
        map.addListener("click", onClick);
      }

      if (onIdle) {
        map.addListener("idle", () => onIdle(map));
      }
    }
  }, [map, onClick, onIdle]);

  return (
    <>
      <div ref={ref} style={style} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          return React.cloneElement(child, { map } as any);
        }
      })}
    </>
  );
};

const Marker: React.FC<google.maps.MarkerOptions> = (options) => {
  const [marker, setMarker] = React.useState<google.maps.Marker>();

  React.useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker());
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  React.useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);

  return null;
};
function useDeepCompareMemoize(value: any) {
  const ref = React.useRef();

  ref.current = value;

  return ref.current;
}

function useDeepCompareEffectForMaps(
  callback: React.EffectCallback,
  dependencies: any[]
) {
  React.useEffect(callback, dependencies.map(useDeepCompareMemoize));
}

export default App;
