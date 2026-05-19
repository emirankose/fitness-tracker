import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const CHART_COLORS = {
  grid: 'rgba(148, 163, 184, 0.12)',
  axis: '#8b9cb3',
  line: '#34d399',
  dot: '#818cf8',
  tooltipBg: '#141f2e',
  tooltipBorder: 'rgba(129, 140, 248, 0.35)',
}

function WeightChart({ data }) {
  if (!data.length) {
    return (
      <div className="ui-empty progress-chart__empty">
        <span className="ui-empty__icon" aria-hidden="true">
          📉
        </span>
        <p className="ui-empty__text">Grafik için veri yok</p>
        <p className="ui-empty__hint">En az bir kilo kaydı eklediğinizde grafik burada görünür.</p>
      </div>
    )
  }

  return (
    <div className="progress-chart">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="4 4" stroke={CHART_COLORS.grid} />
          <XAxis
            dataKey="date"
            tick={{ fill: CHART_COLORS.axis, fontSize: 12 }}
            axisLine={{ stroke: CHART_COLORS.grid }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: CHART_COLORS.axis, fontSize: 12 }}
            axisLine={{ stroke: CHART_COLORS.grid }}
            tickLine={false}
            domain={['auto', 'auto']}
            unit=" kg"
          />
          <Tooltip
            contentStyle={{
              background: CHART_COLORS.tooltipBg,
              border: `1px solid ${CHART_COLORS.tooltipBorder}`,
              borderRadius: 8,
              color: '#f8fafc',
            }}
            labelStyle={{ color: '#94a3b8' }}
            formatter={(value) => [`${value} kg`, 'Kilo']}
            labelFormatter={(_, payload) =>
              payload?.[0]?.payload?.fullDate
                ? new Date(`${payload[0].payload.fullDate}T12:00:00`).toLocaleDateString(
                    'tr-TR',
                  )
                : ''
            }
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke={CHART_COLORS.line}
            strokeWidth={2}
            dot={{ fill: CHART_COLORS.dot, stroke: CHART_COLORS.line, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: CHART_COLORS.line, stroke: '#f8fafc', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default WeightChart
