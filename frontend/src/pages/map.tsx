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

import { storage } from "../firebaseConfig";

const App: React.FC = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY, // ,
    // ...otherOptions
  });
  const [map, setMap] = React.useState<any>(null);
  const [mapLatLngs, setMapLatLngs] = React.useState<google.maps.LatLng[]>([]);
  const [markers, setMarkers] = React.useState<MarkerCreateBody[]>([]);
  const [markerText, setMarkerText] = React.useState("");
  const [markerImg, setMarkerImg] = React.useState("");

  const [zoom, setZoom] = React.useState(12); // initial zoom
  const [center, setCenter] = React.useState<google.maps.LatLngLiteral>({
    lat: 0,
    lng: 0,
  });

  // ************* イベント関係 *************
  // MAP
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

  // KMLダウンロード
  const onKmlGet = React.useCallback(async () => {
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

  // 画像ダウンロード
  const onImageGet = React.useCallback(async () => {
    // 全画像ダウンロード
    const promises = markers
      .filter((loc) => loc.imageId)
      .map((loc) =>
        (async () => {
          const imageUrl = await util.firebaseUtil.getInStorageAsync(
            storage,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            loc.imageId!
          );
          util.htmlUtil.downloadUrl(imageUrl, `img_${loc.timestamp}.jpg`);
        })()
      );
    await Promise.all(promises);
  }, [markers]);

  // データ取得
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

      setMarkers(newMarkers);
      setMapLatLngs(newLatLngs);

      setCenter(newLatLngs[newLatLngs.length - 1].toJSON());

      // 日付設定
      dateFrom.value = util.dateUtil.toDateString(newMarkers[0].timestamp);
      timeFrom.value = util.dateUtil.toTimeString(newMarkers[0].timestamp);
      dateTo.value = util.dateUtil.toDateString(
        newMarkers[newMarkers.length - 1].timestamp
      );
      timeTo.value = util.dateUtil.toTimeString(
        newMarkers[newMarkers.length - 1].timestamp
      );
    }
  }, []);

  if (!isLoaded) {
    return <></>;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onClick = (e: google.maps.MapMouseEvent) => {
    //
  };
  const onClickMarker = async (index: number) => {
    const loc = markers[index];
    console.log(`CLICKED: ${JSON.stringify(loc)}`);

    let isPop = false;
    if (markers[index].imageId) {
      // Imageあり
      const imageUrl = await util.firebaseUtil.getInStorageAsync(
        storage,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        markers[index].imageId!
      );
      setMarkerImg(imageUrl);
      isPop = true;
    } else {
      setMarkerImg("");
    }

    if (markers[index].comment && markers[index].comment?.comment) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      setMarkerText(markers[index].comment!.comment!);
      isPop = true;
    } else {
      setMarkerText("");
    }

    if (isPop) {
      // Modal
      const check = document.getElementById("marker-modal") as HTMLInputElement;
      check.checked = true;
    }
  };

  let mapElements = null;
  // ロード済みの場合のみ
  mapElements = (
    <>
      {mapLatLngs.map((latLng, i) => {
        const isClickable =
          markers[i] && (markers[i].imageId || markers[i].comment);
        if (isClickable) {
          // クリック可
          return (
            <Marker
              key={i}
              position={latLng as google.maps.LatLng}
              onClick={() => {
                onClickMarker(i);
              }}
            />
          );
        } else {
          // クリック不可
          return (
            <Marker
              key={i}
              position={latLng as google.maps.LatLng}
              opacity={0.75}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                strokeColor: "red",
                scale: 4,
              }}
            />
          );
        }
      })}
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

      <div className="grid grid-flow-row content-start justify-start gap-1.5 m-1">
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
            onClick={onKmlGet}
            className={
              "bg-blue-200 " +
              (isLoaded && mapLatLngs.length > 0 ? "" : "disabled")
            }
          >
            KMLダウンロード
          </button>

          <button
            onClick={onImageGet}
            className={
              "bg-red-200 " +
              (isLoaded && mapLatLngs.length > 0 ? "" : "disabled")
            }
          >
            画像ダウンロード
          </button>
        </div>
      </div>
    </>
  );

  const modal = (
    <>
      <input type="checkbox" id="marker-modal" className="modal-toggle" />
      <label htmlFor="marker-modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <img id="marker-image" src={markerImg}></img>
          <span>{markerText}</span>
        </label>
      </label>
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
      <div className="drawer-side w-96 h-96 lg:h-full bg-slate-400/20 rounded-br-3xl">
        {form}
      </div>
      {modal}
    </div>
  );
};

export default App;
