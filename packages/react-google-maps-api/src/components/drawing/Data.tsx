import * as React from "react"

import {
  unregisterEvents,
  applyUpdatersToPropsAndRegisterEvents
} from "../../utils/helper"

import MapContext from "../../map-context"

const eventMap = {
  onAddFeature: "addfeature",
  onClick: "click",
  onDblClick: "dblclick",
  onMouseDown: "mousedown",
  onMouseOut: "mouseout",
  onMouseOver: "mouseover",
  onMouseUp: "mouseup",
  onRemoveFeature: "removefeature",
  onRemoveProperty: "removeproperty",
  onRightClick: "rightclick",
  onSetGeometry: "setgeometry",
  onSetProperty: "setproperty"
}

const updaterMap = {
  add(
    instance: google.maps.Data,
    features: google.maps.Data.Feature | google.maps.Data.FeatureOptions
  ) {
    instance.add(features)
  },
  addgeojson(
    instance: google.maps.Data,
    geojson: Record<string, any>,
    options?: google.maps.Data.GeoJsonOptions
  ) {
    instance.addGeoJson(geojson, options)
  },
  contains(instance: google.maps.Data, feature: google.maps.Data.Feature) {
    instance.contains(feature)
  },
  foreach(
    instance: google.maps.Data,
    callback: (feature: google.maps.Data.Feature) => void
  ) {
    instance.forEach(callback)
  },
  loadgeojson(
    instance: google.maps.Data,
    url: string,
    options: google.maps.Data.GeoJsonOptions,
    callback: (features: google.maps.Data.Feature[]) => void
  ) {
    instance.loadGeoJson(url, options, callback)
  },
  overridestyle(
    instance: google.maps.Data,
    feature: google.maps.Data.Feature,
    style: google.maps.Data.StyleOptions
  ) {
    instance.overrideStyle(feature, style)
  },
  remove(instance: google.maps.Data, feature: google.maps.Data.Feature) {
    instance.remove(feature)
  },
  revertstyle(instance: google.maps.Data, feature: google.maps.Data.Feature) {
    instance.revertStyle(feature)
  },
  controlposition(
    instance: google.maps.Data,
    controlPosition: any // TODO: ???
  ) {
    instance.setControlPosition(controlPosition)
  },
  controls(
    instance: google.maps.Data,
    controls: google.maps.DrawingMode[] | null
  ) {
    instance.setControls(controls)
  },
  drawingmode(instance: google.maps.Data, mode: google.maps.DrawingMode) {
    instance.setDrawingMode(mode)
  },
  map(instance: google.maps.Data, map: google.maps.Map) {
    instance.setMap(map)
  },
  style(
    instance: google.maps.Data,
    style: google.maps.Data.StylingFunction | google.maps.Data.StyleOptions
  ) {
    instance.setStyle(style)
  },
  togeojson(
    instance: google.maps.Data,
    callback: (feature: Record<string, any>) => void
  ) {
    instance.toGeoJson(callback)
  }
}

interface DataState {
  data: google.maps.Data | null;
}
interface DataProps {
  options?: google.maps.Data.DataOptions;
  onAddFeature?: (e: google.maps.Data.AddFeatureEvent) => void;
  onClick?: (e: google.maps.MouseEvent) => void;
  onDblClick?: (e: google.maps.MouseEvent) => void;
  onMouseDown?: (e: google.maps.MouseEvent) => void;
  onMouseOut?: (e: google.maps.MouseEvent) => void;
  onMouseOver?: (e: google.maps.MouseEvent) => void;
  onMouseUp?: (e: google.maps.MouseEvent) => void;
  onRemoveFeature?: (e: google.maps.Data.RemoveFeatureEvent) => void;
  onRemoveProperty?: (e: google.maps.Data.RemovePropertyEvent) => void;
  onRightClick?: (e: google.maps.MouseEvent) => void;
  onSetGeometry?: (e: google.maps.Data.SetGeometryEvent) => void;
  onSetProperty?: (e: google.maps.Data.SetPropertyEvent) => void;
  onLoad?: (data: google.maps.Data) => void;
  onUnmount?: (data: google.maps.Data) => void;
}

export class Data extends React.PureComponent<DataProps, DataState> {
  static contextType = MapContext

  registeredEvents: google.maps.MapsEventListener[] = []

  state: DataState = {
    data: null
  }

  // eslint-disable-next-line @getify/proper-arrows/this, @getify/proper-arrows/name
  setDataCallback = () => {
    if (this.state.data !== null && this.props.onLoad) {
      this.props.onLoad(this.state.data)
    }
  }

  componentDidMount() {
    const data = new google.maps.Data({
      ...(this.props.options || {}),
      map: this.context
    })

    function setData() {
      return {
        data
      }
    }

    this.setState(setData, this.setDataCallback)
  }

  componentDidUpdate(prevProps: DataProps) {
    if (this.state.data !== null) {
      unregisterEvents(this.registeredEvents)

      this.registeredEvents = applyUpdatersToPropsAndRegisterEvents({
        updaterMap,
        eventMap,
        prevProps,
        nextProps: this.props,
        instance: this.state.data
      })
    }
  }

  componentWillUnmount() {
    if (this.state.data !== null) {
      if (this.props.onUnmount) {
        this.props.onUnmount(this.state.data)
      }

      unregisterEvents(this.registeredEvents)

      if (this.state.data) {
        this.state.data.setMap(null)
      }
    }
  }

  render() {
    return null
  }
}

export default Data
