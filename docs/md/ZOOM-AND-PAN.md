
[source](https://github.com/mahanteshsc/react-stockcharts/blob/master/docs/lib/charts/CandleStickChartWithZoomPan.jsx), [block](http://bl.ocks.org/rrag/a8465abe0061df1b7976), [plunker](http://plnkr.co/edit/gist:a8465abe0061df1b7976?p=preview)


Click and drag the axis, to zoom on y & x. Once y axis is zoomed you can pan the chart on both x & y axis. Reset the y axis domain with the "Reset y domain" button

`mousemove`, `pan` and `zoom` are enabled by default. To disable them you can use `mouseMoveEvent`, `panEvent` and `zoomEvent` props.

`clamp` is disabled by default

```jsx
<ChartCanvas 
    ...
    mouseMoveEvent={true}
    panEvent={true}
    zoomEvent={true}
    clamp={false}
    ...
/>
```
