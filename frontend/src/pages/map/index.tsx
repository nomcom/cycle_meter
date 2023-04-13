import * as React from "react";
import {
  Polyline,
  Marker,
  GoogleMap,
  useLoadScript,
} from "@react-google-maps/api";
import { api } from "common-library";

const App: React.FC = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY, // ,
    // ...otherOptions
  });
  const [map, setMap] = React.useState<any>(null);
  const [positions, setPositions] = React.useState<google.maps.LatLng[]>([]);
  const [zoom, setZoom] = React.useState(12); // initial zoom
  const [center, setCenter] = React.useState<google.maps.LatLngLiteral>({
    lat: 0,
    lng: 0,
  });

  const onLoad = React.useCallback(function callback(map: any) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map: any) {
    setMap(null);
  }, []);
  const onZoomChanged = React.useCallback(
    function callback() {
      if (map && isLoaded) {
        setZoom(map.getZoom());
      }
    },
    [map]
  );

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
  }, [positions]);

  if (!isLoaded) {
    return <></>;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onClick = (e: google.maps.MapMouseEvent) => {
    // avoid directly mutating state
  };

  let mapElements = null;
  // ロード済みの場合のみ
  mapElements = (
    <>
      {positions.map((latLng, i) => (
        <Marker key={i} position={latLng} />
      ))}
      <Polyline
        path={positions}
        options={{
          strokeColor: "#ff2527",
          strokeOpacity: 0.75,
          strokeWeight: 5,
          // icons: [
          //   {
          //     icon: {
          //       path: google.maps.SymbolPath.CIRCLE,
          //     },
          //     offset: "0",
          //     repeat: "20px",
          //   },
          // ],
        }}
      />
    </>
  );

  const but = (
    <label
      htmlFor="my-drawer"
      className="fixed top-2 right-2 btn btn-primary drawer-button"
    >
      Open drawer
    </label>
  );

  const form = (
    <div className="menu p-4 w-80 bg-gray-300 text-base-content">
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

      <button title="Submit" onClick={onSubmit} disabled={!isLoaded}>
        データ取得
      </button>
    </div>
  );

  return (
    <div className="drawer" style={{ height: "100%" }}>
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <GoogleMap
          center={center}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={onClick}
          onZoomChanged={onZoomChanged}
          zoom={zoom}
          mapContainerStyle={{ flexGrow: "1", height: "100%" }}
        >
          {mapElements}
        </GoogleMap>
      </div>
      {but}
      <div className="drawer-side">{form}</div>
    </div>
  );
};

export default App;
