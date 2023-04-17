import * as React from "react";
import {
  Polyline,
  Marker,
  GoogleMap,
  useLoadScript,
} from "@react-google-maps/api";
import { api, util } from "common-library";
import { MarkerCreateBody } from "common-library/dist/rest/api";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import tokml from "@maphubs/tokml";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import geojson from "geojson";

const App: React.FC = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY, // ,
    // ...otherOptions
  });
  const [map, setMap] = React.useState<any>(null);
  const [mapLatLngs, setMapLatLngs] = React.useState<google.maps.LatLng[]>([]);
  const [markers, setMarkers] = React.useState<MarkerCreateBody[]>([]);
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

  const onKml = React.useCallback(async () => {
    const dateFrom = document.getElementById("dateFrom") as HTMLInputElement;
    const dateTo = document.getElementById("dateTo") as HTMLInputElement;
    const fileName = `${dateFrom.value}_${dateTo.value}.kml`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const org: any = markers.map((m) => {
      return {
        ...m,
        timestamp: new Date(m.timestamp).toISOString(),
        comment: m.comment?.comment,
      };
    });
    org.push({
      line: markers.map((m) => [m.longitude, m.latitude]),
    });
    const geojsonObject = geojson.parse(
      org,
      {
        Point: ["latitude", "longitude"],
        LineString: "line",
      },
      {
        documentName: fileName,
        documentDescription: "KML Export",
      }
    );

    const response = tokml(geojsonObject);

    util.htmlUtil.downloadText(response, fileName);
  }, [markers]);

  const onSubmit = React.useCallback(async () => {
    const dateFrom = document.getElementById("dateFrom") as HTMLInputElement;
    const timeFrom = document.getElementById("timeFrom") as HTMLInputElement;
    const dateTo = document.getElementById("dateTo") as HTMLInputElement;
    const timeTo = document.getElementById("timeTo") as HTMLInputElement;

    const startDate = util.dateUtil.toUnixMilliSec(
      dateFrom.value + (timeFrom.value ? ` ${timeFrom.value}` : "")
    );
    const endDate = util.dateUtil.toUnixMilliSec(
      dateTo.value + (timeTo.value ? ` ${timeTo.value}` : ""),
      true
    );
    const response = await api.markersGet({
      orderBy: '"timestamp"',
      startAt: startDate ? startDate : undefined,
      endAt: endDate ? endDate : undefined,
      limitToFirst: 100,
    });

    if (response.data && Object.values(response.data).length > 0) {
      const newMarkers = Object.values(response.data).sort(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (r1, r2) => r1.timestamp! - r2.timestamp!
      ) as MarkerCreateBody[];

      // 成功時の処理
      const newLatLngs = newMarkers.map(
        (val) =>
          new google.maps.LatLng(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            val.latitude!,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            val.longitude!
          )
      );

      // setMapLatLngs(mapLatLngs.concat(newLatLngs));
      // const allMarkers = markers.concat(newMarkers);
      setMapLatLngs(newLatLngs);
      const allMarkers = newMarkers;
      setMarkers(allMarkers);

      setCenter(newLatLngs[newLatLngs.length - 1].toJSON());

      // 日付設定
      dateFrom.value = util.dateUtil.toDateString(allMarkers[0].timestamp);
      timeFrom.value = util.dateUtil.toTimeString(allMarkers[0].timestamp);
      dateTo.value = util.dateUtil.toDateString(
        allMarkers[allMarkers.length - 1].timestamp
      );
      timeTo.value = util.dateUtil.toTimeString(
        allMarkers[allMarkers.length - 1].timestamp
      );
    }
  }, []);

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
      {mapLatLngs.map((latLng, i) => (
        <Marker key={i} position={latLng as google.maps.LatLng} />
      ))}
      <Polyline
        path={mapLatLngs as google.maps.LatLng[]}
        options={{
          strokeColor: "#ff2527",
          strokeOpacity: 0.75,
          strokeWeight: 5,
        }}
      />
    </>
  );

  const but = (
    <label
      htmlFor="my-drawer"
      className="fixed top-2 right-2 btn btn-primary drawer-button lg:hidden"
    >
      Menu
    </label>
  );

  const form = (
    <>
      <label htmlFor="my-drawer" className="drawer-overlay"></label>

      <div className="grid grid-flow-row bg-slate-400/20 content-start justify-start gap-1.5 m-1">
        <div className="form-control grid grid-flow-col justify-start gap-1.5">
          <label className="input-group input-group-vertical w-24">
            <span className="grid place-content-center">Zoom</span>
            <input
              type="number"
              className="input input-bordered text-center"
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
            />
          </label>

          <label className="input-group input-group-vertical w-32">
            <span>Lat.</span>
            <input
              type="number"
              value={center.lat}
              className="input"
              disabled
            />
          </label>

          <label className="input-group input-group-vertical w-32">
            <span>Lng.</span>
            <input
              type="number"
              value={center.lng}
              className="input"
              disabled
            />
          </label>
        </div>

        <div className="form-control gap-1.5">
          <label className="label">
            <span className="label-text">From</span>
          </label>
          <label className="input-group">
            <input className="input" type="date" id="dateFrom" />
            <input className="input" type="time" id="timeFrom" />
            <button className="btn">
              <span
                className="material-symbols-outlined bg-transparent"
                onClick={() => {
                  (
                    document.getElementById("dateFrom") as HTMLInputElement
                  ).value = "";
                  (
                    document.getElementById("timeFrom") as HTMLInputElement
                  ).value = "";
                }}
              >
                cancel
              </span>
            </button>
          </label>

          <label className="label">
            <span className="label-text">To</span>
          </label>
          <label className="input-group">
            <input className="input" type="date" id="dateTo" />
            <input className="input" type="time" id="timeTo" />
            <button className="btn">
              <span
                className="material-symbols-outlined bg-transparent"
                onClick={() => {
                  (
                    document.getElementById("dateTo") as HTMLInputElement
                  ).value = "";
                  (
                    document.getElementById("timeTo") as HTMLInputElement
                  ).value = "";
                }}
              >
                cancel
              </span>
            </button>
          </label>
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={onSubmit}
            className={"bg-green-200 " + (isLoaded ? "" : "disabled")}
          >
            データ取得
          </button>
          <button
            onClick={onKml}
            className={
              "bg-blue-200 " +
              (isLoaded && mapLatLngs.length > 0 ? "" : "disabled")
            }
          >
            KMLダウンロード
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="drawer drawer-mobile" style={{ height: "100%" }}>
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
      <div className="drawer-side w-96 h-96 lg:h-full">{form}</div>
    </div>
  );
};

export default App;
