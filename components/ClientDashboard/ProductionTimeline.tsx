import { Tree } from '@/utils/mockData'

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export function ProductionTimeline({ trees }: { trees: Tree[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Tree</th>
            {months.map(month => (
              <th key={month} className="px-4 py-2">{month.substring(0, 3)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {trees.map(tree => (
            <tr key={tree.id}>
              <td className="border px-4 py-2">{tree.name}</td>
              {months.map(month => (
                <td key={month} className="border px-4 py-2">
                  {tree.production[month] ? (
                    <div className="w-full bg-green-500 h-4" title={`${tree.production[month]?.kg} kg / ${tree.production[month]?.units} units`}></div>
                  ) : (
                    <div className="w-full bg-gray-200 h-4"></div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

