import { Tree } from '@/app/utils/mockData'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function TreeList({ trees }: { trees: Tree[] }) {
  return (
    <div className="space-y-4">
      {trees.map((tree) => (
        <Card key={tree.id}>
          <CardHeader>
            <CardTitle>{tree.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Type:</strong> {tree.type}</p>
            <p><strong>Age:</strong> {tree.age} years</p>
            <p><strong>Location:</strong> {tree.latitude.toFixed(4)}, {tree.longitude.toFixed(4)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

