/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
export type {
  ArcDiagramProps,
  ArcLink,
  ArcNode,
} from "./components/arc-diagram";
export { ArcDiagram } from "./components/arc-diagram";
export type {
  ArchEdge,
  ArchitectureDiagramProps,
  ArchNode,
} from "./components/architecture-diagram";
export { ArchitectureDiagram } from "./components/architecture-diagram";
export type { AreaChartProps, AreaSeries } from "./components/area-chart";
export { AreaChart } from "./components/area-chart";
export type { BarChartProps, BarSeries } from "./components/bar-chart";
export { BarChart } from "./components/bar-chart";
export type { BoxGroup, BoxPlotProps } from "./components/box-plot";
export { BoxPlot } from "./components/box-plot";
export type { BulletChartProps, BulletRow } from "./components/bullet-chart";
export { BulletChart } from "./components/bullet-chart";
export type { CalendarHeatmapProps } from "./components/calendar-heatmap";
export { CalendarHeatmap } from "./components/calendar-heatmap";
export type {
  ClassDiagramProps,
  ClassEdge,
  ClassNode,
} from "./components/class-diagram";
export { ClassDiagram } from "./components/class-diagram";
export type { DivergingBarProps } from "./components/diverging-bar";
export { DivergingBar } from "./components/diverging-bar";
export type {
  DonutChartProps,
  DonutDatum,
  PieChartProps,
} from "./components/donut-chart";
export { DonutChart, PieChart } from "./components/donut-chart";
export type { ChartEmptyProps } from "./components/empty";
export { ChartEmpty, EMPTY_TITLE } from "./components/empty";
export type {
  ErAttribute,
  ErDiagramProps,
  ErEntity,
  ErRelation,
} from "./components/er-diagram";
export { ErDiagram } from "./components/er-diagram";
export type {
  FlowChartProps,
  FlowEdge,
  FlowNode,
} from "./components/flow-chart";
export { FlowChart } from "./components/flow-chart";
export type { FunnelChartProps, FunnelStage } from "./components/funnel-chart";
export { FunnelChart } from "./components/funnel-chart";
export type { GanttChartProps, GanttTask } from "./components/gantt-chart";
export { GanttChart } from "./components/gantt-chart";
export type { GaugeChartProps } from "./components/gauge-chart";
export { GaugeChart } from "./components/gauge-chart";
export type {
  HBarSeries,
  HorizontalBarChartProps,
} from "./components/hbar-chart";
export { HorizontalBarChart } from "./components/hbar-chart";
export type { MatrixHeatmapProps } from "./components/heatmap";
export { MatrixHeatmap } from "./components/heatmap";
export type { HistogramProps } from "./components/histogram";
export { Histogram } from "./components/histogram";
export type {
  KanbanBoardProps,
  KanbanCard,
  KanbanColumn,
} from "./components/kanban-board";
export { KanbanBoard } from "./components/kanban-board";
export type { ChartLegendProps, LegendItem } from "./components/legend";
export { ChartLegend } from "./components/legend";
export type { LineChartProps, LineSeries } from "./components/line-chart";
export { LineChart } from "./components/line-chart";
export type { LollipopChartProps } from "./components/lollipop-chart";
export { LollipopChart } from "./components/lollipop-chart";
export type {
  MindmapDiagramProps,
  MindNode,
} from "./components/mindmap-diagram";
export { MindmapDiagram } from "./components/mindmap-diagram";
export type {
  NetworkGraphProps,
  NetworkLink,
  NetworkNode,
} from "./components/network-graph";
export { NetworkGraph } from "./components/network-graph";
export type {
  NetworkTopologyProps,
  TopoLink,
  TopoNode,
  TopoRole,
} from "./components/network-topology";
export { NetworkTopology } from "./components/network-topology";
export type { OrgChartProps, OrgNode } from "./components/org-chart";
export { OrgChart } from "./components/org-chart";
export type { ParetoChartProps } from "./components/pareto-chart";
export { ParetoChart } from "./components/pareto-chart";
export type {
  ProgressListProps,
  ProgressRow,
} from "./components/progress-list";
export { ProgressList } from "./components/progress-list";
export type { PyramidChartProps } from "./components/pyramid-chart";
export { PyramidChart } from "./components/pyramid-chart";
export type {
  QuadrantChartProps,
  QuadrantPoint,
} from "./components/quadrant-chart";
export { QuadrantChart } from "./components/quadrant-chart";
export type { RadarChartProps, RadarSeries } from "./components/radar-chart";
export { RadarChart } from "./components/radar-chart";
export type { RadialProgressProps } from "./components/radial-progress";
export { RadialProgress } from "./components/radial-progress";
export type {
  SankeyDiagramProps,
  SankeyFlow,
  SankeyNode,
} from "./components/sankey-diagram";
export { SankeyDiagram } from "./components/sankey-diagram";
export type { ScatterPlotProps, ScatterPoint } from "./components/scatter-plot";
export { ScatterPlot } from "./components/scatter-plot";
export type {
  SequenceDiagramProps,
  SequenceMessage,
} from "./components/sequence-diagram";
export { SequenceDiagram } from "./components/sequence-diagram";
export type { SparklineProps } from "./components/sparkline";
export { Sparkline } from "./components/sparkline";
export type {
  StackedBarProps,
  StackRow,
  StackSegment,
} from "./components/stacked-bar";
export { StackedBar } from "./components/stacked-bar";
export type {
  StateDiagramProps,
  StateEdge,
  StateNode,
} from "./components/state-diagram";
export { StateDiagram } from "./components/state-diagram";
export type { StreamgraphProps, StreamSeries } from "./components/streamgraph";
export { Streamgraph } from "./components/streamgraph";
export type {
  SunburstChartProps,
  SunburstNode,
} from "./components/sunburst-chart";
export { SunburstChart } from "./components/sunburst-chart";
export type {
  TimelineChartProps,
  TimelineEvent,
} from "./components/timeline-chart";
export { TimelineChart } from "./components/timeline-chart";
export type { ChartTooltipPortalProps } from "./components/tooltip-portal";
export { ChartTooltipPortal } from "./components/tooltip-portal";
export type { TreeItem, TreeViewProps } from "./components/tree-view";
export { TreeView } from "./components/tree-view";
export type {
  TreemapChartProps,
  TreemapNode,
} from "./components/treemap-chart";
export { TreemapChart } from "./components/treemap-chart";
export type {
  ActorNode,
  UseCaseDiagramProps,
  UseCaseEdge,
  UseCaseNode,
} from "./components/usecase-diagram";
export { UseCaseDiagram } from "./components/usecase-diagram";
export type { VennDiagramProps, VennSet } from "./components/venn-diagram";
export { VennDiagram } from "./components/venn-diagram";
export type {
  VerticalStackedBarProps,
  VStackSeries,
} from "./components/vstacked-bar";
export { VerticalStackedBar } from "./components/vstacked-bar";
export type { WaffleChartProps, WafflePart } from "./components/waffle-chart";
export { WaffleChart } from "./components/waffle-chart";
export type {
  WardleyLink,
  WardleyMapProps,
  WardleyNode,
} from "./components/wardley-map";
export { WardleyMap } from "./components/wardley-map";
export type {
  WaterfallChartProps,
  WaterfallStep,
} from "./components/waterfall-chart";
export { WaterfallChart } from "./components/waterfall-chart";
export type {
  DescribedProps,
  RootStyleProps,
  ValueAnnotation,
} from "./lib/api";
export { domainWithZero, topPositive } from "./lib/domain";
export type { ChartMargin, ChartSvgProps, YGridProps } from "./lib/frame";
export { CHART_MARGIN, CHART_W, ChartSvg, YGrid } from "./lib/frame";
export type {
  DagEdge,
  DagLayout,
  DagNode,
  EdgeLabelProps,
  PlacedNode,
  RoutedEdge,
} from "./lib/graph";
export { EdgeLabel, fitNodeWidth, layoutDag, measureText } from "./lib/graph";
export { slugify, stableKey } from "./lib/keys";
export {
  DEFAULT_MAX_LEAVES,
  DEFAULT_MAX_LINKS,
  DEFAULT_MAX_NODES,
  DEFAULT_MAX_ROWS,
} from "./lib/limits";
export {
  clamp01,
  maxFinite,
  minFinite,
  sumNumbers,
  toNumber,
} from "./lib/number";
export type { ValueFormatter } from "./lib/palette";
export {
  CHART_PALETTE,
  formatDefault,
  seriesColor,
  seriesColors,
  truncateLabel,
} from "./lib/palette";
export type { ChartSeries } from "./lib/series";
export {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  AREA_FILL_OPACITY,
  BAR_RADIUS,
  CHART_TOKEN,
  CHART_WIDTH,
  EDGE_LABEL_CHAR_WIDTH,
  EDGE_LABEL_DY,
  EDGE_LABEL_FONT_SIZE,
  EDGE_LABEL_HEIGHT,
  EDGE_LABEL_MAX_CHARS,
  EDGE_LABEL_MIN_WIDTH,
  EDGE_LABEL_PAD_X,
  EDGE_WIDTH,
  ELLIPSIS,
  EMPTY_CELL_OPACITY,
  FONT_MONO,
  FONT_SEMIBOLD,
  GRID_TICKS,
  GRID_WIDTH,
  LABEL_GAP_PX,
  LABEL_MAX_DEFAULT,
  LINE_WIDTH,
  LINK_OPACITY,
  MIN_SHAPE_PX,
  MISSING_VALUE,
  NETWORK_CHARGE,
  NETWORK_COLLIDE,
  NETWORK_LINK_DISTANCE,
  NETWORK_NODE_GROWTH,
  NETWORK_NODE_MAX_GROWTH,
  NETWORK_NODE_MIN_R,
  NETWORK_SEED,
  NETWORK_TICKS,
  NODE_BORDER_WIDTH,
  NODE_RADIUS,
  PERCENT_FACTOR,
  POINT_BORDER,
  POINT_RADIUS,
  POINT_RADIUS_RADAR,
  POINT_RADIUS_SCATTER,
  SANKEY_NODE_PADDING,
  SANKEY_NODE_WIDTH,
  TEXT_MONO_RATIO,
  TEXT_SANS_RATIO,
  TICK_DY,
  TICK_FONT_SIZE,
  TICK_GAP_PX,
  TOOLTIP_HEIGHT,
  TOOLTIP_MARGIN_PX,
  TOOLTIP_OFFSET,
  TOOLTIP_WIDTH,
  ZERO_MARK_PX,
} from "./lib/theme";
