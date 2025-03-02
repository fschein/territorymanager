"use client";
import { Button } from "@/components/ui/button";
import { useTerritories } from "@/hooks/useTerritories";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import * as turf from "@turf/turf";
import { Layers } from "lucide-react";
import mapboxgl, { Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import TerritorySideInfo from "./TerritorySideInfo";
import { useStoreTerritory } from "./store";

// Defina a chave de acesso do Mapbox
const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_APP_TOKEN;
mapboxgl.accessToken = TOKEN;

function MapWithoutDraw({ canEdit }: { canEdit: boolean }) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>(null);
  const draw = useRef<MapboxDraw | null>(null);
  const { data: territories, isSuccess, isPending } = useTerritories().getAll({ filters: { id } });
  const openSideInfo = useStoreTerritory().openSideInfo;
  const mapStyle = useStoreTerritory().mapStyle;
  const toggleMapStyle = useStoreTerritory().toggleMapStyle;
  const [styleLoaded, setStyleLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Definir como true quando o componente for renderizado no cliente
  }, []);

  useEffect(() => {
    if (map.current) return; // Evita recriar o mapa

    map.current = new mapboxgl.Map({
      container: mapContainer.current as HTMLElement,
      style: mapStyle,
      center: [-35.2628, -5.9156],
      zoom: 12.5,
    });

    //* CONTROLES DO MAPA
    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: { polygon: canEdit },
    });

    map.current.addControl(draw.current);

    map.current.addControl(new mapboxgl.FullscreenControl({ container: mapContainer.current }));

    // Initialize the geolocate control.
    // const geolocate = new mapboxgl.GeolocateControl({
    //   positionOptions: {
    //     enableHighAccuracy: true,
    //   },
    //   trackUserLocation: true,
    // });

    // map.current.addControl(geolocate);
    map.current.on("load", () => {
      // geolocate.trigger();
      loadTerritories();
    });

    //* DESABILITA DOUBBLE CLICK ZOOM
    map.current.doubleClickZoom.disable();

    //* CRIAÇÃO DE POLÍGONO
    map.current.on("draw.create", (e: { features: mapboxgl.MapboxGeoJSONFeature[] }) => {
      const { features } = e;
      if (features.length > 0) {
        if (features[0].geometry.type === "Polygon") {
          const coordinates = features[0].geometry.coordinates as [number, number][][];

          if (coordinates) {
            openSideInfo({ id: "", coordinates });
          }
        }
      }
    });

    // return () => map.current?.remove();
  }, []);

  //* ATUALIZAÇÃO DE ESTILO
  useEffect(() => {
    if (!map.current) return;
    setStyleLoaded(false);
    setTimeout(() => {
      map.current?.setStyle(mapStyle);
    }, 100);

    map.current.once("style.load", () => {
      loadTerritories();
      setStyleLoaded(true);
    });
  }, [mapStyle, territories, isClient]);

  //* FUNÇÃO DE CARREGAR TERRITÓRIOS
  async function loadTerritories() {
    if (!map.current || !territories?.length || !territories[0] || !styleLoaded || !isClient)
      return;

    setTimeout(() => {
      if (!map.current) return;

      if (map.current.getSource("poligonos")) {
        // Remover todas as layers antes de remover as sources
        if (map.current.getLayer("poligonos-fill")) {
          map.current.removeLayer("poligonos-fill");
        }
        if (map.current.getLayer("poligonos-outline")) {
          map.current.removeLayer("poligonos-outline");
        }
        if (map.current.getLayer("poligonos-number")) {
          map.current.removeLayer("poligonos-number");
        }

        // Agora é seguro remover as sources
        if (map.current.getSource("poligonos-labels")) {
          map.current.removeSource("poligonos-labels");
        }
        if (map.current.getSource("poligonos")) {
          map.current.removeSource("poligonos");
        }
      }

      map.current.addSource("poligonos", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: territories.map((poligono) => ({
            type: "Feature",
            properties: {
              id: poligono?._id,
              color: poligono?.group?.color,
              status: poligono?.status, // Adiciona status
              number: poligono?.number, // Adiciona status
            },
            geometry: {
              type: "Polygon",
              coordinates: poligono?.coordinates || [],
            },
          })),
        },
      });

      // Criar um novo source para os números (centro dos territórios)
      map.current.addSource("poligonos-labels", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: territories.map((poligono) => {
            const center = turf.centroid({
              type: "Feature",
              properties: {},
              geometry: {
                type: "Polygon",
                coordinates: poligono?.coordinates || [],
              },
            }).geometry.coordinates;

            return {
              type: "Feature",
              properties: {
                number: poligono?.number || "",
                color: poligono?.group?.color || "",
              },
              geometry: {
                type: "Point",
                coordinates: center,
              },
            };
          }),
        },
      });

      // Adicionar camada dos polígonos
      map.current.addLayer({
        id: "poligonos-fill",
        type: "fill",
        source: "poligonos",
        paint: {
          "fill-color": ["get", "color"],
          "fill-opacity": 0.2,
        },
      });

      // Adicionar camada das bordas dos polígonos
      map.current.addLayer({
        id: "poligonos-outline",
        type: "line",
        source: "poligonos",
        paint: {
          "line-color": ["get", "color"],
          "line-width": 2,
        },
      });

      // Adicionar camada para os números no centro dos territórios
      map.current.addLayer({
        id: "poligonos-number",
        type: "symbol",
        source: "poligonos-labels",
        layout: {
          "text-field": ["get", "number"], // Exibe o número do number
          "text-size": 18,
          "text-font": ["Open Sans Bold"], // Usa a versão bold da fonte
          "text-anchor": "center",
        },
        paint: {
          "text-color": ["get", "color"], // Cor do número
          "text-halo-color": "#fefefe", // Borda branca para melhorar a visibilidade
          "text-halo-width": 1,
        },
      });

      // Mudar cursor ao passar sobre os polígonos
      map.current.on("mouseenter", "poligonos-fill", () => {
        map.current!.getCanvas().style.cursor = "pointer";
      });

      map.current.on("mouseleave", "poligonos-fill", () => {
        map.current!.getCanvas().style.cursor = "";
      });

      // Evento de clique nos polígonos
      // map.current.on("click", "poligonos-fill", handlePolygonClick);
      // map.current.on("touchend", "poligonos-fill", handlePolygonClick);
      map.current.on("dblclick", "poligonos-fill", handlePolygonClick);
      let lastTap = 0;

      map.current.on("touchend", "poligonos-fill", (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        if (tapLength < 300 && tapLength > 0) {
          handlePolygonClick(e);
        }
        lastTap = currentTime;
      });

      function handlePolygonClick(e: any) {
        if (!e.features || e.features.length === 0) return;
        const id = e.features[0].properties?.id;
        openSideInfo({ id });
      }

      if (territories.length > 0 && !!territories[0]) {
        const bounds = new mapboxgl.LngLatBounds();

        territories.forEach((territory) => {
          // Flatten para obter apenas os pontos individuais
          const coordinates = territory?.coordinates.flat(1); // Achata até o nível dos pontos

          coordinates?.forEach((coord) => {
            if (Array.isArray(coord) && coord.length === 2) {
              bounds.extend(coord as unknown as [number, number]); // Extende o bounds com o ponto
            }
          });
        });

        map.current.fitBounds(bounds, {
          padding: 40,
          maxZoom: id ? 18 : 16,
          duration: 1000,
        });
      }
    }, 350);
  }

  //* ATUALIZAÇÃO DE TERRITÓRIOS QUANDO CHEGAM NOVOS DADOS
  useEffect(() => {
    if (territories && territories.length > 0 && territories[0] && isSuccess) {
      loadTerritories();
    }
  }, [territories, territories && territories[0], styleLoaded, isClient, isSuccess, isPending]);

  const deleteSelectedPolygon = () => {
    if (draw.current) {
      const selectedFeatures = draw.current.getSelected();
      if (selectedFeatures.features.length > 0) {
        const featureId = selectedFeatures.features[0].id;
        if (featureId) {
          draw.current.delete(String(featureId));
        }
      }
    }
  };
  return (
    <div className="flex justify-center items-center flex-wrap">
      <div ref={mapContainer} className="rounded-md max-w-6xl h-[80dvh] w-full">
        <Button
          onClick={() => {
            toggleMapStyle();
          }}
          size={"sm"}
          variant={"secondary"}
          className="aspect-square rounded-full w-10 h-10"
          style={{ position: "absolute", top: "10px", left: "10px", zIndex: 1 }}
        >
          <Layers size={16} />
        </Button>
      </div>
      <TerritorySideInfo removeFeature={deleteSelectedPolygon} editing={canEdit} />
      {/* 
      //? BUTTONS FOR GET DE ZOOM AND THE CENTER FOR REPLACE IN THE MAP INSTANCE
      <div className="flex min-w-full gap-2">
        <Button onClick={() => console.log("ZOOM", map.current?.getZoom())}>ZOOM</Button>
        <Button onClick={() => console.log("CENTER", map.current?.getCenter())}>CENTER</Button>
      </div> 
      */}
    </div>
  );
}
const Page = ({ canEdit }: { canEdit: boolean }) => {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <MapWithoutDraw canEdit={canEdit} />
    </Suspense>
  );
};
export default Page;
