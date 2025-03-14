"use client";
import AlertRemoveSquare from "@/components/custom/AlertRemoveSquare";
import { ToggleMapMode } from "@/components/custom/ToggleMapMode";
import { Button } from "@/components/ui/button";
import { useTerritories } from "@/hooks/useTerritories";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import * as turf from "@turf/turf";
import { ChevronLeft, CircleCheck, Layers } from "lucide-react";
import mapboxgl, { Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import ButtonDate from "./ButtonDate";
import SquareSideInfo from "./SquareSideInfo";
import TerritorySideInfo from "./TerritorySideInfo";
import { useStoreTerritory } from "./store";

export type SquareListProps = {
  id: string;
  label: string;
  canToggle: boolean;
};
// Defina a chave de acesso do Mapbox
const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_APP_TOKEN;
mapboxgl.accessToken = TOKEN;

function MapWithoutDraw({ canEdit }: { canEdit: boolean }) {
  const searchParams = useSearchParams();
  const number = searchParams.get("number");

  //~ HOOK DE CONSULTA DE TERRITÓRIOS
  const showSquares = +canEdit || +!!number;
  const {
    data: territories,
    isSuccess,
    isPending,
  } = useTerritories().getAll({ filters: { number, showSquares } });
  const { mutate: doneSquares } = useTerritories().doneSquares();

  //~ DADOS/FUNÇÕES STORE
  const openSideInfo = useStoreTerritory().openSideInfo;
  const openAlertRemoveSquare = useStoreTerritory().openAlertRemoveSquare;

  const mapStyle = useStoreTerritory().mapStyle;
  const toggleMapStyle = useStoreTerritory().toggleMapStyle;

  const mode = useStoreTerritory().mode;
  const toggleMode = useStoreTerritory().toggleMode;

  //~ STATES
  const [styleLoaded, setStyleLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [squareList, setSquareList] = useState<SquareListProps[]>([]);

  //& EFFECT DE CLIENTE
  useEffect(() => {
    setIsClient(true); // Definir como true quando o componente for renderizado no cliente
  }, []);

  //& EFFECT DE INICIALIZAÇÃO DO MAPBOX
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

    //* GEOLOCATE CONTROL
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });

    map.current.addControl(geolocate);

    //* PRIMEIRO CARREGAMENTO DOS TERRITÓRIOS
    map.current.on("load", () => {
      // geolocate.trigger();
      loadTerritories();
    });

    //* DESABILITA DOUBBLE CLICK ZOOM
    map.current.doubleClickZoom.disable();

    //* EVENTO DE CRIAÇÃO DE POLÍGONO
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
  }, []);

  //& ATUALIZAÇÃO DE ESTILO
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>(null);
  const draw = useRef<MapboxDraw | null>(null);
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
  }, [isClient]);

  //& FUNÇÕES DOS TERRITÓRIOS E DAS QUADRAS
  const handleTerritoryClick = useCallback(
    (e: any) => {
      if (!e.features || e.features.length === 0) return;
      const id = e.features[0].properties?.id;
      openSideInfo({ id, mode: "territory" });
    },
    [openSideInfo]
  );

  const handleSquareClick = useCallback((e: any) => {
    if (!e.features || e.features.length === 0) return;
    const id = e.features[0].properties?.id;
    const label = e.features[0].properties?.number;
    setSquareList((prev) => {
      const existingSquare = prev.find((sq) => sq.id === id);
      if (existingSquare) {
        return existingSquare.canToggle ? prev.filter((sq) => sq.id !== id) : prev;
      }
      return [...prev, { id, canToggle: true, label }];
    });
  }, []);

  const handleRemoveSquare = useCallback(
    (e: any) => {
      if (!e.features || e.features.length === 0) return;
      const id = e.features[0].properties?.id;
      openAlertRemoveSquare(id);
    },
    [openAlertRemoveSquare]
  );

  //* --------------- QUADRAS ---------------
  //& FUNÇÃO DE CARREGAR QUADRAS
  const loadTerritoriesSquares = useCallback(() => {
    if (!map.current || !territories?.length || !territories[0] || !styleLoaded || !isClient)
      return;

    territories.forEach((territory, index) => {
      const squares = territory.squares;

      if (!squares || !squares.length || !map.current) return;

      // Criar fontes para cada território
      const squaresSourceId = `squares`;
      const squaresLabelsSourceId = `squares-labels`;

      // Removendo layers e sources existentes
      const layersToRemove = [`squares-fill`, `squares-outline`, `squares-number`];
      layersToRemove.forEach((layer) => {
        if (map.current!.getLayer(layer)) {
          map.current!.removeLayer(layer);
        }
      });

      const sourcesToRemove = [squaresSourceId, squaresLabelsSourceId];
      sourcesToRemove.forEach((source) => {
        if (map.current!.getSource(source)) {
          map.current!.removeSource(source);
        }
      });

      // Adicionar o source de squares para o território
      map.current.addSource(squaresSourceId, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: squares.map((square) => ({
            type: "Feature",
            properties: {
              id: square._id,
              color: territory?.group?.color,
              number: `${territory?.number}${square.letter}`,
            },
            geometry: {
              type: "Polygon",
              coordinates: square.coordinates || [],
            },
          })),
        },
      });

      // Adicionar o source de labels para os squares do território
      map.current.addSource(squaresLabelsSourceId, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: squares.map((square) => {
            const center = turf.centroid({
              type: "Feature",
              properties: {},
              geometry: { type: "Polygon", coordinates: square?.coordinates || [] },
            }).geometry.coordinates;

            return {
              type: "Feature",
              properties: {
                number: `${territory?.number}${square.letter}` || "",
                color: territory?.group?.color || "",
              },
              geometry: { type: "Point", coordinates: center },
            };
          }),
        },
      });

      // Adicionar a camada de preenchimento das quadras para o território
      map.current.addLayer({
        id: `squares-fill`,
        type: "fill",
        source: squaresSourceId,
        paint: {
          "fill-color": ["get", "color"],
          "fill-opacity": [
            "step",
            ["to-number", ["in", ["get", "id"], ["literal", squareList.map((sq) => sq.id)]]],
            0.2,
            1,
            0.8,
          ],
        },
      });

      if (number) {
        const doneSquaresList = territory?.doneSquaresList;
        if (doneSquaresList && map.current!.getLayer("squares-fill")) {
          map.current.setPaintProperty("squares-fill", "fill-opacity", [
            "step",
            ["to-number", ["in", ["get", "id"], ["literal", doneSquaresList]]],
            0.2,
            1,
            0.6,
          ]);
        }
      }

      // Adicionar a camada das bordas dos squares para o território
      map.current.addLayer({
        id: `squares-outline`,
        type: "line",
        source: squaresSourceId,
        paint: {
          "line-color": ["get", "color"],
          "line-width": 2,
        },
      });

      // Adicionar a camada de números dos squares
      map.current.addLayer({
        id: `squares-number`,
        type: "symbol",
        source: squaresLabelsSourceId,
        layout: {
          "text-field": ["get", "number"],
          "text-size": 18,
          "text-font": ["Open Sans Bold"],
          "text-anchor": "center",
        },
        paint: {
          "text-color": ["get", "color"],
          "text-halo-color": "#fefefe",
          "text-halo-width": 1,
        },
      });

      map.current.off("click", "squares-fill", handleSquareClick);
      map.current.off("touchend", "squares-fill", handleSquareClick);
      map.current.off("dblclick", "squares-fill", handleRemoveSquare);
      // Mudar cursor ao passar sobre os polígonos
      map.current.on("mouseenter", "squares-fill", () => {
        map.current!.getCanvas().style.cursor = "pointer";
      });

      map.current.on("mouseleave", "squares-fill", () => {
        map.current!.getCanvas().style.cursor = "";
      });

      // Eventos nas quadras
      if (number) {
        map.current.on("click", "squares-fill", handleSquareClick);
        map.current.on("touchend", "squares-fill", handleSquareClick);
      } else if (canEdit) {
        // Eventos de remoção das quadras
        map.current.on("dblclick", "squares-fill", handleRemoveSquare);
      }
    });
  }, [territories, styleLoaded, isClient, isSuccess, isPending, mode]);

  //& ATUALIZAÇÃO DA OPACITY DAS QUADRAS
  const opacity = useMemo(() => {
    return [
      "step",
      [
        "to-number",
        ["in", ["get", "id"], ["literal", canEdit ? [] : squareList.map((sq) => sq.id)]],
      ],
      0.2,
      1,
      0.6,
    ];
  }, [squareList, canEdit]);

  useEffect(() => {
    if (map.current && styleLoaded) {
      if (map.current!.getLayer("squares-fill")) {
        //@ts-ignore
        map.current.setPaintProperty("squares-fill", "fill-opacity", opacity);
      }
    }
  }, [opacity, styleLoaded, mode]);

  useEffect(() => {
    if (number && territories && territories[0] && territories[0].doneSquaresList && styleLoaded) {
      const doneSquaresList = territories[0]?.doneSquaresList;
      setSquareList(doneSquaresList.map((id) => ({ id, canToggle: false, label: "" })));
    }
  }, [territories, number, styleLoaded]);

  //* -----------------------------------------

  //* --------------- TERRITÓRIOS ---------------
  //& FUNÇÃO DE CARREGAR TERRITÓRIOS
  async function loadTerritories() {
    if (!map.current || !territories?.length || !territories[0] || !styleLoaded || !isClient)
      return;

    setTimeout(() => {
      if (!map.current) return;

      // Removendo layers e sources existentes
      const layersToRemove = [
        "poligonos-fill",
        "poligonos-outline",
        "poligonos-number",
        "squares-fill",
        "squares-outline",
        "squares-number",
      ];
      layersToRemove.forEach((layer) => {
        if (map.current!.getLayer(layer)) {
          map.current!.removeLayer(layer);
        }
      });

      const sourcesToRemove = ["poligonos", "poligonos-labels", "squares", "squares-labels"];
      sourcesToRemove.forEach((source) => {
        if (map.current!.getSource(source)) {
          map.current!.removeSource(source);
        }
      });

      map.current.addSource("poligonos", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: territories.map((poligono) => ({
            type: "Feature",
            properties: {
              id: poligono?._id,
              color: poligono?.group?.color,
              status: poligono?.status,
              number: poligono?.number,
            },
            geometry: {
              type: "Polygon",
              coordinates: poligono?.coordinates || [],
            },
          })),
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

      // Criar um novo source para os números (centro dos territórios)
      if (!showSquares || (canEdit && mode === "territory")) {
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

        map.current.on("dblclick", "poligonos-fill", handleTerritoryClick);
        let lastTap = 0;

        map.current.on("touchend", "poligonos-fill", (e) => {
          if (e.originalEvent.touches.length > 0 || e.originalEvent.changedTouches.length > 1) {
            return; // Se houver mais de um toque, não faz nada (ignora zoom)
          }

          const currentTime = new Date().getTime();
          const tapLength = currentTime - lastTap;

          if (tapLength < 300 && tapLength > 0) {
            handleTerritoryClick(e);
          }

          lastTap = currentTime;
        });
      } else {
        // Remover eventos se a condição for falsa
        map.current.on("mouseenter", "poligonos-fill", () => {
          map.current!.getCanvas().style.cursor = "default";
        });
        map.current.on("mouseleave", "poligonos-fill", () => {
          map.current!.getCanvas().style.cursor = "default";
        });
        map.current.off("dblclick", "poligonos-fill", handleTerritoryClick);
        map.current.off("touchend", "poligonos-fill", handleTerritoryClick);
      }

      if (canEdit ? showSquares && mode === "square" : showSquares) {
        loadTerritoriesSquares();
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
          maxZoom: number ? 18 : 16,
          duration: 1000,
        });
      }
    }, 350);
  }

  //& ATUALIZAÇÃO DE TERRITÓRIOS QUANDO CHEGAM NOVOS DADOS
  useEffect(() => {
    if (territories && territories.length > 0 && territories[0] && isSuccess) {
      loadTerritories();
    }
  }, [
    territories,
    territories && territories[0],
    styleLoaded,
    isClient,
    isSuccess,
    isPending,
    mode,
  ]);

  //* -------------------------------------------

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
        {number && (
          <>
            <ButtonDate
              size={"lg"}
              variant={"success"}
              className={`aspect-square rounded-full button-slide-in ${
                squareList?.filter((sq) => sq.canToggle).length ? "visible" : ""
              }`}
              style={{ position: "absolute", bottom: "70px", right: "10px", zIndex: 1 }}
              title="Concluido"
              headerTitle="Dia que as quadras foram concluídas"
              description="As quadras selecionadas serão marcadas como concluídas"
              action={(data) =>
                doneSquares({
                  id: (territories && territories[0]._id) || "",
                  square_list: squareList,
                  data,
                })
              }
            >
              <CircleCheck size={25} />
            </ButtonDate>

            <Button
              onClick={() => {
                openSideInfo({ id: (territories && territories[0]._id) || "", mode: "territory" });
              }}
              size={"lg"}
              variant={"secondary"}
              className="aspect-square rounded-full"
              style={{ position: "absolute", bottom: "20px", right: "10px", zIndex: 1 }}
            >
              <ChevronLeft size={25} />
            </Button>
          </>
        )}
        {canEdit && <ToggleMapMode mode={mode} toggleMode={toggleMode} />}
      </div>
      <TerritorySideInfo removeFeature={deleteSelectedPolygon} editing={canEdit} />
      <SquareSideInfo removeFeature={deleteSelectedPolygon} editing={canEdit} />
      <AlertRemoveSquare />
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
