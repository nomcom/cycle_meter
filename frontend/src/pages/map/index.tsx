import * as React from "react";
import {
  Polyline,
  Marker,
  GoogleMap,
  LoadScript,
} from "@react-google-maps/api";
import { api } from "common-library";

const App: React.FC = () => {
  const [positions, setPositions] = React.useState<google.maps.LatLng[]>([]);
  const [zoom, setZoom] = React.useState(12); // initial zoom
  const [center, setCenter] = React.useState<google.maps.LatLngLiteral>({
    lat: 0,
    lng: 0,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onClick = (e: google.maps.MapMouseEvent) => {
    // avoid directly mutating state
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
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}>
        <GoogleMap
          center={center}
          onClick={onClick}
          zoom={zoom}
          mapContainerStyle={{ flexGrow: "1", height: "100%" }}
        >
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
              //     icon: lineSymbol,
              //     offset: "0",
              //     repeat: "20px",
              //   },
              // ],
            }}
          />
        </GoogleMap>
      </LoadScript>
      {/* Basic form for controlling center and zoom of map. */}
      {form}
    </div>
  );
};

export default App;
