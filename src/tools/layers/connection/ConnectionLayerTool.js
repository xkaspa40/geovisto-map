import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as d3 from "d3";
import rfdc from "rfdc";
import "./style/connectionLayer.scss";
import ConnectionLayerToolTabControl from "./sidebar/ConnectionLayerToolTabControl";
import ConnectionLayerToolState from "./ConnectionLayerToolState";
import ConnectionLayerToolDefaults from "./ConnectionLayerToolDefaults";
import SelectionTool from "../../selection/SelectionTool";
import AbstractLayerTool from "../abstract/AbstractLayerTool";
import DataChangeEvent from "../../../model/event/basic/DataChangeEvent";
import SelectionToolEvent from "../../selection/model/event/SelectionToolEvent";
import ThemesToolEvent from "../../themes/model/event/ThemesToolEvent";
import D3PathForceSimulator from "./util/D3PathForceSimulator";
import ProjectionUtil from "./util/ProjectionUtil";
import TimeChangeEvent from "../../timeline/model/TimeChangeEvent";

/**
 * This class represents Connection layer tool. It uses SVG layer and D3 to draw the lines.
 *
 * @author Jiri Hynek
 */
class ConnectionLayerTool extends AbstractLayerTool {

    /**
     * It creates a new tool with respect to the props.
     *
     * @param {*} props
     */
    constructor(props) {
        super(props);
        this.connectionsPaths = {};
    }

    /**
     * A unique string of the tool type.
     */
    static TYPE() {
        return "geovisto-tool-layer-connection";
    }

    /**
     * It creates a copy of the uninitialized tool.
     */
    copy() {
        return new ConnectionLayerTool(this.getProps());
    }

    /**
     * It creates new defaults of the tool.
     */
    createDefaults() {
        return new ConnectionLayerToolDefaults();
    }

    /**
     * It returns default tool state.
     */
    createState() {
        return new ConnectionLayerToolState();
    }

    /**
     * It creates new tab control.
     */
    createSidebarTabControl() {
        return new ConnectionLayerToolTabControl({ tool: this });
    }

    /**
     * Help function which acquires and returns the selection tool if available.
     */
    getSelectionTool() {
        if(this.selectionTool == undefined) {
            let tools = this.getMap().getState().getTools().getByType(SelectionTool.TYPE());
            if(tools.length > 0) {
                this.selectionTool = tools[0];
            }
        }
        return this.selectionTool;
    }

    /**
     * It creates layer items.
     */
    createLayerItems() {
        // create Leaflet SVG layer
        let layer = L.svg();

        // update state
        this.getState().setLayer(layer);

        // prepare data
        const data = this.getMap().getState().getCurrentData();
        this.prepareMapData(data);

        return [ layer ];
    }

    /**
     * It deletes layer items.
     */
    deleteLayerItems() {
        let layer = this.getState().getLayer();

        // get layer element
        if(layer._container != undefined) {
            let layerElement = layer._container.childNodes[0];
            // delete layer element's children (connections)
            while (layerElement.firstChild) {
                layerElement.removeChild(layerElement.lastChild);
            }
        }
    }

    /**
     * It prepares data for connections.
     */
    prepareMapData(data) {
        let workData = {
            nodes: [],
            connections: []
        };

        var map = this.getMap().getState().getLeafletMap();
        let projectPoint = ProjectionUtil.getDataProjectionFunction(map, this.getDefaults().getProjectionZoom());

         // prepare data
         let mapData = this.getMap().getState().getMapData();
         let fromDataDomain = mapData.getDataDomain(this.getState().getDataMapping()[this.getDefaults().getDataMappingModel().from.name]);
         let toDataDomain = mapData.getDataDomain(this.getState().getDataMapping()[this.getDefaults().getDataMappingModel().to.name]);
         let geoFrom, geoTo, actFrom, actTo, actConnection;
         let foundFrom, foundTo;
         let dataLen = data.length;
         let clone = new rfdc();
         let centroids = this.getState().getCentroids();
         for (let i = 0; i < dataLen; i++) {
            //console.log(fromDataDomain, toDataDomain);

            // find the 'from' properties
            foundFrom = mapData.getItemValues(fromDataDomain, data[i]);
            //console.log("search from: ", foundFrom);

            // find the 'to' properties
            foundTo = mapData.getItemValues(toDataDomain, data[i]);
            //console.log("search to: ", foundTo);

            // since the data are flattened we can expect max one found item
            if(foundFrom.length == 1 && foundTo.length == 1) {
                // test if country exists in the map
                geoFrom = centroids.find(x => x.id == foundFrom[0]);
                if(geoFrom != undefined) {
                    // test if country exists in the map
                    geoTo = centroids.find(x => x.id == foundTo[0]);
                    if(geoTo != undefined) {
                        // add 'from' country to node list
                        actFrom = workData.nodes.find(x => x.id == foundFrom[0]);
                        if(actFrom == undefined) {
                            actFrom = clone(geoFrom);
                            projectPoint(actFrom);
                            workData.nodes.push(actFrom);
                        }
                        // add 'to' country to node list
                        actTo = workData.nodes.find(x => x.id == foundTo[0]);
                        if(actTo == undefined) {
                            actTo = clone(geoTo);
                            projectPoint(actTo);
                            workData.nodes.push(actTo);
                        }
                        // add connection to connection list
                        actConnection = workData.connections.find(x => x.source.id == foundFrom[0] && x.target.id == foundTo[0]);
                        if(actConnection == undefined) {
                            actConnection = {
                                source: actFrom,
                                target: actTo,
                                count: 1
                            }
                            workData.connections.push(actConnection);
                        } else {
                            actConnection.count++;
                        }
                    }
                }
            }
        }

        // update work data
        this.getState().setWorkData(workData);
        //console.log("workData", workData);
    }

