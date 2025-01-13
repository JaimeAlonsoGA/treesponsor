export interface Tree {
  id: number;
  name: string;
  type: string;
  age: number;
  latitude: number;
  longitude: number;
  production: {
    [month: string]: { kg: number; units: number } | null;
  };
}

export interface Sponsorship {
  id: number;
  treeId: number;
  clientId: number;
  startDate: string;
  endDate: string | null;
}

const mockTrees: Tree[] = [
  {
    id: 1,
    name: "Old Oak",
    type: "Oak",
    age: 150,
    latitude: 51.5074,
    longitude: -0.1278,
    production: {
      "January": null,
      "February": null,
      "March": null,
      "April": { kg: 0, units: 0 },
      "May": { kg: 2, units: 50 },
      "June": { kg: 5, units: 100 },
      "July": { kg: 10, units: 200 },
      "August": { kg: 15, units: 300 },
      "September": { kg: 10, units: 200 },
      "October": { kg: 5, units: 100 },
      "November": null,
      "December": null
    }
  },
  {
    id: 2,
    name: "Young Pine",
    type: "Pine",
    age: 25,
    latitude: 40.7128,
    longitude: -74.0060,
    production: {
      "January": { kg: 1, units: 20 },
      "February": { kg: 1, units: 20 },
      "March": { kg: 2, units: 40 },
      "April": { kg: 3, units: 60 },
      "May": { kg: 4, units: 80 },
      "June": { kg: 5, units: 100 },
      "July": { kg: 5, units: 100 },
      "August": { kg: 4, units: 80 },
      "September": { kg: 3, units: 60 },
      "October": { kg: 2, units: 40 },
      "November": { kg: 1, units: 20 },
      "December": { kg: 1, units: 20 }
    }
  },
  {
    id: 3,
    name: "Maple Beauty",
    type: "Maple",
    age: 75,
    latitude: 35.6762,
    longitude: 139.6503,
    production: {
      "January": null,
      "February": null,
      "March": { kg: 1, units: 30 },
      "April": { kg: 3, units: 90 },
      "May": { kg: 5, units: 150 },
      "June": { kg: 7, units: 210 },
      "July": { kg: 7, units: 210 },
      "August": { kg: 5, units: 150 },
      "September": { kg: 3, units: 90 },
      "October": { kg: 1, units: 30 },
      "November": null,
      "December": null
    }
  }
];

const mockSponsorships: Sponsorship[] = [
  { id: 1, treeId: 1, clientId: 1, startDate: "2023-01-01", endDate: null },
  { id: 2, treeId: 2, clientId: 1, startDate: "2023-03-15", endDate: null },
  { id: 3, treeId: 3, clientId: 1, startDate: "2023-06-01", endDate: null }
];

export async function fetchSponsoredTrees(clientId: number): Promise<Tree[]> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Filter sponsorships for the client
  const clientSponsorships = mockSponsorships.filter(s => s.clientId === clientId);

  // Get the sponsored trees
  const sponsoredTrees = mockTrees.filter(tree => 
    clientSponsorships.some(s => s.treeId === tree.id)
  );

  return sponsoredTrees;
}

