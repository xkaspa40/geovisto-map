import React, {Component} from "react";
import '../styles/common.scss';
import GeovistoMap from "../model/internal/map/GeovistoMap";

/**
 * React component which wraps Geovisto map.
 * 
 * @author Jiri Hynek
 */
class ReactGeovistoMap extends Component {

    /**
     * Initializes object.
     * 
     * @param props 
     */
    constructor(props) {
        super(props);

        if(props.id == undefined) props.id = this.getDefaultId();

        // create new Geovisto map
        this.m = new GeovistoMap(props);
    }

    /**
     * It returns Geovisto map.
     */
    getMap() {
        return this.m;
    }

    /**
     * It returns a default id used for Geovisto map container.
     */
    getDefaultId() {
        return 'my-geovisto-map';
    }

    /**
     * It returns a default class name used for Geovisto map container.
     */
    getDefaultClass() {
        return 'geovisto-map';
    }

    /**
     * Draw map after component is rendered
     */
    componentDidMount() {
        // draw map with the current config
        this.m.draw(this.props.config);
    }

    /**
     * Redraw map after component is updated
     */
    componentDidUpdate() {
        // redraw map with a new config and new props
        this.m.redraw(this.props.config, this.props);
    }

    /**
     * The render function prepares a wrapper which will be used by Geovisto/Leaflet to render the map.
     */
    render() {
        return <div id={this.props.id} className={this.getDefaultClass()} />;
    }
};

export default ReactGeovistoMap;