    /**
     * This function is called when layer items are rendered.
     * It use the D3 force layout simulation to arrange the connections.
     */
    postCreateLayerItems() {
        let layer = this.getState().getLayer();

        if(layer != null) {
            // get overleay pane
            let overlayPane = d3.select(layer._map.getPanes().overlayPane);

            // get <svg> element (expect L.svg() layer)
            this.layerSvg = overlayPane.select("svg");
                // uncoment this in case of non-smooth zoom animation
                //.attr("class", "leaflet-zoom-hide")

            // create d3 force layout simulator
            let workData = this.getState().getWorkData();
            var d3ForceSimulator = new D3PathForceSimulator({
                nodes: workData.nodes,
                connections: workData.connections
            });

            // get projection path function
            // geographic locations [lat, lng] of nodes needs to be projected to leaflet map
            // we use the zoom preferred for the force layout simulation
            var map = this.getMap().getState().getLeafletMap();
            var projectionPathFunction = ProjectionUtil.getPathProjectionFunction(map, this.getDefaults().getProjectionZoom());

            // const pathData = Object.values(d3ForceSimulator.getPaths())
            // const pathsData = Object.values(d3ForceSimulator.getPaths())
            //     .reduce((paths, connectionPaths) => ([...paths, ...connectionPaths]), []);
            const connectionsIds = [
                ...Object.keys(this.connectionsPaths),
                ...Object.keys(d3ForceSimulator.getPaths())
            ];
            const pathsData = connectionsIds.reduce((acc, connectionId) => ({
                ...acc,
                [connectionId]: d3ForceSimulator.getPaths()[connectionId] || [],
            }), {});
            // draw paths
            const animateDirection = this.tabControl.getInputValues()[this.getDefaults()
                .getDataMappingModel().animateDirection.name]
            Object.entries(pathsData).forEach(([id, paths]) => {
                this.connectionsPaths[id] = this.layerSvg.selectAll(`path.leaflet-layer-connection.${id}`)
                    .data(paths)
                    .enter()
                    .append("path")
                    .attr("d", projectionPathFunction)
                    .attr("class", `leaflet-layer-connection ${id}`)
                    .classed("leaflet-layer-connection-dashed", animateDirection)
                    .style("stroke-opacity", 0)
                    .transition()
                    .duration(300)
                    .style("stroke-opacity", 0.4);
            })

            // update paths with respect to actual map state (zoom, move)
            let updatePaths = () => this.layerSvg.selectAll("path").attr("d", projectionPathFunction);

            // highlight connections with respect to the selection of the selection tool if available
            if(this.getSelectionTool()) {
                this.onSelectionUpdate(this.getSelectionTool().getState().getSelection());
            }

            // map move/zoom listener
            map.on("moveend", updatePaths);
            // initial update
            updatePaths();

            // run force layout algorithm
            d3ForceSimulator.run(
                updatePaths,
                () => {
                    if (animateDirection) {
                        this.animateDirection(true);
                    }
                },
            );
        }
    }

    /**
     * It reloads data and redraw the layer.
     */
    redraw() {
        let layer = this.getState().getLayer()
        if(layer != undefined && layer._container != undefined) {
            // delete actual items
            this.deleteLayerItems();

            // prepare data
            const data = this.getMap().getState().getCurrentData();
            this.prepareMapData(data);

            // update map
            this.postCreateLayerItems();
        }
    }

    /**
     * This function is called when a custom event is invoked.
     *
     * @param {AbstractEvent} event
     */
    handleEvent(event) {
        if(event.getType() == DataChangeEvent.TYPE()) {
            if (event.getSource() === "timeline") return;
            // data change
            this.redraw();
        } else if(event.getType() == SelectionToolEvent.TYPE()) {
            // selection change
            this.onSelectionUpdate(event.getObject())
        } else if(event.getType() == ThemesToolEvent.TYPE()) {
            var map = event.getObject();
            document.documentElement.style.setProperty('--layer-connection', map.getDataColors().lineColor);
            document.documentElement.style.setProperty('--layer-connection-highlight',map.getHighlightColor().highlight);
            document.documentElement.style.setProperty('--layer-connection-other', map.getHighlightColor().deempasize);
        } else if (event.getType() === TimeChangeEvent.TYPE()) {
            this.prepareMapData(event.getObject());
            this.onTimeChange(event.getObject());
        }
    }

