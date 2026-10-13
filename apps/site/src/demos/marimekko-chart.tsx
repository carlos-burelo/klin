import { ChartTooltipPortal, MarimekkoChart } from "@carlos-burelo/klin";

export default function MarimekkoChartDemo() {
  return (
    <ChartTooltipPortal>
      <MarimekkoChart
        ariaLabel="Matrícula por universidad y turno: la UNAM concentra la mayor matrícula y el turno matutino domina en todas"
        data={[
          {
            universidad: "UNAM",
            matricula: 370000,
            matutino: 220000,
            vespertino: 150000,
          },
          {
            universidad: "UdeG",
            matricula: 320000,
            matutino: 180000,
            vespertino: 140000,
          },
          {
            universidad: "UANL",
            matricula: 210000,
            matutino: 130000,
            vespertino: 80000,
          },
          {
            universidad: "BUAP",
            matricula: 95000,
            matutino: 60000,
            vespertino: 35000,
          },
        ]}
        xKey="universidad"
        widthKey="matricula"
        series={[
          { key: "matutino", label: "Matutino" },
          { key: "vespertino", label: "Vespertino" },
        ]}
      />
    </ChartTooltipPortal>
  );
}
