import { useEffect, useRef } from "react";
import { ICodeplotShape } from "./ICodeplotShape";

export function DefaultMimeApplicationPlotlyV1Render({
  shape,
}: IDefaultMimeApplicationPlotlyV1RenderProps) {
  const { data, layout, config } = JSON.parse(
    JSON.stringify(
      shape.props.mime[
        "application/vnd.plotly.v1+json"
      ] as unknown as ChartProps,
    ),
  );

  return (
    data && (
      <div className="h-full w-full overflow-auto invert bg-[var(--codeplot-surface2-backgroundColor)]">
        <Plot data={data} layout={layout} config={config} />
      </div>
    )
  );
}

interface ChartProps {
  data?: Plotly.Data[];
  layout: Partial<Plotly.Layout>;
  frames?: Plotly.Frame[];
  config?: Partial<Plotly.Config>;
}

const Plot: React.FC<ChartProps> = ({ ...props }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !props.data) return;

    window.Plotly.newPlot(ref.current, props.data, props.layout, props.config);
  }, [props]);

  return <div ref={ref} style={{ width: "100%", height: "100%" }} />;
};

type IDefaultMimeApplicationPlotlyV1RenderProps = {
  shape: ICodeplotShape;
};