    animateDirection(animate) {
        const connections = this.layerSvg.selectAll("path.leaflet-layer-connection");
        if (animate) {
            this.animationInterval && clearInterval(this.animationInterval);
            let offset = 0;
            connections.style("stroke-dasharray", "10,4")
            this.animationInterval = setInterval(() => {
                connections.style("stroke-dashoffset", offset);
                offset += 1;
            }, 100);
        }
        if (!animate && this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
            connections.selectAll("path.leaflet-layer-connection").style("stroke-dasharray", "none")
        }
    }

    onTimeChange() {
        let workData = this.getState().getWorkData();
        var d3ForceSimulator = new D3PathForceSimulator({
            nodes: workData.nodes,
            connections: workData.connections
        });

        // get projection path function
        // geographic locations [lat, lng] of nodes needs to be projected to leaflet map
        // we use the zoom preferred for the force layout simulation
        const map = this.getMap().getState().getLeafletMap();
        const projectionPathFunction = ProjectionUtil.getPathProjectionFunction(map, this.getDefaults().getProjectionZoom());
        const connectionsIds = [...new Set([
            ...Object.keys(this.connectionsPaths),
            ...Object.keys(d3ForceSimulator.getPaths())
        ])];
        const pathsData = connectionsIds.reduce((acc, connectionId) => ({
            ...acc,
            [connectionId]: d3ForceSimulator.getPaths()[connectionId] || [],
        }), {});
        // draw paths
        const animateDirection = this.tabControl.getInputValues()[this.getDefaults()
            .getDataMappingModel().animateDirection.name]

        Object.entries(pathsData).forEach(([id, paths]) => {
            this.connectionsPaths[id] = this.layerSvg.selectAll(`path.leaflet-layer-connection.${id}`)
                .data(paths);
            this.connectionsPaths[id].enter()
                .append("path")
                .attr("d", projectionPathFunction)
                .attr("class", `leaflet-layer-connection ${id}`)
                .classed("leaflet-layer-connection-dashed", animateDirection)
                .style("stroke-opacity", 0)
                .transition()
                .duration(250)
                .style("stroke-opacity", 0.4)
            this.connectionsPaths[id].exit()
                .transition()
                .duration(250)
                .style("stroke-opacity", 0)
                .remove()
        })

        // update paths with respect to actual map state (zoom, move)
        let updatePaths = () => this.layerSvg.selectAll("path").attr("d", projectionPathFunction);


        // highlight connections with respect to the selection of the selection tool if available
        if(this.getSelectionTool()) {
            this.onSelectionUpdate(this.getSelectionTool().getState().getSelection());
        }

        // map move/zoom listener
        map.on("moveend", updatePaths);
        // initial update
        updatePaths();

        if (animateDirection) {
            this.animateDirection(true);
        }

        // run force layout algorithm
        d3ForceSimulator.run(updatePaths, undefined);
    }

    /**
     * It highlights connections with respect to the given selection.
     */
    onSelectionUpdate(selection) {
        let layer = this.getState().getLayer();
        if(layer != undefined && layer._container != undefined) {
            // get overleay pane, svg g element and paths
            let paths = this.layerSvg.selectAll("path.leaflet-layer-connection");

            if(selection && selection.getSrcIds().length > 0) {
                let selectionSrcIds = selection.getSrcIds();

                // process all paths and find the affected ones
                let from, to;
                let affectedIds = [];
                paths.each(function(d) {
                    // from
                    from = d[0].id;
                    to = d[d.length-1].id;
                    if(selectionSrcIds.includes(from)) {
                        // highlight
                        this.classList.add("leaflet-layer-connection-highlight");
                        this.classList.remove("leaflet-layer-connection-other");
                        // check affected country
                        if(!affectedIds.includes(to)) {
                            affectedIds.push(to);
                        }
                    } else if(selectionSrcIds.includes(to)) {
                        // highlight
                        this.classList.add("leaflet-layer-connection-highlight");
                        this.classList.remove("leaflet-layer-connection-other");
                        // check affected country
                        if(!affectedIds.includes(from)) {
                            affectedIds.push(from);
                        }
                    } else {
                        //if(this.getAttribute("class") == "leaflet-layer-connection") {
                            // deemphasize if it is not already highlighted
                            this.classList.add("leaflet-layer-connection-other");
                            this.classList.remove("leaflet-layer-connection-highlight");
                        //}
                    }
                });

                // update selection with respect to the affected countries
                //console.log("affected", affectedIds);
                if(affectedIds.length > 0) {
                    let selectionTool = this.getSelectionTool();
                    if(selectionTool) {
                        let length = selection.getIds().length;
                        selection.addIds(affectedIds);
                        // check if selection has changed
                        // take only the paths which have not been already processed
                        // this prevents cyclic processing
                        if(length != selection.getIds().length) {
                            selectionTool.setSelection(selection);
                        }
                    }
                }
            } else {
                // set the default path style
                paths
                    .classed("leaflet-layer-connection-highlight", false)
                    .classed("leaflet-layer-connection-other", false);
            }
        }
    }
}
export default ConnectionLayerTool;
